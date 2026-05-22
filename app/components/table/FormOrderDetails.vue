<template>
  <UForm
    :schema="processOrderSchema"
    :state="state"
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <div class="flex justify-between items-center pb-2 border-b border-default">
      <h2 class="text-xl font-bold text-highlighted">
        {{ tableName || 'Sin mesa' }}
        <span v-if="order.customerName" class="text-muted font-normal text-lg">
          — {{ order.customerName }}
        </span>
      </h2>
      <UBadge :color="statusColor" variant="subtle">
        {{ statusDisplay }}
      </UBadge>
    </div>

    <!-- Customer Info -->
    <div v-if="order.customerName" class="flex items-center gap-2 text-sm text-muted bg-elevated/30 p-3 rounded-lg border border-default">
      <UIcon name="i-lucide-user" class="w-4 h-4 text-primary" />
      <span class="font-medium text-highlighted">Cliente:</span>
      <span>{{ order.customerName }}</span>
    </div>

    <!-- Status change (for Mozo/Chef) -->
     <!--     <div v-if="canChangeStatus && nextStatusInfo" class="space-y-2">
      <h3 class="text-sm font-semibold text-muted uppercase tracking-wider">
        Cambiar Estado
      </h3>
      <UButton
        size="sm"
        :color="nextStatusInfo.color"
        :icon="nextStatusInfo.icon"
        @click="emit('changeStatus', order.id, nextStatus!)"
      >
        {{ nextStatusInfo.label }}
      </UButton>
    </div> -->

    <div class="flex flex-col gap-3">
      <h3 class="text-sm font-semibold text-muted uppercase tracking-wider">
        Productos
      </h3>
      <UPageCard
        v-for="product in (order.products || [])"
        :key="product.id"
        :title="product.name"
        :description="`${formatPrice(product.priceUnitary)} x ${product.quantity}`"
        orientation="horizontal"
      >
        <div class="flex h-full items-center justify-end p-4 text-lg font-bold text-primary">
          {{ formatPrice(product.priceUnitary * product.quantity) }}
        </div>
      </UPageCard>
    </div>

    <!-- Payment section (only when order is Listo or Entregado) -->
    <template v-if="canProcessPayment">
      <UFormField label="Método de Pago" name="paymentMethod">
        <URadioGroup
          v-model="state.paymentMethod"
          orientation="horizontal"
          variant="list"
          :items="saleMethods"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Propina (Opcional)" name="tip" class="mt-4">
        <UInput
          v-model.number="state.tip"
          type="number"
          min="0"
          step="0.5"
          placeholder="0.00"
          icon="i-lucide-coins"
        />
      </UFormField>
    </template>

    <div class="flex justify-between items-center mt-2 border-t border-default pt-4">
      <div class="flex flex-col">
        <div v-if="state.tip" class="text-sm text-muted mb-1">
          Subtotal: {{ formatPrice(subtotal) }} <br>
          Propina: {{ formatPrice(state.tip) }}
        </div>
        <div class="text-2xl font-bold text-highlighted">
          Total: <span class="text-primary">{{ formatPrice(total) }}</span>
        </div>
      </div>
      <div class="flex gap-3">
        <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
          Cancelar
        </UButton>
        <UButton
          v-if="canProcessPayment"
          type="submit"
          color="primary"
          :loading="loading"
          icon="i-lucide-banknote"
        >
          Cobrar
        </UButton>
      </div>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive, watch, computed } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Order, OrderStatus, SaleMethod } from '~/types'
import { processOrderSchema, type ProcessOrderRequest } from '~/utils/validations'

const props = defineProps<{
  loading?: boolean
  tableName?: string
  order: Order
}>()

const emit = defineEmits<{
  submit: [data: ProcessOrderRequest]
  cancel: []
  changeStatus: [orderId: number, status: OrderStatus]
}>()

const saleMethods = [
  { label: 'Efectivo', value: 'EFECTIVO' as SaleMethod },
  { label: 'Tarjeta', value: 'TARJETA' as SaleMethod },
  { label: 'Yape', value: 'YAPE' as SaleMethod },
  { label: 'Mercado Pago', value: 'MERCADO_PAGO' as SaleMethod }
]

const statusColor = computed(() => {
  const colors: Record<string, 'warning' | 'info' | 'success' | 'primary' | 'error'> = {
    PENDIENTE: 'warning',
    PREPARANDO: 'info',
    LISTO: 'success',
    ENTREGADO: 'primary',
    CANCELADO: 'error'
  }
  return colors[props.order.status] || 'neutral'
})

const statusDisplay = computed(() => {
  const displays: Record<string, string> = {
    PENDIENTE: 'Pendiente',
    PREPARANDO: 'Preparando',
    LISTO: 'Listo',
    ENTREGADO: 'Entregado',
    CANCELADO: 'Cancelado'
  }
  return displays[props.order.status] || props.order.status
})

const nextStatus = computed<OrderStatus | null>(() => {
  if (props.order.status === 'LISTO') return 'ENTREGADO'
  return null
})

const nextStatusInfo = computed(() => {
  const info: Record<string, { label: string; color: 'info' | 'success' | 'primary'; icon: string }> = {
    ENTREGADO: { label: 'Marcar como Entregado', color: 'primary', icon: 'i-lucide-package-check' }
  }
  return nextStatus.value ? info[nextStatus.value] : null
})

const canChangeStatus = computed(() => {
  return props.order.status !== 'CANCELADO'
})

const canProcessPayment = computed(() => {
  return ['LISTO', 'ENTREGADO'].includes(props.order.status)
})

const state = reactive<ProcessOrderRequest>({
  orderId: props.order.id,
  paymentMethod: 'EFECTIVO',
  tip: undefined
})

watch(() => props.order, (o) => {
  state.orderId = o.id
})

const subtotal = computed(() => {
  return (props.order.products || []).reduce((acc, product) => acc + (product.priceUnitary * product.quantity), 0)
})

const total = computed(() => {
  return subtotal.value + (state.tip || 0)
})

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}

async function onSubmit(event: FormSubmitEvent<ProcessOrderRequest>) {
  emit('submit', event.data)
}
</script>

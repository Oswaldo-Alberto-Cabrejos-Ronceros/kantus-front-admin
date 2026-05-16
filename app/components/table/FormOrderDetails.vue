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
        {{ order.status }}
      </UBadge>
    </div>

    <!-- Status change (for Mozo/Chef) -->
    <div v-if="canChangeStatus" class="space-y-2">
      <h3 class="text-sm font-semibold text-muted uppercase tracking-wider">Cambiar Estado</h3>
      <div class="flex gap-2 flex-wrap">
        <UButton
          v-for="s in availableStatuses"
          :key="s.value"
          size="sm"
          :color="s.color"
          :variant="order.status === s.value ? 'solid' : 'soft'"
          :icon="s.icon"
          @click="emit('changeStatus', order.id, s.value)"
        >
          {{ s.label }}
        </UButton>
      </div>
    </div>

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
    </template>

    <div class="flex justify-between items-center mt-2 border-t border-default pt-4">
      <div class="text-2xl font-bold text-highlighted">
        Total: <span class="text-primary">{{ formatPrice(total) }}</span>
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

const saleMethods: SaleMethod[] = ['efectivo', 'transferencia', 'tarjeta', 'yape/plin']

const statusColor = computed(() => {
  const colors: Record<string, 'warning' | 'info' | 'success' | 'primary' | 'error'> = {
    Pendiente: 'warning',
    Preparando: 'info',
    Listo: 'success',
    Entregado: 'primary',
    Pagado: 'success',
    Cancelado: 'error'
  }
  return colors[props.order.status] || 'neutral'
})

const availableStatuses = computed(() => {
  const all = [
    { value: 'Pendiente' as OrderStatus, label: 'Pendiente', color: 'warning' as const, icon: 'i-lucide-clock' },
    { value: 'Preparando' as OrderStatus, label: 'Preparando', color: 'info' as const, icon: 'i-lucide-chef-hat' },
    { value: 'Listo' as OrderStatus, label: 'Listo', color: 'success' as const, icon: 'i-lucide-check' },
    { value: 'Entregado' as OrderStatus, label: 'Entregado', color: 'primary' as const, icon: 'i-lucide-package-check' }
  ]
  return all
})

const canChangeStatus = computed(() => {
  return props.order.status !== 'Pagado' && props.order.status !== 'Cancelado'
})

const canProcessPayment = computed(() => {
  return ['Listo', 'Entregado'].includes(props.order.status)
})

const state = reactive<ProcessOrderRequest>({
  orderId: props.order.id,
  paymentMethod: 'efectivo' as SaleMethod
})

watch(() => props.order.id, (newId) => {
  state.orderId = newId
})

const total = computed(() => {
  return (props.order.products || []).reduce((acc, product) => acc + (product.priceUnitary * product.quantity), 0)
})

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}

async function onSubmit(event: FormSubmitEvent<ProcessOrderRequest>) {
  emit('submit', event.data)
}
</script>

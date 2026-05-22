<template>
  <UForm
    :schema="processDeliveryOrderSchema"
    :state="state"
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <div class="flex justify-between items-center pb-2 border-b border-default">
      <h2 class="text-xl font-bold text-highlighted">
        {{ order.customerName || 'Cliente' }}
      </h2>
      <UBadge :color="statusColor">
        {{ order.status }}
      </UBadge>
    </div>

    <div class="flex flex-col gap-3">
      <h3 class="text-sm font-semibold text-muted uppercase tracking-wider">
        Detalles
      </h3>
      <div class="space-y-2 text-sm">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-muted" /><span>{{ order.address }}</span>
        </div>
        <div v-if="order.customerPhone" class="flex items-center gap-2">
          <UIcon name="i-lucide-phone" class="w-4 h-4 text-muted" /><span>{{ order.customerPhone }}</span>
        </div>
        <div v-if="order.customerEmail" class="flex items-center gap-2">
          <UIcon name="i-lucide-mail" class="w-4 h-4 text-muted" /><span>{{ order.customerEmail }}</span>
        </div>
      </div>
      <div v-if="order.products && order.products.length" class="mt-2">
        <h4 class="text-xs font-semibold text-muted uppercase mb-1">
          Productos
        </h4>
        <div v-for="p in order.products" :key="p.id" class="flex justify-between text-sm py-1">
          <span>{{ p.quantity }}x {{ p.name }}</span>
          <span class="font-medium text-primary">S/ {{ (p.priceUnitary * p.quantity).toFixed(2) }}</span>
        </div>
      </div>
      <div class="flex justify-between items-center pt-2 border-t border-default">
        <span class="font-bold">Total</span>
        <span class="text-lg font-bold text-primary">S/ {{ order.totalPrice.toFixed(2) }}</span>
      </div>
    </div>

    <div class="flex justify-between items-center border-t border-default pt-4 gap-3">
      <UButton
        v-if="order.customerPhone"
        color="success"
        variant="soft"
        icon="i-lucide-message-circle"
        size="sm"
        :href="`https://wa.me/51${order.customerPhone}`"
        target="_blank"
      >
        WhatsApp
      </UButton>
      <div class="flex gap-3 ml-auto">
        <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
          Cancelar
        </UButton>
        <UButton
          v-if="nextStatus"
          v-if="nextStatus"
          type="submit"
          color="primary"
          :loading="loading"
          icon="i-lucide-save"
        >
          {{ updateButtonText }}
          {{ updateButtonText }}
        </UButton>
      </div>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive, watch, computed } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { OrderDelivery, OrderDeliveryStatus } from '~/types'
import { processDeliveryOrderSchema, type ProcessDeliveryOrderRequest } from '~/utils/validations'

const props = defineProps<{ loading?: boolean, order: OrderDelivery }>()
const emit = defineEmits<{ submit: [data: ProcessDeliveryOrderRequest], cancel: [] }>()

const nextStatus = computed<string | null>(() => {
  if (['Listo', 'LISTO', 'Pendiente', 'PENDIENTE'].includes(props.order.status)) return 'Camino'
  if (props.order.status === 'Camino') return 'Entregado'
  return null
})

const statusColor = computed(() => {
  const c: Record<string, 'warning' | 'info' | 'success'> = {
    Pendiente: 'warning',
    PENDIENTE: 'warning',
    Listo: 'success',
    LISTO: 'success',
    Camino: 'info',
    CAMINO: 'info',
    Entregado: 'success',
    ENTREGADO: 'success'
  }
  return c[props.order.status] || 'neutral'
})

const getNextStatusValue = (status: string): 'Pendiente' | 'Camino' | 'Entregado' => {
  if (['Listo', 'LISTO', 'Pendiente', 'PENDIENTE'].includes(status)) return 'Camino'
  if (status === 'Camino') return 'Entregado'
  return 'Pendiente'
}

const state = reactive<ProcessDeliveryOrderRequest>({ 
  orderId: props.order.id, 
  status: getNextStatusValue(props.order.status) 
})

watch(() => props.order, (o) => { 
  state.orderId = o.id
  state.status = getNextStatusValue(o.status) 
})

const updateButtonText = computed(() => {
  if (['Listo', 'LISTO', 'Pendiente', 'PENDIENTE'].includes(props.order.status)) return 'Marcar como En Camino'
  if (props.order.status === 'Camino') return 'Marcar como Entregado'
  return 'Actualizar'
})

async function onSubmit(event: FormSubmitEvent<ProcessDeliveryOrderRequest>) { emit('submit', event.data) }
</script>

<template>
  <UForm
    :schema="processDeliveryOrderSchema"
    :state="state"
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <div class="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">
        {{ order.customerName || 'Cliente Anónimo' }}
      </h2>
      <UBadge :color="statusColor">
        {{ order.status }}
      </UBadge>
    </div>

    <div class="flex flex-col gap-3">
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Detalles de Entrega
      </h3>
      <UPageCard
        icon="i-lucide-map-pin"
        :title="order.address || 'Sin dirección registrada'"
      />
      <UPageCard
        v-if="order.totalPrice !== undefined"
        icon="i-lucide-banknote"
        title="Total del Pedido"
      >
        <template #description>
          <span class="text-lg font-bold text-primary">
            S/ {{ order.totalPrice.toFixed(2) }}
          </span>
        </template>
      </UPageCard>
    </div>

    <UFormField label="Actualizar Estado" name="status">
      <URadioGroup
        v-model="state.status"
        orientation="horizontal"
        variant="list"
        :items="deliveryStatuses"
        class="w-full"
      />
    </UFormField>

    <div class="flex justify-end items-center mt-2 border-t border-gray-200 dark:border-gray-800 pt-4 gap-3">
      <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
        Cancelar
      </UButton>
      <UButton
        type="submit"
        color="primary"
        :loading="loading"
        icon="i-lucide-save"
      >
        Actualizar Estado
      </UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive, watch, computed } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { OrderDelivery, OrderDeliveryStatus } from '~/types'
import { processDeliveryOrderSchema, type ProcessDeliveryOrderRequest } from '~/utils/validations'

const props = defineProps<{
  loading?: boolean
  order: OrderDelivery
}>()

const emit = defineEmits<{
  submit: [data: ProcessDeliveryOrderRequest]
  cancel: []
}>()

const deliveryStatuses: OrderDeliveryStatus[] = ['Pendiente', 'Camino', 'Entregado']

const statusColor = computed(() => {
  const colors: Record<OrderDeliveryStatus, 'warning' | 'info' | 'success'> = {
    Pendiente: 'warning',
    Camino: 'info',
    Entregado: 'success'
  }
  return colors[props.order.status] || 'neutral'
})

const state = reactive<ProcessDeliveryOrderRequest>({
  orderId: props.order.id,
  status: props.order.status
})

watch(() => props.order.id, (newId) => {
  state.orderId = newId
})

watch(() => props.order.status, (newStatus) => {
  state.status = newStatus
})

async function onSubmit(event: FormSubmitEvent<ProcessDeliveryOrderRequest>) {
  emit('submit', event.data)
}
</script>

<style>

</style>

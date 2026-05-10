<template>
  <UForm
    :schema="processOrderSchema"
    :state="state"
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <div class="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">
        {{ tableName || 'Sin mesa' }}
        <span v-if="order.customerName" class="text-gray-500 dark:text-gray-400 font-normal text-lg">
          - {{ order.customerName }}
        </span>
      </h2>
      <UBadge :color="statusColor">
        {{ order.status }}
      </UBadge>
    </div>

    <div class="flex flex-col gap-3">
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Productos
      </h3>
      <UPageCard
        v-for="product in (order.products || [])"
        :key="product.id"
        :title="product.name"
        :description="`${formatPrice(product.priceUnitary)} x ${product.quantity}`"
        orientation="horizontal"
      >
        <div class="flex h-full items-center justify-end p-4 text-xl font-bold text-primary">
          {{ formatPrice(product.priceUnitary * product.quantity) }}
        </div>
      </UPageCard>
    </div>

    <UFormField label="Método de Pago" name="paymentMethod">
      <URadioGroup
        v-model="state.paymentMethod"
        orientation="horizontal"
        variant="list"
        :items="saleMethods"
        class="w-full"
      />
    </UFormField>

    <div class="flex justify-between items-center mt-2 border-t border-gray-200 dark:border-gray-800 pt-4">
      <div class="text-2xl font-bold text-gray-900 dark:text-white">
        Total: <span class="text-primary">{{ formatPrice(total) }}</span>
      </div>
      <div class="flex gap-3">
        <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
          Cancelar
        </UButton>
        <UButton
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
}>()

const saleMethods: SaleMethod[] = ['efectivo', 'transferencia', 'tarjeta', 'yape/plin']

const statusColor = computed(() => {
  const colors: Record<OrderStatus, 'warning' | 'info' | 'success'> = {
    Pendiente: 'warning',
    Preparando: 'info',
    Listo: 'success'
  }
  return colors[props.order.status] || 'neutral'
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
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(value)
}

async function onSubmit(event: FormSubmitEvent<ProcessOrderRequest>) {
  emit('submit', event.data)
}
</script>

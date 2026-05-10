<template>
  <UPageCard
    :title="order.customerName || 'Cliente Anónimo'"
    :description="order.address"
    :icon="currentIcon"
    highlight
    :highlight-color="statusColor"
    class="cursor-pointer transition-all hover:ring-2 hover:ring-primary-500"
    @click="$emit('click')"
  >
    <div class="mt-2 flex items-center justify-between">
      <UBadge :color="statusColor">
        {{ order.status }}
      </UBadge>
      <span v-if="order.totalPrice !== undefined" class="font-semibold text-primary">
        S/ {{ order.totalPrice.toFixed(2) }}
      </span>
    </div>
  </UPageCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { OrderDelivery, OrderDeliveryStatus } from '~/types'

const props = defineProps<{
  order: OrderDelivery
}>()

defineEmits<{
  click: []
}>()

const statusColor = computed(() => {
  const colors: Record<OrderDeliveryStatus, 'warning' | 'info' | 'success'> = {
    Pendiente: 'warning',
    Camino: 'info',
    Entregado: 'success'
  }
  return colors[props.order.status] || 'neutral'
})

const currentIcon = computed(() => {
  const icons: Record<OrderDeliveryStatus, string> = {
    Pendiente: 'i-lucide-package',
    Camino: 'i-lucide-motorbike',
    Entregado: 'i-lucide-check-circle'
  }
  return icons[props.order.status] || 'i-lucide-package'
})
</script>

<style>

</style>

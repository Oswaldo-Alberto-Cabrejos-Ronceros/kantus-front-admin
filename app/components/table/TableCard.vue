<template>
  <UPageCard
    :title="tableName"
    :description="!isOccupied ? 'Pendiente' : undefined"
    :icon="currentIcon"
    :highlight="isOccupied"
    :highlight-color="isOccupied ? statusColor : undefined"
  >
    <template v-if="isOccupied && order">
      <div class="mt-2">
        <UBadge :color="statusColor">
          {{ order.status }}
        </UBadge>
      </div>
    </template>
  </UPageCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Order, OrderStatus } from '~/types'

const props = defineProps<{
  tableName: string
  isOccupied: boolean
  order?: Order
}>()

const statusColor = computed(() => {
  if (!props.isOccupied || !props.order) return 'neutral'
  const colors: Record<OrderStatus, 'warning' | 'info' | 'success'> = {
    Pendiente: 'warning',
    Preparando: 'info',
    Listo: 'success'
  }
  return colors[props.order.status] || 'neutral'
})

const currentIcon = computed(() => {
  if (!props.isOccupied || !props.order) return 'i-lucide-users'

  const icons: Record<OrderStatus, string> = {
    Pendiente: 'i-lucide-clock-alert',
    Preparando: 'i-lucide-timer',
    Listo: 'i-lucide-check'
  }
  return icons[props.order.status] || 'i-lucide-users'
})
</script>

<style>

</style>

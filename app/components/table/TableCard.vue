<template>
  <UPageCard
    :title="tableName"
    :icon="currentIcon"
    :highlight="isOccupied"
    :highlight-color="isOccupied ? statusColor : undefined"
    class="cursor-pointer card-hover group"
    @click="$emit('click')"
  >
    <template #description>
      <div class="flex items-center gap-2 mt-1">
        <template v-if="isOccupied && order">
          <UBadge :color="statusColor" variant="subtle" size="xs">
            {{ order.status }}
          </UBadge>
          <span class="text-xs text-muted">{{ formatPrice(order.totalPrice) }}</span>
        </template>
        <span v-else class="text-xs text-success font-medium">Disponible</span>
      </div>
    </template>

    <div v-if="isOccupied && order" class="mt-2 space-y-1">
      <div class="text-xs text-muted">
        {{ order.products.length }} producto{{ order.products.length !== 1 ? 's' : '' }}
      </div>
    </div>
    <div v-else class="mt-2">
      <UButton
        size="xs"
        color="primary"
        variant="soft"
        icon="i-lucide-plus"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
        @click.stop="$emit('takeOrder')"
      >
        Tomar Pedido
      </UButton>
    </div>
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

defineEmits<{
  click: []
  takeOrder: []
}>()

const statusColor = computed(() => {
  if (!props.isOccupied || !props.order) return 'neutral'
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

const currentIcon = computed(() => {
  if (!props.isOccupied || !props.order) return 'i-lucide-armchair'
  const icons: Record<string, string> = {
    Pendiente: 'i-lucide-clock-alert',
    Preparando: 'i-lucide-timer',
    Listo: 'i-lucide-check',
    Entregado: 'i-lucide-package-check',
    Pagado: 'i-lucide-banknote',
    Cancelado: 'i-lucide-x-circle'
  }
  return icons[props.order.status] || 'i-lucide-armchair'
})

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}
</script>

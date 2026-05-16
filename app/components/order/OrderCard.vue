<template>
  <UCard :ui="{ body: 'py-4 sm:p-4', footer: 'py-4 sm:p-4' }" class="card-hover overflow-hidden">
    <template #header>
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-highlighted">
          #{{ code }}
        </h3>
        <span class="text-xs text-muted font-medium">
          {{ timeAgo }}
        </span>
      </div>
      <div class="flex gap-2">
        <UBadge :color="type === 'delivery' ? 'secondary' : 'info'" variant="soft" size="xs">
          {{ type === 'delivery' ? '🛵 DELIVERY' : '🍽️ SALÓN' }}
        </UBadge>
        <UBadge :color="statusInfo.color" variant="solid" size="xs" :class="statusInfo.glowClass">
          {{ status }}
        </UBadge>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <!-- Delivery customer info -->
      <div v-if="type === 'delivery'" class="text-sm space-y-1 bg-elevated/50 p-3 rounded-lg">
        <div v-if="customerName" class="flex items-center gap-2">
          <UIcon name="i-lucide-user" class="w-4 h-4 text-muted" />
          <span class="text-highlighted">{{ customerName }}</span>
        </div>
        <div v-if="customerPhone" class="flex items-center gap-2">
          <UIcon name="i-lucide-phone" class="w-4 h-4 text-muted" />
          <span>{{ customerPhone }}</span>
        </div>
        <div v-if="location" class="flex items-center gap-2">
          <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-muted" />
          <span class="line-clamp-2">{{ location }}</span>
        </div>
      </div>

      <!-- Table info for salon -->
      <div v-if="type === 'salon' && tableName" class="text-sm bg-elevated/50 p-2 rounded-lg flex items-center gap-2">
        <UIcon name="i-lucide-armchair" class="w-4 h-4 text-muted" />
        <span class="font-medium text-highlighted">{{ tableName }}</span>
      </div>

      <!-- Products list -->
      <div>
        <h4 class="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
          Productos
        </h4>
        <ul class="space-y-1">
          <li v-for="(product, index) in products" :key="index" class="text-sm flex justify-between items-start gap-2">
            <span class="flex-1 text-highlighted">
              <span class="font-semibold text-primary mr-1">{{ product.quantity }}x</span>
              {{ product.name }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Total -->
      <div class="flex justify-between items-center pt-3 border-t border-default">
        <span class="font-semibold text-highlighted">Total</span>
        <span class="text-xl font-bold text-primary">{{ formatPrice(totalPrice) }}</span>
      </div>
    </div>

    <template #footer>
      <UButton
        v-if="statusInfo.nextStatus"
        block
        :color="statusInfo.actionColor"
        :icon="statusInfo.icon"
        @click="emit('action', id, statusInfo.nextStatus)"
      >
        {{ statusInfo.actionLabel }}
      </UButton>
      <div v-else class="text-center text-sm text-muted py-1">
        <UIcon name="i-lucide-check-circle" class="w-4 h-4 inline mr-1" />
        Completado
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useTimeAgo } from '@vueuse/core'

type OrderStatus = 'Pendiente' | 'Preparando' | 'Listo' | 'Entregado' | 'Pagado' | 'Cancelado'
type OrderType = 'salon' | 'delivery'
type ThemeColor = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'

interface OrderProduct {
  name: string
  quantity: number
}

const props = defineProps<{
  id: number | string
  code: string
  status: OrderStatus
  type: OrderType
  products: OrderProduct[]
  time: string | number | Date
  totalPrice: number
  location?: string
  customerName?: string
  customerPhone?: string
  tableName?: string
}>()

const emit = defineEmits(['action'])

const timeAgo = useTimeAgo(() => new Date(props.time))

const statusInfo = computed<{
  color: ThemeColor
  actionLabel: string
  actionColor: ThemeColor
  icon: string
  nextStatus: string
  glowClass: string
}>(() => {
  switch (props.status) {
    case 'Pendiente':
      return { color: 'error', actionLabel: 'Iniciar Preparación', actionColor: 'primary', icon: 'i-lucide-play', nextStatus: 'Preparando', glowClass: 'badge-glow-error animate-pulse-soft' }
    case 'Preparando':
      return { color: 'warning', actionLabel: 'Marcar Listo', actionColor: 'warning', icon: 'i-lucide-check-circle', nextStatus: 'Listo', glowClass: 'badge-glow-warning' }
    case 'Listo':
      return { color: 'success', actionLabel: 'Marcar Entregado', actionColor: 'success', icon: 'i-lucide-package-check', nextStatus: 'Entregado', glowClass: 'badge-glow-success' }
    case 'Entregado':
      return { color: 'primary', actionLabel: '', actionColor: 'neutral', icon: '', nextStatus: '', glowClass: '' }
    case 'Pagado':
      return { color: 'success', actionLabel: '', actionColor: 'neutral', icon: '', nextStatus: '', glowClass: '' }
    case 'Cancelado':
      return { color: 'error', actionLabel: '', actionColor: 'neutral', icon: '', nextStatus: '', glowClass: '' }
    default:
      return { color: 'neutral', actionLabel: 'Actualizar', actionColor: 'neutral', icon: 'i-lucide-arrow-right', nextStatus: props.status, glowClass: '' }
  }
})

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}
</script>

<template>
  <UCard :ui="{ body: 'py-4 sm:p-4', footer: 'py-4 sm:p-4' }">
    <template #header>
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          #{{ code }}
        </h3>
        <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {{ timeAgo }}
        </span>
      </div>
      <div class="flex gap-2">
        <UBadge :color="type === 'delivery' ? 'secondary' : 'info'" variant="soft" size="xs">
          {{ type.toUpperCase() }}
        </UBadge>
        <UBadge :color="statusInfo.color" variant="solid" size="xs">
          {{ status }}
        </UBadge>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <!-- Información del Cliente (Solo si es Delivery) -->
      <div v-if="type === 'delivery'" class="text-sm text-gray-600 dark:text-gray-300 space-y-1 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
        <div v-if="customerName" class="flex items-center gap-2">
          <UIcon name="i-lucide-user" class="w-4 h-4 text-gray-400" />
          <span>{{ customerName }}</span>
        </div>
        <div v-if="customerPhone" class="flex items-center gap-2">
          <UIcon name="i-lucide-phone" class="w-4 h-4 text-gray-400" />
          <span>{{ customerPhone }}</span>
        </div>
        <div v-if="location" class="flex items-center gap-2">
          <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-gray-400" />
          <span class="line-clamp-2">{{ location }}</span>
        </div>
      </div>

      <!-- Lista de Productos -->
      <div>
        <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Productos
        </h4>
        <ul class="space-y-1">
          <li v-for="(product, index) in products" :key="index" class="text-sm flex justify-between items-start gap-2">
            <span class="flex-1 text-gray-900 dark:text-gray-100">
              <span class="font-semibold text-primary mr-1">{{ product.quantity }}x</span>
              {{ product.name }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Total -->
      <div class="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
        <span class="font-semibold text-gray-900 dark:text-white">Total</span>
        <span class="text-xl font-bold text-primary">{{ formatPrice(totalPrice) }}</span>
      </div>
    </div>

    <template #footer>
      <UButton
        block
        :color="statusInfo.actionColor"
        :icon="statusInfo.icon"
        @click="emit('action', id, statusInfo.nextStatus)"
      >
        {{ statusInfo.actionLabel }}
      </UButton>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useTimeAgo } from '@vueuse/core'

type OrderStatus = 'Pendiente' | 'Preparando' | 'Listo'
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
  // Optional fields for delivery
  location?: string
  customerName?: string
  customerPhone?: string
}>()

const emit = defineEmits(['action'])

// Calcula el tiempo transcurrido reactivamente
const timeAgo = useTimeAgo(() => new Date(props.time))

// Evalúa la información visual y la acción dependiendo del estado actual
const statusInfo = computed<{
  color: ThemeColor
  actionLabel: string
  actionColor: ThemeColor
  icon: string
  nextStatus: string
}>(() => {
  switch (props.status) {
    case 'Pendiente':
      return { color: 'error', actionLabel: 'Iniciar', actionColor: 'primary', icon: 'i-lucide-play', nextStatus: 'Preparando' }
    case 'Preparando':
      return { color: 'warning', actionLabel: 'Marcar Listo', actionColor: 'warning', icon: 'i-lucide-check-circle', nextStatus: 'Listo' }
    case 'Listo':
      return { color: 'success', actionLabel: 'Entregado', actionColor: 'success', icon: 'i-lucide-package-check', nextStatus: 'Entregado' }
    default:
      return { color: 'neutral', actionLabel: 'Actualizar', actionColor: 'neutral', icon: 'i-lucide-arrow-right', nextStatus: props.status }
  }
})

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(value)
}
</script>

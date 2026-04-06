<template>
  <UCard :ui="{ body: 'py-4 sm:p-4', footer: 'py-4 sm:p-4' }">
    <template #header>
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ name }}
        </h3>
        <UBadge :color="status === 'Abierta' ? 'success' : 'error'" variant="soft" size="xs">
          {{ status.toUpperCase() }}
        </UBadge>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <div class="space-y-1">
        <div class="text-sm flex justify-between items-center gap-2">
          <span class="text-gray-600 dark:text-gray-300">Monto de Apertura</span>
          <span class="font-medium text-gray-900 dark:text-gray-100">S/ {{ formatPrice(openingAmount) }}</span>
        </div>
        <div class="text-sm flex justify-between items-center gap-2">
          <span class="text-gray-600 dark:text-gray-300">Ventas Recaudadas</span>
          <span class="font-medium text-gray-900 dark:text-gray-100">S/ {{ formatPrice(collectedSales) }}</span>
        </div>
      </div>

      <div class="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
        <span class="font-semibold text-gray-900 dark:text-white">Saldo Actual</span>
        <span class="text-xl font-bold text-primary">S/ {{ formatPrice(currentBalance) }}</span>
      </div>
    </div>

    <template #footer>
      <div class="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
        <div class="flex items-center justify-between">
          <span>Hora Apertura:</span>
          <span>{{ formatDate(openingTime) }}</span>
        </div>
        <div v-if="closingTime" class="flex items-center justify-between">
          <span>Hora Cierre:</span>
          <span>{{ formatDate(closingTime) }}</span>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { CashBoxStatus } from '~/types'

defineProps<{
  id: number | string
  name: string
  openingAmount: number
  currentBalance: number
  collectedSales: number
  openingTime: string | Date
  closingTime?: string | Date
  status: CashBoxStatus
}>()

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function formatDate(dateValue: string | Date) {
  const date = new Date(dateValue)
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}
</script>

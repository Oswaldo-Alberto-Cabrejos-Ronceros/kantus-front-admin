<template>
  <UDashboardPanel id="ingresos">
    <template #header>
      <UDashboardNavbar title="Ingresos y Ventas" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Stats cards -->
      <HomeStats :stats="baseStats" />

      <!-- Payment method breakdown -->
      <UPageGrid class="mt-6 gap-4 sm:gap-6 lg:gap-px grid-cols-1 lg:grid-cols-4">
        <UPageCard
          v-for="method in paymentMethods"
          :key="method.label"
          variant="subtle"
          class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
          :icon="method.icon"
          :title="method.label"
          :description="method.amount"
        />
      </UPageGrid>

      <!-- Sales chart placeholder -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-highlighted mb-4">
          Comparativo de Ventas
        </h2>
        <UCard class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Bar chart simulation -->
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-muted uppercase tracking-wider">
                Ventas por Tipo
              </h3>
              <div v-for="bar in salesByType" :key="bar.label" class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span class="text-highlighted">{{ bar.label }}</span>
                  <span class="font-semibold text-primary">{{ bar.amount }}</span>
                </div>
                <div class="h-2 bg-elevated rounded-full overflow-hidden">
                  <div class="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-1000" :style="{ width: bar.percentage + '%' }" />
                </div>
              </div>
            </div>

            <!-- Pie chart simulation -->
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-muted uppercase tracking-wider">
                Métodos de Pago
              </h3>
              <div v-for="pm in paymentBreakdown" :key="pm.label" class="flex items-center justify-between p-2 rounded-lg bg-elevated/50">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: pm.color }" />
                  <span class="text-sm text-highlighted">{{ pm.label }}</span>
                </div>
                <div class="text-right">
                  <span class="text-sm font-semibold text-highlighted">{{ pm.percentage }}%</span>
                  <span class="text-xs text-muted ml-2">{{ pm.amount }}</span>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Latest sales table -->
      <div class="mt-8 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-highlighted">
            Últimas Ventas
          </h2>
        </div>
        <UTable
          class="shrink-0"
          :data="latestSales || []"
          :columns="columns"
          :loading="isPending"
          :ui="{
            base: 'table-fixed border-separate border-spacing-0',
            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0',
            th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
            td: 'border-b border-default',
            separator: 'h-0'
          }"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Sale } from '~/types'

const baseStats = [{
  title: 'Total ventas',
  icon: 'i-lucide-circle-dollar-sign',
  value: 'S/ 12,450',
  variation: 15
}, {
  title: 'Transacciones',
  icon: 'i-lucide-shopping-cart',
  value: 58,
  variation: 20
}, {
  title: 'Ticket promedio',
  icon: 'i-lucide-wallet-minimal',
  value: 'S/ 214.66',
  variation: 8
}, {
  title: 'Digital vs Efectivo',
  icon: 'i-lucide-credit-card',
  value: '65% / 35%',
  variation: 12
}]

const paymentMethods = [
  { label: 'Efectivo', icon: 'i-lucide-banknote', amount: 'S/ 4,357.50' },
  { label: 'Tarjeta', icon: 'i-lucide-credit-card', amount: 'S/ 3,735.00' },
  { label: 'Transferencia', icon: 'i-lucide-building', amount: 'S/ 2,490.00' },
  { label: 'Yape/Plin', icon: 'i-lucide-smartphone', amount: 'S/ 1,867.50' }
]

const salesByType = [
  { label: 'Salón', amount: 'S/ 7,470', percentage: 60 },
  { label: 'Delivery', amount: 'S/ 4,980', percentage: 40 }
]

const paymentBreakdown = [
  { label: 'Efectivo', percentage: 35, amount: 'S/ 4,357', color: '#f59e0b' },
  { label: 'Tarjeta', percentage: 30, amount: 'S/ 3,735', color: '#3b82f6' },
  { label: 'Transferencia', percentage: 20, amount: 'S/ 2,490', color: '#8b5cf6' },
  { label: 'Yape/Plin', percentage: 15, amount: 'S/ 1,867', color: '#10b981' }
]

const { useFindLatestSales } = useSales()
const { data: latestSales, isPending } = useFindLatestSales()

const columns = computed<TableColumn<Sale>[]>(() => [
  { accessorKey: 'codigo', header: 'Código' },
  { accessorKey: 'fecha', header: 'Fecha', cell: ({ row }) => new Date(row.original.fecha).toLocaleString('es-PE') },
  { accessorKey: 'metodo', header: 'Método' },
  { accessorKey: 'monto', header: 'Monto', cell: ({ row }) => `S/ ${row.original.monto.toFixed(2)}` }
])
</script>

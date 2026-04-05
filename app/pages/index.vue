<script setup lang="ts">
import { sub } from 'date-fns'
import { computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Period, Range, ProductTop } from '~/types'

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')

const baseStats = [{
  title: 'Ventas hoy',
  icon: 'i-lucide-wallet-minimal',
  value: 1200,
  variation: 15
}, {
  title: 'Ventas semana',
  icon: 'i-lucide-trending-up',
  value: 1500,
  variation: 20
}, {
  title: 'Pedidos',
  icon: 'i-lucide-shopping-cart',
  value: 580,
  variation: 25
}, {
  title: 'Efectivo en caja',
  icon: 'i-lucide-circle-dollar-sign',
  value: 5600,
  variation: 10
}]

// Carga de los productos Top desde la nueva API
const { data: topProducts, status } = await useFetch<ProductTop[]>('/api/product-top')

const columns = computed<TableColumn<ProductTop>[]>(() => [
  { accessorKey: 'id', header: 'Top' },
  { accessorKey: 'productName', header: 'Producto' },
  { accessorKey: 'quantity', header: 'Cantidad Vendida' },
  {
    id: 'totalCollected',
    accessorKey: 'totalCollected',
    header: 'Total Recaudado',
    // Formatear el texto de la celda de dinero
    cell: ({ row }) => `S/ ${row.original.totalCollected.toFixed(2)}`
  }
])
</script>

<template>
  <UDashboardPanel id="inicio">
    <template #header>
      <UDashboardNavbar title="Inicio" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <HomeDateRangePicker v-model="range" class="-ms-1" />

          <HomePeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <HomeStats :stats="baseStats" />
      <HomeChart :period="period" :range="range" />

      <div class="mt-8 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold leading-none">
            Productos Más Vendidos
          </h2>
        </div>
        <UTable
          class="shrink-0"
          :data="topProducts || []"
          :columns="columns"
          :loading="status === 'pending'"
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

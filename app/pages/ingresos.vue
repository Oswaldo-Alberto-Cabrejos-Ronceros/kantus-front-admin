<template>
  <UDashboardPanel id="ingresos">
    <template #header>
      <UDashboardNavbar title="Ingresos" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <HomeStats :stats="baseStats" />

      <div class="mt-8 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold leading-none">
            Últimas Ventas
          </h2>
        </div>
        <UTable
          class="shrink-0"
          :data="latestSales || []"
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

<script lang="ts" setup>
import { computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Sale } from '~/types'

const baseStats = [{
  title: 'Total ventas',
  icon: 'i-lucide-circle-dollar-sign',
  value: 'S/ 12,000',
  variation: 15
}, {
  title: 'Transacciones',
  icon: 'i-lucide-shopping-cart',
  value: 50,
  variation: 20
}, {
  title: 'Ticket promedio',
  icon: 'i-lucide-wallet-minimal',
  value: 'S/ 580',
  variation: 25
},
{
  title: 'Total en medio digitales',
  icon: 'i-lucide-credit-card',
  value: 'S/ 8,000',
  variation: 15
}]

const { data: latestSales, status } = await useFetch<Sale[]>('/api/latest-sales')

const columns = computed<TableColumn<Sale>[]>(() => [
  { accessorKey: 'codigo', header: 'Código' },
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => new Date(row.original.fecha).toLocaleString()
  },
  { accessorKey: 'metodo', header: 'Método' },
  {
    accessorKey: 'monto',
    header: 'Monto',
    cell: ({ row }) => `S/ ${row.original.monto.toFixed(2)}`
  }
])
</script>

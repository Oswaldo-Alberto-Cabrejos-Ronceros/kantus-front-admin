<template>
  <UDashboardPanel id="cajas">
    <template #header>
      <UDashboardNavbar title="Cajas" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="boxes && boxes.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        <CashboxCardCashBox
          v-for="box in boxes"
          :key="box.id"
          v-bind="box"
        />
      </div>
      <div v-else class="flex justify-center items-center h-full text-gray-500">
        <p>No hay cajas para mostrar.</p>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import type { CashBox } from '~/types'

const { data: boxes } = await useFetch<CashBox[]>('/api/cash-boxes')
</script>

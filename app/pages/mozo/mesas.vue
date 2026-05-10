<template>
  <UDashboardPanel id="mesas">
    <template #header>
      <UDashboardNavbar title="Mesas" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 pb-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <TableCard
            v-for="table in tables"
            :key="table.id"
            :table-name="table.name"
            :is-occupied="table.occupied"
            :order="table.order"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import type { Table } from '~/types'

const { data: tables } = await useFetch<Table[]>('/api/tables')
</script>

<style>

</style>

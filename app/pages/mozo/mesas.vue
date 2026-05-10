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
            @click="openOrderDetails(table)"
          />
        </div>
      </div>

      <UModal v-model:open="isModalOpen" title="Detalles de Orden">
        <template #body>
          <TableFormOrderDetails
            v-if="selectedTable && selectedTable.order"
            :order="selectedTable.order"
            :table-name="selectedTable.name"
            :loading="isSubmitting"
            @submit="handleSubmit"
            @cancel="isModalOpen = false"
          />
          <div v-else class="p-6 text-center text-gray-500 dark:text-gray-400">
            Esta mesa está libre o no tiene una orden asociada por el momento.
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { Table } from '~/types'
import type { ProcessOrderRequest } from '~/utils/validations'

const { data: tables } = await useFetch<Table[]>('/api/tables')

const isModalOpen = ref(false)
const selectedTable = ref<Table | null>(null)
const isSubmitting = ref(false)

function openOrderDetails(table: Table) {
  selectedTable.value = table
  isModalOpen.value = true
}

async function handleSubmit(data: ProcessOrderRequest) {
  isSubmitting.value = true
  console.log('Procesando pago/orden...', data)

  setTimeout(() => {
    isSubmitting.value = false
    isModalOpen.value = false
    console.log('¡Transacción exitosa!')
  }, 1000)
}
</script>

<style>

</style>

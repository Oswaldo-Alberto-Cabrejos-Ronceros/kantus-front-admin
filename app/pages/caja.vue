<template>
  <UDashboardPanel id="caja">
    <template #header>
      <UDashboardNavbar title="Caja">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <div class="flex items-center gap-3">
            <UBadge
              :color="isCashboxOpen ? 'success' : 'error'"
              variant="subtle"
              class="text-sm font-medium"
            >
              {{ isCashboxOpen ? 'Caja Abierta' : 'Caja Cerrada' }}
            </UBadge>

            <UModal v-model:open="isOpenModalOpen" title="Abrir Caja">
              <UButton v-if="!isCashboxOpen" icon="i-lucide-unlock" color="primary">
                Abrir Caja
              </UButton>
              <template #body>
                <CashboxFormOpenCashbox :loading="isSubmitting" @submit="handleOpenCashbox" @cancel="isOpenModalOpen = false" />
              </template>
            </UModal>

            <UModal v-model:open="isCloseModalOpen" title="Cerrar Caja">
              <UButton v-if="isCashboxOpen" icon="i-lucide-lock" color="error">
                Cerrar Caja
              </UButton>
              <template #body>
                <CashboxFormCloseCashbox :loading="isSubmitting" @submit="handleCloseCashbox" @cancel="isCloseModalOpen = false" />
              </template>
            </UModal>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <HomeStats :stats="cashboxStats" :columns="3" />

      <!-- ingresos y egresos -->

      <UPageGrid class="ap-4 sm:gap-6 lg:gap-px grid-cols-1 md:grid-cols-2">
        <UPageCard
          variant="subtle"
          class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
          icon="i-lucide-trending-up"
          title="Ingresos"
          description="S/500.00"
        />
        <UPageCard
          variant="subtle"
          class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
          icon="i-lucide-trending-down"
          title="Egresos"
          description="S/120.00"
        />
      </UPageGrid>

      <div class="mt-8 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold leading-none">
            Movimientos de Caja
          </h2>
        </div>

        <UTable
          class="shrink-0"
          :data="movements || []"
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
import { h, resolveComponent, computed, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { MovementCashbox } from '~/types'
import type { OpenCashboxRequest, CloseCashboxRequest } from '~/utils/validations'

const UBadge = resolveComponent('UBadge')

const isCashboxOpen = ref(false)
const isOpenModalOpen = ref(false)
const isCloseModalOpen = ref(false)
const isSubmitting = ref(false)

const cashboxStats = computed(() => [
  { title: 'Saldo Inicial', icon: 'i-lucide-wallet', value: isCashboxOpen.value ? 'S/ 100.00' : 'S/ 0.00' },
  { title: 'Saldo Actual', icon: 'i-lucide-circle-dollar-sign', value: isCashboxOpen.value ? 'S/ 350.00' : 'S/ 0.00' },
  { title: 'Día y hora de apertura', icon: 'i-lucide-clock', value: isCashboxOpen.value ? '25/10/2023 08:30 AM' : '-' }
])

const { data: movements, status } = await useFetch<MovementCashbox[]>('/api/movements-cashbox')

const columns = computed<TableColumn<MovementCashbox>[]>(() => [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'dia', header: 'Día', cell: ({ row }) => typeof row.original.dia === 'string' ? row.original.dia : new Date(row.original.dia).toLocaleDateString() },
  { accessorKey: 'hora', header: 'Hora' },
  { accessorKey: 'codigoPedidos', header: 'Pedido', cell: ({ row }) => row.original.codigoPedidos || '-' },
  { accessorKey: 'tipoComprobante', header: 'Comprobante', cell: ({ row }) => row.original.tipoComprobante || '-' },
  { accessorKey: 'descripcion', header: 'Descripción', cell: ({ row }) => row.original.descripcion || '-' },
  { id: 'tipo', header: 'Tipo', cell: ({ row }) => h(UBadge, { color: row.original.tipo === 'Ingreso' ? 'success' : 'error', variant: 'subtle' }, () => row.original.tipo) },
  { accessorKey: 'monto', header: 'Monto', cell: ({ row }) => `S/ ${row.original.monto.toFixed(2)}` }
])

async function handleOpenCashbox(_data: OpenCashboxRequest) {
  isSubmitting.value = true
  setTimeout(() => {
    isCashboxOpen.value = true
    isSubmitting.value = false
    isOpenModalOpen.value = false
  }, 1000)
}

async function handleCloseCashbox(_data: CloseCashboxRequest) {
  isSubmitting.value = true
  setTimeout(() => {
    isCashboxOpen.value = false
    isSubmitting.value = false
    isCloseModalOpen.value = false
  }, 1000)
}
</script>

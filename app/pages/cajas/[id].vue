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

      <UPageGrid class="ap-4 sm:gap-6 lg:gap-px grid-cols-1 lg:grid-cols-2">
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
import { h, resolveComponent, computed, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { MovementCashbox } from '~/types'
import type { OpenCashboxRequest, CloseCashboxRequest } from '~/utils/validations'

const route = useRoute()
const cashBoxId = computed(() => Number(route.params.id))

definePageMeta({
  middleware: [
    (to) => {
      const { user } = useAuth()
      if (user.value?.role === 'CAJERO') {
        to.meta.layout = 'cashier'
      } else {
        to.meta.layout = 'admin'
      }
    }
  ]
})

const { user } = useAuth()

const UBadge = resolveComponent('UBadge')
const toast = useToast()

const { useFindCashBoxMovements, useOpenCashBox, useCloseCashBox, useFindOneCashBox } = useCashBoxes()
const { data: cashBox } = useFindOneCashBox(cashBoxId)
const { data: movements, isPending } = useFindCashBoxMovements(cashBoxId)

const openMutation = useOpenCashBox()
const closeMutation = useCloseCashBox()

const isCashboxOpen = computed(() => cashBox.value?.status === 'ABIERTA')

const isOpenModalOpen = ref(false)
const isCloseModalOpen = ref(false)
const isSubmitting = ref(false)

const cashboxStats = computed(() => [
  { title: 'Saldo Inicial', icon: 'i-lucide-wallet', value: isCashboxOpen.value ? `S/ ${cashBox.value?.openingAmount?.toFixed(2) || '0.00'}` : 'S/ 0.00' },
  { title: 'Saldo Actual', icon: 'i-lucide-circle-dollar-sign', value: isCashboxOpen.value ? `S/ ${cashBox.value?.currentBalance?.toFixed(2) || '0.00'}` : 'S/ 0.00' },
  { title: 'Día y hora de apertura', icon: 'i-lucide-clock', value: isCashboxOpen.value && cashBox.value?.openingTime ? new Date(cashBox.value.openingTime).toLocaleString() : '-' }
])

const columns = computed<TableColumn<MovementCashbox>[]>(() => [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'dia', header: 'Día', cell: ({ row }) => typeof row.original.dia === 'string' ? row.original.dia : new Date(row.original.dia).toLocaleDateString() },
  { accessorKey: 'hora', header: 'Hora' },
  { accessorKey: 'codigoPedidos', header: 'Pedido', cell: ({ row }) => row.original.codigoPedidos || '-' },
  { accessorKey: 'tipoComprobante', header: 'Comprobante', cell: ({ row }) => row.original.tipoComprobante || '-' },
  { accessorKey: 'descripcion', header: 'Descripción', cell: ({ row }) => row.original.descripcion || '-' },
  { id: 'tipo', header: 'Tipo', cell: ({ row }) => h(UBadge, { color: row.original.tipo === 'INGRESO' ? 'success' : 'error', variant: 'subtle' }, () => row.original.tipo) },
  { accessorKey: 'monto', header: 'Monto', cell: ({ row }) => `S/ ${row.original.monto.toFixed(2)}` }
])

async function handleOpenCashbox(data: OpenCashboxRequest) {
  isSubmitting.value = true
  try {
    await openMutation.mutateAsync({ name: data.name, openingAmount: data.openingAmount, id: cashBoxId.value })
    isOpenModalOpen.value = false
    toast.add({ title: 'Caja abierta correctamente', color: 'success' })
  } catch {
    toast.add({ title: 'Error al abrir caja', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

async function handleCloseCashbox(_data: CloseCashboxRequest) {
  isSubmitting.value = true
  try {
    await closeMutation.mutateAsync(cashBoxId.value)
    isCloseModalOpen.value = false
    toast.add({ title: 'Caja cerrada correctamente', color: 'success' })
  } catch {
    toast.add({ title: 'Error al cerrar caja', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

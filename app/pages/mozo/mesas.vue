<template>
  <UDashboardPanel id="mesas">
    <template #header>
      <UDashboardNavbar title="Mesas" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <div class="flex items-center gap-3">
            <template v-if="employee">
              <UBadge v-if="hasOpenCashbox" color="success" variant="soft" size="sm">
                Caja Abierta: {{ activeCashbox?.name }}
              </UBadge>
              <UButton
                v-else
                icon="i-lucide-plus"
                color="primary"
                size="sm"
                label="Abrir Caja"
                @click="isCashboxModalOpen = true"
              />
            </template>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-6 pb-4">
        <HomeStats :stats="stats" :columns="3" />

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          <TableCard
            v-for="table in tables"
            :key="table.id"
            :table-name="table.name"
            :is-occupied="table.occupied || !!table.order"
            :order="table.order"
            class="stagger-item"
            @click="openOrderDetails(table)"
            @take-order="openTakeOrder(table)"
          />
        </div>
      </div>

      <!-- Order Details Modal -->
      <UModal v-model:open="isModalOpen" title="Detalles de Orden">
        <template #body>
          <TableFormOrderDetails
            v-if="selectedTable && selectedTable.order"
            :order="selectedTable.order"
            :table-name="selectedTable.name"
            :loading="isSubmitting"
            @submit="handleSubmit"
            @cancel="isModalOpen = false"
            @change-status="handleChangeStatus"
          />
          <div v-else class="empty-state py-8">
            <UIcon name="i-lucide-armchair" class="w-12 h-12 mb-3" />
            <p class="text-sm font-medium text-muted">
              Esta mesa está libre.
            </p>
          </div>
        </template>
      </UModal>

      <!-- Take Order Modal -->
      <UModal v-model:open="isTakeOrderOpen" title="Tomar Pedido">
        <template #body>
          <TableFormTakeOrder
            v-if="selectedTable"
            :table-id="selectedTable.id"
            :table-name="selectedTable.name"
            :products="menuProducts || []"
            :loading="isSubmitting"
            @submit="handleTakeOrder"
            @cancel="isTakeOrderOpen = false"
          />
        </template>
      </UModal>

      <!-- Open Cashbox Modal -->
      <UModal v-model:open="isCashboxModalOpen" title="Abrir Caja">
        <template #body>
          <CashboxFormOpenCashbox
            :loading="isSubmittingCashbox"
            @submit="handleOpenCashbox"
            @cancel="isCashboxModalOpen = false"
          />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'waiter'
})
import { ref, computed, watch } from 'vue'
import type { Table, OrderStatus } from '~/types'
import type { ProcessOrderRequest, TakeOrderRequest, OpenCashboxRequest } from '~/utils/validations'
import { useAuth } from '~/composables/auth'
import { useEmployees } from '~/composables/useEmployees'
import { useCashBoxes } from '~/composables/useCashBoxes'

const toast = useToast()

const { useFindAllTables, useOccupyTable, useFreeTable } = useTables()
const { useFindAllProducts } = useProducts()
const { useUpdateOrderStatus, useCreateOrder, useFindAllOrders } = useOrders()
const { useCreateSale } = useSales()

const { data: rawTables } = useFindAllTables()
const { data: menuProducts } = useFindAllProducts()
const { data: orders } = useFindAllOrders()
const updateStatusMutation = useUpdateOrderStatus()
const createOrderMutation = useCreateOrder()
const createSaleMutation = useCreateSale()
const occupyTableMutation = useOccupyTable()
const freeTableMutation = useFreeTable()

// Session & Cashbox variables
const { user } = useAuth()
const userId = computed(() => Number(user.value?.id) || 0)

const { useFindEmployeeByUserId } = useEmployees()
const { data: employee } = useFindEmployeeByUserId(userId)

const employeeId = computed(() => Number(employee.value?.id) || 0)

const { useFindLatestCashBoxByEmployee, useOpenCashBox } = useCashBoxes()
const { data: activeCashbox } = useFindLatestCashBoxByEmployee(employeeId)
const openMutation = useOpenCashBox()

const hasOpenCashbox = computed(() => activeCashbox.value?.status === 'ABIERTA')

const isCashboxModalOpen = ref(false)
const isSubmittingCashbox = ref(false)

// Debugging console logs
console.log('[Mesas Debug] User in session:', user.value)
watch(userId, (id) => {
  console.log('[Mesas Debug] Computed userId:', id)
})
watch(employee, (emp) => {
  console.log('[Mesas Debug] Fetched employee profile:', emp)
})
watch(activeCashbox, (cb) => {
  console.log('[Mesas Debug] Fetched latest cashbox status:', cb?.status, cb)
})

async function handleOpenCashbox(data: OpenCashboxRequest) {
  if (!employeeId.value) {
    toast.add({ title: 'Error: No se encontró perfil de empleado', color: 'error' })
    return
  }
  isSubmittingCashbox.value = true
  try {
    await openMutation.mutateAsync({
      name: data.name,
      openingAmount: data.openingAmount,
      employeeId: employeeId.value
    })
    isCashboxModalOpen.value = false
    toast.add({ title: 'Caja abierta correctamente', color: 'success' })
  } catch (error) {
    console.error('[Mesas Debug] Error opening cashbox:', error)
    toast.add({ title: 'Error al abrir caja', color: 'error' })
  } finally {
    isSubmittingCashbox.value = false
  }
}

const tables = computed<Table[]>(() => {
  if (!rawTables.value) return []
  return (rawTables.value as Table[]).map((table: Table) => {
    const tableOrder = orders.value?.find((o: { tableId: number; status: string }) => o.tableId === table.id && o.status !== 'ENTREGADO' && o.status !== 'CANCELADO')
    return {
      ...table,
      order: tableOrder
    }
  })
})

const isModalOpen = ref(false)
const isTakeOrderOpen = ref(false)
const selectedTableId = ref<number | null>(null)
const isSubmitting = ref(false)

const selectedTable = computed(() => {
  if (selectedTableId.value === null) return null
  return tables.value.find(t => t.id === selectedTableId.value) || null
})

function openOrderDetails(table: Table) {
  selectedTableId.value = table.id
  isModalOpen.value = true
}

function openTakeOrder(table: Table) {
  selectedTableId.value = table.id
  isTakeOrderOpen.value = true
}

async function handleSubmit(data: ProcessOrderRequest) {
  isSubmitting.value = true
  try {
    await createSaleMutation.mutateAsync({ sale: { metodo: data.paymentMethod as any }, orderId: data.orderId })
    if (selectedTable.value) {
      await freeTableMutation.mutateAsync(selectedTable.value.id)
    }
    isModalOpen.value = false
    toast.add({ title: '¡Pago registrado exitosamente!', color: 'success' })
  } catch {
    toast.add({ title: 'Error al procesar pago', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

async function handleTakeOrder(data: TakeOrderRequest) {
  isSubmitting.value = true
  try {
    if (selectedTable.value && !selectedTable.value.occupied) {
      await occupyTableMutation.mutateAsync(selectedTable.value.id)
    }
    await createOrderMutation.mutateAsync({
      tableId: selectedTable.value?.id,
      type: 'SALON',
      customerName: data.customerName || undefined,
      products: data.products.map(item => ({ id: item.productId, quantity: item.quantity, name: '', priceUnitary: 0 }))
    })
    isTakeOrderOpen.value = false
    toast.add({ title: '¡Pedido enviado a cocina!', color: 'success' })
  } catch {
    toast.add({ title: 'Error al tomar el pedido', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

async function handleChangeStatus(orderId: number, status: OrderStatus) {
  try {
    await updateStatusMutation.mutateAsync({ id: orderId, status })
    toast.add({ title: `Estado cambiado a "${status}"`, color: 'success' })
  } catch {
    toast.add({ title: 'Error al cambiar estado', color: 'error' })
  }
}

const stats = computed(() => [{
  title: 'Mesas Ocupadas',
  value: tables.value?.filter((t: Table) => t.occupied || !!t.order).length || 0,
  icon: 'i-lucide-users'
}, {
  title: 'Órdenes Pendientes',
  value: tables.value?.filter((t: Table) => t.order && t.order.status === 'PENDIENTE').length || 0,
  icon: 'i-lucide-clock-alert'
}, {
  title: 'Órdenes Listas',
  value: tables.value?.filter((t: Table) => t.order && t.order.status === 'LISTO').length || 0,
  icon: 'i-lucide-check'
}])
</script>

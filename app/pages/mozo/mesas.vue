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
              <UBadge v-else color="error" variant="soft" size="sm" icon="i-lucide-lock">
                Sin caja abierta
              </UBadge>
            </template>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
      </div>
      <div v-else class="flex flex-col gap-6 pb-4">
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
          <!-- Pantalla de éxito post-cobro -->
          <Transition name="payment-success" appear>
            <div
              v-if="paymentSuccess"
              class="flex flex-col items-center justify-center gap-5 py-10 px-4"
            >
              <div class="relative flex items-center justify-center">
                <!-- Anillo animado exterior -->
                <span class="absolute inline-flex h-24 w-24 rounded-full bg-success/20 animate-ping" style="animation-duration: 1s;" />
                <!-- Círculo con ícono -->
                <div class="relative flex h-20 w-20 items-center justify-center rounded-full bg-success/15 border-2 border-success">
                  <UIcon name="i-lucide-badge-check" class="w-10 h-10 text-success" />
                </div>
              </div>
              <div class="text-center">
                <p class="text-xl font-bold text-highlighted">¡Cobro registrado!</p>
                <p class="text-sm text-muted mt-1">El pago fue procesado correctamente.</p>
              </div>
              <!-- Link al comprobante si se generó uno -->
              <UButton
                v-if="lastComprobanteId"
                color="primary"
                variant="soft"
                icon="i-lucide-receipt"
                size="sm"
                :to="`${backendUrl}/api/comprobantes/${lastComprobanteId}/view`"
                target="_blank"
              >
                Ver comprobante
              </UButton>
            </div>
          </Transition>

          <!-- Formulario normal (oculto durante el éxito) -->
          <template v-if="!paymentSuccess">
            <TableFormOrderDetails
              v-if="selectedTable && selectedTable.order"
              :order="selectedTable.order"
              :table-name="selectedTable.name"
              :loading="isSubmitting"
              :cash-balance="activeCashbox?.currentBalance"
              @submit="handleSubmit"
              @cancel="isModalOpen = false"
              @change-status="handleChangeStatus"
            />
            <div v-else class="empty-state py-8">
              <UIcon name="i-lucide-armchair" class="w-12 h-12 mb-3" />
              <p class="text-sm font-medium text-muted">Esta mesa está libre.</p>
            </div>
          </template>
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
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'waiter'
})
import { ref, computed } from 'vue'
import type { Table, OrderStatus } from '~/types'
import type { ProcessOrderRequest, TakeOrderRequest } from '~/utils/validations'
import { useAuth } from '~/composables/auth'
import { useEmployees } from '~/composables/useEmployees'

const toast = useToast()

const { useFindAllTables, useOccupyTable, useFreeTable } = useTables()
const { useFindAllProducts } = useProducts()
const { useUpdateOrderStatus, useCreateOrder, useFindAllOrders } = useOrders()
const { useCreateSale } = useSales()

const { data: rawTables, isPending: isLoadingTables } = useFindAllTables()
const { data: menuProducts } = useFindAllProducts()
const { data: orders, isPending: isLoadingOrders } = useFindAllOrders()

const isLoading = computed(() => isLoadingTables.value || isLoadingOrders.value)
const updateStatusMutation = useUpdateOrderStatus()
const createOrderMutation = useCreateOrder()
const createSaleMutation = useCreateSale()
const occupyTableMutation = useOccupyTable()
const freeTableMutation = useFreeTable()

// Sesión y caja activa del sistema (solo lectura, el mozo no puede abrir caja)
// El mozo usa la caja que abrió el cajero — busca la primera ABIERTA del sistema
const { user } = useAuth()
const userId = computed(() => Number(user.value?.id) || 0)

const { useFindEmployeeByUserId } = useEmployees()
const { data: employee } = useFindEmployeeByUserId(userId)

// Usa la misma cache que las páginas de cajas para no hacer requests duplicados
// y garantizar que refleja la caja abierta sin importar quién la abrió (cajero o admin)
const { useFindAllCashBoxes } = useCashBoxes()
const { data: allCashboxes } = useFindAllCashBoxes()
const activeCashbox = computed(() => allCashboxes.value?.find(b => b.status === 'ABIERTA') ?? null)
const hasOpenCashbox = computed(() => !!activeCashbox.value)

const tables = computed<Table[]>(() => {
  if (!rawTables.value) return []
  return (rawTables.value as Table[]).map((table: Table) => {
    const tableOrder = orders.value?.find(
      (o: { tableId: number; status: string }) =>
        o.tableId === table.id && o.status !== 'ENTREGADO' && o.status !== 'CANCELADO'
    )
    return { ...table, order: tableOrder }
  })
})

const isModalOpen = ref(false)
const isTakeOrderOpen = ref(false)
const selectedTableId = ref<number | null>(null)
const isSubmitting = ref(false)
const paymentSuccess = ref(false)
const lastComprobanteId = ref<number | null>(null)

// URL base del backend (para abrir el comprobante en nueva pestaña)
const config = useRuntimeConfig()
const backendUrl = (config.public as any).apiBaseUrl ?? 'http://localhost:8080'

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
  if (!hasOpenCashbox.value) {
    toast.add({
      title: 'No hay caja abierta',
      description: 'El cajero debe abrir una caja antes de poder cobrar pedidos.',
      color: 'error',
      duration: 5000
    })
    return
  }
  isSubmitting.value = true
  try {
    const saleResult = await createSaleMutation.mutateAsync({
      sale: { metodo: data.paymentMethod as any },
      orderId: data.orderId,
      cashBoxId: activeCashbox.value!.id as number,
      amountReceived: data.paymentMethod === 'EFECTIVO' ? data.amountReceived : undefined,
      comprobante: data.comprobante as any
    })
    // Guardar el ID del comprobante si fue generado
    lastComprobanteId.value = (saleResult as any)?.comprobanteId ?? null
    if (selectedTable.value) {
      await freeTableMutation.mutateAsync(selectedTable.value.id)
    }
    // Mostrar pantalla de éxito en el modal 2-3 segundos antes de cerrar
    paymentSuccess.value = true
    const delay = lastComprobanteId.value ? 3000 : 2000
    setTimeout(() => {
      isModalOpen.value = false
      paymentSuccess.value = false
      lastComprobanteId.value = null
    }, delay)
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
      products: data.products.map(item => ({
        id: item.productId,
        quantity: item.quantity,
        name: '',
        priceUnitary: 0
      }))
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

/** Un solo recorrido calcula los tres contadores sin arrays intermedios */
const tableCounts = computed(() => {
  let occupied = 0, pending = 0, ready = 0
  for (const t of tables.value) {
    if (t.occupied || t.order) occupied++
    if (t.order?.status === 'PENDIENTE') pending++
    if (t.order?.status === 'LISTO') ready++
  }
  return { occupied, pending, ready }
})

const stats = computed(() => [
  { title: 'Mesas Ocupadas', value: tableCounts.value.occupied, icon: 'i-lucide-users' },
  { title: 'Órdenes Pendientes', value: tableCounts.value.pending, icon: 'i-lucide-clock-alert' },
  { title: 'Órdenes Listas', value: tableCounts.value.ready, icon: 'i-lucide-check' }
])
</script>

<style scoped>
.payment-success-enter-active {
  animation: pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.payment-success-leave-active {
  animation: fade-out 0.2s ease-in;
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}
</style>

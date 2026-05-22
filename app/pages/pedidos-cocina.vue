<template>
  <UDashboardPanel id="pedidos-cocina">
    <template #header>
      <UDashboardNavbar title="Pedidos / Cocina" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UBadge color="primary" variant="soft" size="sm">
            {{ pendingCount }} pendientes
          </UBadge>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="isLoadingOrders" class="flex justify-center items-center h-64">
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
      </div>
      <template v-else>
      <!-- Stats -->
      <HomeStats :stats="orderStats" :columns="3" />

      <!-- Tabs by type -->
      <UTabs
        v-if="items && items.length"
        :items="items"
        class="w-full mt-6"
      >
        <template
          v-for="type in orderTypes"
          :key="type.id"
          #[`type-${type.id}`]
        >
          <!-- Kanban-style columns -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div v-for="statusCol in statusColumns" :key="statusCol.value" class="kanban-column bg-elevated/30 p-3 rounded-xl">
              <div class="flex items-center gap-2 mb-3 pb-2 border-b border-default">
                <UBadge :color="statusCol.color" variant="subtle" size="xs">
                  {{ statusCol.label }}
                </UBadge>
                <span class="text-xs text-muted">({{ getOrdersByTypeAndStatus(type.value, statusCol.value).length }})</span>
              </div>
              <div class="space-y-3">
                <OrderCard
                  v-for="order in getOrdersByTypeAndStatus(type.value, statusCol.value)"
                  :key="order.id"
                  v-bind="order"
                  :hide-deliver-action="true"
                  class="stagger-item"
                  @action="handleOrderAction"
                />
                <div v-if="getOrdersByTypeAndStatus(type.value, statusCol.value).length === 0" class="text-center text-sm text-muted py-8">
                  Sin pedidos
                </div>
              </div>
            </div>
          </div>
        </template>
      </UTabs>
      <div v-else class="empty-state">
        <UIcon name="i-lucide-cooking-pot" class="w-16 h-16 mb-4" />
        <p class="text-lg font-medium">
          No hay pedidos para mostrar
        </p>
      </div>
      </template>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Order, OrderStatus } from '~/types'

// Tipo auxiliar para el mapa de pedidos agrupados
type OrderMap = Record<string, Record<string, Order[]>>

definePageMeta({
  middleware: [
    (to) => {
      const { user } = useAuth()
      if (user.value?.role === 'ADMIN') {
        to.meta.layout = 'admin'
      } else if (user.value?.role === 'COCINERO') {
        to.meta.layout = 'cook'
      } else if (user.value?.role === 'MOZO') {
        to.meta.layout = 'waiter'
      } else {
        to.meta.layout = 'default'
      }
    }
  ]
})

const { user } = useAuth()
const toast = useToast()

const { useFindAllOrders, useUpdateOrderStatus } = useOrders()
const { data: orders, isPending: isLoadingOrders } = useFindAllOrders()
const updateStatusMutation = useUpdateOrderStatus()

/**
 * Un único recorrido del array genera todos los contadores y el mapa agrupado.
 * Evita múltiples .filter() independientes sobre el mismo array en cada render.
 */
const ordersGrouped = computed<OrderMap>(() => {
  const map: OrderMap = {}
  for (const order of orders.value ?? []) {
    const type = order.type ?? 'TODOS'
    const status = order.status
    // Grupo "todos los tipos"
    if (!map['TODOS']) map['TODOS'] = {}
    if (!map['TODOS'][status]) map['TODOS'][status] = []
    map['TODOS'][status].push(order)
    // Grupo por tipo específico
    if (!map[type]) map[type] = {}
    if (!map[type][status]) map[type][status] = []
    map[type][status].push(order)
  }
  return map
})

const statusCounts = computed(() => ({
  PENDIENTE: ordersGrouped.value['TODOS']?.['PENDIENTE']?.length ?? 0,
  PREPARANDO: ordersGrouped.value['TODOS']?.['PREPARANDO']?.length ?? 0,
  LISTO: ordersGrouped.value['TODOS']?.['LISTO']?.length ?? 0
}))

const pendingCount = computed(() => statusCounts.value.PENDIENTE)

const orderStats = computed(() => [
  { title: 'Pendientes', icon: 'i-lucide-clock-alert', value: statusCounts.value.PENDIENTE },
  { title: 'Preparando', icon: 'i-lucide-chef-hat', value: statusCounts.value.PREPARANDO },
  { title: 'Listos', icon: 'i-lucide-check-circle', value: statusCounts.value.LISTO }
])

const statusColumns = [
  { value: 'PENDIENTE' as OrderStatus, label: 'Pendiente', color: 'error' as const },
  { value: 'PREPARANDO' as OrderStatus, label: 'Preparando', color: 'warning' as const },
  { value: 'LISTO' as OrderStatus, label: 'Listo', color: 'success' as const }
]

const orderTypes = [
  { id: 'todos', label: 'Todos' },
  { id: 'salon', label: 'Salón', value: 'SALON' },
  { id: 'delivery', label: 'Delivery', value: 'DELIVERY' }
]

const items = computed(() => {
  return orderTypes.map(type => ({
    label: type.label,
    slot: `type-${type.id}`
  }))
})

/** Lee del mapa precalculado en lugar de filtrar en cada llamada del template */
function getOrdersByTypeAndStatus(typeValue?: string, status?: OrderStatus): Order[] {
  const key = typeValue ?? 'TODOS'
  if (!status) return Object.values(ordersGrouped.value[key] ?? {}).flat()
  return ordersGrouped.value[key]?.[status] ?? []
}

async function handleOrderAction(orderId: number, nextStatus: string) {
  if (!nextStatus) return

  try {
    await updateStatusMutation.mutateAsync({ id: orderId, status: nextStatus })
    toast.add({ title: `Pedido actualizado a "${nextStatus}"`, color: 'success' })
  } catch (error) {
    toast.add({ title: 'Error al actualizar el pedido' + error, color: 'error' })
  }
}
</script>

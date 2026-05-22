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
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Order, OrderStatus } from '~/types'

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
const { data: orders } = useFindAllOrders()
const updateStatusMutation = useUpdateOrderStatus()

const pendingCount = computed(() => orders.value?.filter((o: Order) => o.status === 'PENDIENTE').length || 0)

const orderStats = computed(() => [{
  title: 'Pendientes',
  icon: 'i-lucide-clock-alert',
  value: orders.value?.filter((o: Order) => o.status === 'PENDIENTE').length || 0
}, {
  title: 'Preparando',
  icon: 'i-lucide-chef-hat',
  value: orders.value?.filter((o: Order) => o.status === 'PREPARANDO').length || 0
}, {
  title: 'Listos',
  icon: 'i-lucide-check-circle',
  value: orders.value?.filter((o: Order) => o.status === 'LISTO').length || 0
}])

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

const getOrdersByTypeAndStatus = (typeValue?: string, status?: OrderStatus) => {
  let filtered: Order[] = orders.value || []
  if (typeValue) filtered = filtered.filter((o: Order) => o.type === typeValue)
  if (status) filtered = filtered.filter((o: Order) => o.status === status)
  return filtered
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

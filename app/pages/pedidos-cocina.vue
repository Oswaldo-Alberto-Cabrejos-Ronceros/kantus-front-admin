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
        <p class="text-lg font-medium">No hay pedidos para mostrar</p>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Order, OrderStatus } from '~/types'

const { user } = useAuth()
const toast = useToast()

if (user.value?.role === 'Cocinero') {
  setPageLayout('cook')
} else if (user.value?.role === 'Mozo') {
  setPageLayout('waiter')
} else {
  setPageLayout('default')
}

const { data: orders } = await useFetch<Order[]>('/api/orders')

const pendingCount = computed(() => orders.value?.filter(o => o.status === 'Pendiente').length || 0)

const orderStats = computed(() => [{
  title: 'Pendientes',
  icon: 'i-lucide-clock-alert',
  value: orders.value?.filter(o => o.status === 'Pendiente').length || 0
}, {
  title: 'Preparando',
  icon: 'i-lucide-chef-hat',
  value: orders.value?.filter(o => o.status === 'Preparando').length || 0
}, {
  title: 'Listos',
  icon: 'i-lucide-check-circle',
  value: orders.value?.filter(o => o.status === 'Listo').length || 0
}])

const statusColumns = [
  { value: 'Pendiente' as OrderStatus, label: 'Pendiente', color: 'error' as const },
  { value: 'Preparando' as OrderStatus, label: 'Preparando', color: 'warning' as const },
  { value: 'Listo' as OrderStatus, label: 'Listo', color: 'success' as const }
]

const orderTypes = [
  { id: 'todos', label: 'Todos' },
  { id: 'salon', label: 'Salón', value: 'salon' },
  { id: 'delivery', label: 'Delivery', value: 'delivery' }
]

const items = computed(() => {
  return orderTypes.map(type => ({
    label: type.label,
    slot: `type-${type.id}`
  }))
})

const getOrdersByTypeAndStatus = (typeValue?: string, status?: OrderStatus) => {
  let filtered = orders.value || []
  if (typeValue) filtered = filtered.filter(o => o.type === typeValue)
  if (status) filtered = filtered.filter(o => o.status === status)
  return filtered
}

async function handleOrderAction(orderId: number, nextStatus: string) {
  if (!nextStatus) return

  try {
    const response = await $fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: { status: nextStatus as OrderStatus }
    })

    if (response && orders.value) {
      const index = orders.value.findIndex(o => o.id === orderId)
      if (index !== -1) {
        orders.value[index]!.status = nextStatus as OrderStatus
        orders.value = [...orders.value]
        toast.add({ title: `Pedido actualizado a "${nextStatus}"`, color: 'success' })
      }
    }
  } catch (error) {
    toast.add({ title: 'Error al actualizar el pedido', color: 'error' })
  }
}
</script>

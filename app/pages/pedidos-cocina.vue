<template>
  <UDashboardPanel id="pedidos-cocina">
    <template #header>
      <UDashboardNavbar title="Pedidos / Cocina" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UTabs
        v-if="items && items.length"
        :items="items"
        class="w-full"
      >
        <template
          v-for="type in orderTypes"
          :key="type.id"
          #[`type-${type.id}`]
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            <OrderCard
              v-for="order in getOrdersByType(type.value)"
              :key="order.id"
              v-bind="order"
              @action="handleOrderAction"
            />
          </div>
        </template>
      </UTabs>
      <div v-else class="flex justify-center items-center h-full">
        <p>No hay pedidos para mostrar.</p>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Order } from '~/types'

const { data: orders } = await useFetch<Order[]>('/api/orders')

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

const getOrdersByType = (typeValue?: string) => {
  if (!typeValue) return orders.value || []
  return orders.value?.filter(o => o.type === typeValue) || []
}

function handleOrderAction(orderId: number | string, nextStatus: string) {
  console.log(`Actualizando estado del pedido ${orderId} a: ${nextStatus}`)
}
</script>

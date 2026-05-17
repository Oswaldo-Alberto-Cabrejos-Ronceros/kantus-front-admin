<template>
  <UDashboardPanel id="pedidos">
    <template #header>
      <UDashboardNavbar title="Pedidos Delivery" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 pb-4">
        <UPageGrid class="gap-4 sm:gap-6 lg:gap-px grid-cols-1 lg:grid-cols-3">
          <UPageCard
            variant="subtle"
            class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
            icon="i-lucide-package"
            title="Pendientes"
            :description="pendingCount.toString()"
          />
          <UPageCard
            variant="subtle"
            class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
            icon="i-lucide-motorbike"
            title="En Camino"
            :description="inTransitCount.toString()"
          />
          <UPageCard
            variant="subtle"
            class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
            icon="i-lucide-check-circle"
            title="Entregados"
            :description="deliveredCount.toString()"
          />
        </UPageGrid>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <DeliveryOrderCard
            v-for="order in deliveries"
            :key="order.id"
            :order="order as any"
            class="stagger-item"
            @click="openOrderDetails(order as any)"
          />
        </div>
      </div>

      <UModal v-model:open="isModalOpen" title="Gestionar Entrega">
        <template #body>
          <DeliveryFormOrderDetails
            v-if="selectedOrder"
            :order="selectedOrder"
            :loading="isSubmitting"
            @submit="handleSubmit"
            @cancel="isModalOpen = false"
          />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { OrderDelivery } from '~/types'
import type { ProcessDeliveryOrderRequest } from '~/utils/validations'

setPageLayout('delivery')

const toast = useToast()

const { useFindAllOrders } = useOrders()
const { data: allOrders } = useFindAllOrders()

// Filtrar solo los pedidos de tipo delivery
const deliveries = computed(() => {
  return allOrders.value?.filter((o: any) => o.type === 'delivery') || []
})

const isModalOpen = ref(false)
const selectedOrder = ref<OrderDelivery | null>(null)
const isSubmitting = ref(false)

// Nota: El backend OpenAPI puede tener diferentes estados para 'status'. 
// Ajustar si los valores reales difieren de 'Pendiente', 'Camino', 'Entregado'.
const deliveredCount = computed(() => deliveries.value.filter((o: any) => o.status === 'Entregado').length)
const pendingCount = computed(() => deliveries.value.filter((o: any) => o.status === 'Pendiente').length)
const inTransitCount = computed(() => deliveries.value.filter((o: any) => o.status === 'Camino').length)

function openOrderDetails(order: OrderDelivery) {
  selectedOrder.value = order
  isModalOpen.value = true
}

async function handleSubmit(data: ProcessDeliveryOrderRequest) {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    isModalOpen.value = false
    toast.add({ title: '¡Estado actualizado!', color: 'success' })
  }, 1000)
}
</script>

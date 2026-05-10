<template>
  <UDashboardPanel id="pedidos">
    <template #header>
      <UDashboardNavbar title="Pedidos" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 pb-4">
        <UPageGrid class="ap-4 sm:gap-6 lg:gap-px grid-cols-1 lg:grid-cols-2">
          <UPageCard
            variant="subtle"
            class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
            icon="i-lucide-cooking-pot"
            title="Entregados"
            :description="deliveredCount.toString()"
          />
          <UPageCard
            variant="subtle"
            class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
            icon="i-lucide-motorbike"
            title="Pendientes"
            :description="pendingCount.toString()"
          />
        </UPageGrid>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <DeliveryOrderCard
            v-for="order in deliveries"
            :key="order.id"
            :order="order"
            @click="openOrderDetails(order)"
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

const { data: deliveries } = await useFetch<OrderDelivery[]>('/api/orders-delivery')

const isModalOpen = ref(false)
const selectedOrder = ref<OrderDelivery | null>(null)
const isSubmitting = ref(false)

const deliveredCount = computed(() => deliveries.value?.filter(o => o.status === 'Entregado').length || 0)
const pendingCount = computed(() => deliveries.value?.filter(o => o.status !== 'Entregado').length || 0)

function openOrderDetails(order: OrderDelivery) {
  selectedOrder.value = order
  isModalOpen.value = true
}

async function handleSubmit(data: ProcessDeliveryOrderRequest) {
  isSubmitting.value = true
  console.log('Actualizando estado de la orden:', data)

  setTimeout(() => {
    isSubmitting.value = false
    isModalOpen.value = false
    console.log('¡Estado actualizado exitosamente!')
  }, 1000)
}
</script>

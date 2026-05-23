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
            icon="i-lucide-truck"
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
            v-for="order in activeDeliveries"
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

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl as string

definePageMeta({
  layout: 'delivery'
})

const toast = useToast()

const { useGetDeliveryOrders, useUpdateOrderStatus } = useOrders()
const { useCreateSale } = useSales()
const { data: deliveries } = useGetDeliveryOrders()
const updateStatusMutation = useUpdateOrderStatus()
const createSaleMutation = useCreateSale()

const isModalOpen = ref(false)
const selectedOrder = ref<OrderDelivery | null>(null)
const isSubmitting = ref(false)

const activeDeliveries = computed(() => deliveries.value?.filter((o: any) => o.status !== 'Entregado') ?? [])

const deliveredCount = computed(() => deliveries.value?.filter((o: any) => o.status === 'Entregado').length ?? 0)
const pendingCount = computed(() => deliveries.value?.filter((o: any) => o.status === 'Pendiente').length ?? 0)
const inTransitCount = computed(() => deliveries.value?.filter((o: any) => o.status === 'Camino').length ?? 0)

function openOrderDetails(order: OrderDelivery) {
  selectedOrder.value = order
  isModalOpen.value = true
}

async function handleSubmit(data: ProcessDeliveryOrderRequest) {
  isSubmitting.value = true
  try {
    if (data.status === 'Entregado') {
      // Cobrar la entrega: crea la venta y el backend marca la orden como ENTREGADO automáticamente.
      // cashBoxId es omitido → backend busca la caja activa automáticamente.
      const saleRes = await createSaleMutation.mutateAsync({
        sale: { metodo: (data.paymentMethod ?? 'EFECTIVO') as any },
        orderId: data.orderId,
        amountReceived: data.amountReceived,
        comprobante: data.comprobante as any
      })
      isModalOpen.value = false

      // Si se generó un comprobante, mostrar enlace de boleta
      const comprobanteId = (saleRes as any)?.comprobanteId
      if (comprobanteId) {
        toast.add({
          title: '¡Entrega cobrada!',
          description: 'Boleta generada correctamente.',
          color: 'success',
          actions: [{
            label: 'Ver boleta',
            click: () => window.open(`${apiBaseUrl}/api/comprobantes/${comprobanteId}/view`, '_blank')
          }]
        })
      } else {
        toast.add({ title: '¡Entrega cobrada!', description: 'Pedido marcado como entregado.', color: 'success' })
      }
    } else {
      // Solo actualizar estado (Pendiente → Camino)
      const statusMap: Record<'Pendiente' | 'Camino' | 'Entregado', 'PENDIENTE' | 'CAMINO' | 'ENTREGADO'> = {
        Pendiente: 'PENDIENTE',
        Camino: 'CAMINO',
        Entregado: 'ENTREGADO'
      }
      await updateStatusMutation.mutateAsync({
        id: data.orderId,
        status: statusMap[data.status]
      })
      isModalOpen.value = false
      toast.add({ title: '¡Estado actualizado!', color: 'success' })
    }
  } catch {
    toast.add({ title: 'Error al procesar la entrega', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

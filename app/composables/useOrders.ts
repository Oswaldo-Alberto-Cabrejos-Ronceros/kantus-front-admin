import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getDeliveryOrders
} from '~/api/sdk.gen'
import type { OrderResponse } from '~/api/types.gen'
import { mapOrderResponseToUI, mapOrderRequestFromUI } from '~/adapters/order'
import type { Order, OrderDelivery, OrderDeliveryStatus } from '~/types'

export const useOrders = () => {
  const queryClient = useQueryClient()

  const useFindAllOrders = () => {
    return useQuery({
      queryKey: ['orders'],
      queryFn: async () => {
        const res = await getOrders()
        const data = res.data || []
        return Array.isArray(data) 
          ? data.map((item) => mapOrderResponseToUI(item as OrderResponse)) 
          : (data as any)?.content?.map((item: any) => mapOrderResponseToUI(item as OrderResponse)) || []
      }
    })
  }

  const useFindOneOrder = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['orders', id],
      queryFn: async () => {
        const res = await getOrderById({ path: { id: toValue(id) } })
        if (res.error) throw res.error
        return res.data ? mapOrderResponseToUI(res.data as OrderResponse) : null
      },
      enabled: computed(() => !!toValue(id))
    })
  }

  const useGetDeliveryOrders = () => {
    return useQuery({
      queryKey: ['orders', 'delivery'],
      queryFn: async () => {
        const res = await getDeliveryOrders()
        if (res.error) throw res.error
        const data = res.data || []
        const rawList = (Array.isArray(data) ? data : (data as any)?.content || []) as any[]
        
        const statusMapFromBackend: Record<string, OrderDeliveryStatus> = {
          'PENDIENTE': 'Pendiente',
          'CAMINO': 'Camino',
          'ENTREGADO': 'Entregado',
          'Pendiente': 'Pendiente',
          'Camino': 'Camino',
          'Entregado': 'Entregado'
        }

        return rawList.map((item: any) => ({
          ...item,
          status: statusMapFromBackend[item.status] || item.status
        })) as OrderDelivery[]
      }
    })
  }

  const useCreateOrder = () => {
    return useMutation({
      mutationFn: async (order: Partial<Order>) => {
        const body = mapOrderRequestFromUI(order)
        const res = await createOrder({ body })
        if (res.error) throw res.error
        return res.data ? mapOrderResponseToUI(res.data as OrderResponse) : null
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] })
      }
    })
  }

  const useUpdateOrderStatus = () => {
    return useMutation({
      mutationFn: async ({ id, status }: { id: number; status: string }) => {
        const res = await updateOrderStatus({ path: { id }, query: { status } as any })
        if (res.error) throw res.error
        return res.data ? mapOrderResponseToUI(res.data as OrderResponse) : null
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['orders', variables.id] })
        queryClient.invalidateQueries({ queryKey: ['orders', 'delivery'] })
      }
    })
  }

  return {
    useFindAllOrders,
    useFindOneOrder,
    useGetDeliveryOrders,
    useCreateOrder,
    useUpdateOrderStatus
  }
}

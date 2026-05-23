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
import { extractItems, STALE } from '~/utils/query'
import type { Order, OrderDelivery, OrderDeliveryStatus } from '~/types'

export const useOrders = () => {
  const queryClient = useQueryClient()

  const useFindAllOrders = () => {
    return useQuery({
      queryKey: ['orders'],
      staleTime: STALE.LIVE,
      queryFn: async (): Promise<Order[]> => {
        const res = await getOrders()
        return extractItems<OrderResponse>(res.data as any).map(mapOrderResponseToUI)
      }
    })
  }

  const useFindOneOrder = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['orders', id],
      staleTime: STALE.LIVE,
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
      staleTime: STALE.LIVE,
      queryFn: async (): Promise<OrderDelivery[]> => {
        const res = await getDeliveryOrders()
        if (res.error) throw res.error

        const statusMapFromBackend: Record<string, OrderDeliveryStatus> = {
          PENDIENTE: 'Pendiente', CAMINO: 'Camino', ENTREGADO: 'Entregado',
          Pendiente: 'Pendiente', Camino: 'Camino', Entregado: 'Entregado'
        }

        return extractItems<any>(res.data as any).map((item) => ({
          ...item,
          status: statusMapFromBackend[item.status] ?? item.status
        }))
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
        queryClient.invalidateQueries({ queryKey: ['orders'], exact: true })
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
      onSuccess: (updatedOrder, variables) => {
        // Actualiza el item individual en caché sin refetch
        if (updatedOrder) {
          queryClient.setQueryData(['orders', variables.id], updatedOrder)
        }
        // Invalida las listas para que se sincronicen
        queryClient.invalidateQueries({ queryKey: ['orders'], exact: true })
        queryClient.invalidateQueries({ queryKey: ['orders', 'delivery'], exact: true })
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

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import {
  getSales,
  getSaleById,
  createSale,
  getLatestSales
} from '~/api/sdk.gen'
import type { SaleResponse } from '~/api/types.gen'
import { mapSaleResponseToUI, mapSaleRequestFromUI } from '~/adapters/sale'
import type { Sale } from '~/types'

export const useSales = () => {
  const queryClient = useQueryClient()

  const useFindAllSales = () => {
    return useQuery({
      queryKey: ['sales'],
      queryFn: async () => {
        const res = await getSales()
        const data = res.data || []
        return Array.isArray(data) 
          ? data.map((item) => mapSaleResponseToUI(item as SaleResponse)) 
          : (data as any)?.content?.map((item: any) => mapSaleResponseToUI(item as SaleResponse)) || []
      }
    })
  }

  const useFindOneSale = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['sales', id],
      queryFn: async () => {
        const res = await getSaleById({ path: { id: toValue(id) } })
        if (res.error) throw res.error
        return res.data ? mapSaleResponseToUI(res.data as SaleResponse) : null
      },
      enabled: computed(() => !!toValue(id))
    })
  }

  const useFindLatestSales = () => {
    return useQuery({
      queryKey: ['sales', 'latest'],
      queryFn: async () => {
        const res = await getLatestSales()
        const data = res.data || []
        return Array.isArray(data) 
          ? data.map((item) => mapSaleResponseToUI(item as any)) 
          : []
      }
    })
  }

  const useCreateSale = () => {
    return useMutation({
      mutationFn: async ({ sale, orderId }: { sale: Partial<Sale>; orderId: number }) => {
        const body = mapSaleRequestFromUI(sale, orderId)
        const res = await createSale({ body })
        if (res.error) throw res.error
        return res.data ? mapSaleResponseToUI(res.data as SaleResponse) : null
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sales'] })
        queryClient.invalidateQueries({ queryKey: ['orders'] })
      }
    })
  }

  return {
    useFindAllSales,
    useFindOneSale,
    useFindLatestSales,
    useCreateSale
  }
}

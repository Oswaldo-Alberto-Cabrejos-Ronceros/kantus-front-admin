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
import { extractItems, STALE } from '~/utils/query'
import type { Sale } from '~/types'

export interface SaleFilters {
  metodo?: string
  codigo?: string
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}

export const useSales = () => {
  const queryClient = useQueryClient()

  const useFindAllSales = () => {
    return useQuery({
      queryKey: ['sales'],
      staleTime: STALE.MEDIUM,
      queryFn: async (): Promise<Sale[]> => {
        const res = await getSales()
        return extractItems<SaleResponse>(res.data as any).map(mapSaleResponseToUI)
      }
    })
  }

  const useFindOneSale = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['sales', id],
      staleTime: STALE.MEDIUM,
      queryFn: async () => {
        const res = await getSaleById({ path: { id: toValue(id) } })
        if (res.error) throw res.error
        return res.data ? mapSaleResponseToUI(res.data as SaleResponse) : null
      },
      enabled: computed(() => !!toValue(id))
    })
  }

  const useFindLatestSales = (limit = 10) => {
    return useQuery({
      queryKey: ['sales', 'latest', limit],
      staleTime: STALE.MEDIUM,
      queryFn: async (): Promise<Sale[]> => {
        const res = await getLatestSales({ query: { limit } as any })
        return extractItems<any>(res.data as any).map(mapSaleResponseToUI)
      }
    })
  }

  const useSearchSales = (filters: MaybeRef<SaleFilters>) => {
    return useQuery({
      queryKey: ['sales', 'search', filters],
      staleTime: STALE.SHORT,
      queryFn: async () => {
        const f = toValue(filters)
        const query: Record<string, any> = {
          page: f.page ?? 0,
          size: f.size ?? 20
        }
        if (f.metodo) query.metodo = f.metodo
        if (f.codigo?.trim()) query.codigo = f.codigo.trim()
        if (f.startDate) query.startDate = f.startDate
        if (f.endDate) query.endDate = f.endDate
        const res = await getSales({ query } as any)
        const data = res.data as any
        const content: Sale[] = (data?.content || []).map((s: SaleResponse) => mapSaleResponseToUI(s))
        return {
          content,
          totalElements: (data?.totalElements as number) || 0,
          totalPages: (data?.totalPages as number) || 0,
          page: (data?.number as number) || 0
        }
      }
    })
  }

  const useCreateSale = () => {
    return useMutation({
      mutationFn: async ({ sale, orderId, cashBoxId, amountReceived, comprobante }: {
        sale: Partial<Sale>
        orderId: number
        cashBoxId: number
        amountReceived?: number
        comprobante?: { tipo: string; clienteNombre: string; clienteDocumento: string }
      }) => {
        const body = mapSaleRequestFromUI(sale, orderId, cashBoxId, amountReceived, comprobante)
        const res = await createSale({ body })
        if (res.error) throw res.error
        // Devuelve la respuesta raw para que el caller pueda acceder a comprobanteId
        return res.data ?? null
      },
      onSuccess: (_, variables) => {
        // Invalida ventas (lista y últimas)
        queryClient.invalidateQueries({ queryKey: ['sales'], exact: true })
        queryClient.invalidateQueries({ queryKey: ['sales', 'latest'], exact: true })
        // La orden pasó a ENTREGADO — invalida lista de órdenes
        queryClient.invalidateQueries({ queryKey: ['orders'], exact: true })
        // Invalida la caja específica y sus movimientos
        queryClient.invalidateQueries({ queryKey: ['cashboxes', variables.cashBoxId] })
        queryClient.invalidateQueries({ queryKey: ['cashbox', variables.cashBoxId, 'movements'] })
        // Invalida el listado general de cajas (saldo/ventas cobradas cambiaron)
        queryClient.invalidateQueries({ queryKey: ['cashboxes'], exact: true })
      }
    })
  }

  return {
    useFindAllSales,
    useFindOneSale,
    useFindLatestSales,
    useSearchSales,
    useCreateSale
  }
}

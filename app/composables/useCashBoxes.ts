import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import {
  getCashBoxes,
  getCashBoxById,
  openCashBox,
  closeCashBox,
  getMovements1, // Cashbox movements
  addMovement1 // Add Cashbox movement
} from '~/api/sdk.gen'
import type { CashBoxResponse, MovementCashboxResponse } from '~/api/types.gen'
import {
  mapCashBoxResponseToUI,
  mapCashBoxRequestFromUI,
  mapMovementCashboxResponseToUI,
  mapMovementCashboxRequestFromUI
} from '~/adapters/cashbox'
import type { CashBox, MovementCashbox } from '~/types'

export const useCashBoxes = () => {
  const queryClient = useQueryClient()

  const useFindAllCashBoxes = () => {
    return useQuery({
      queryKey: ['cashboxes'],
      queryFn: async () => {
        const res = await getCashBoxes()
        const data = res.data || []
        return Array.isArray(data) 
          ? data.map((item) => mapCashBoxResponseToUI(item as CashBoxResponse)) 
          : (data as any)?.content?.map((item: any) => mapCashBoxResponseToUI(item as CashBoxResponse)) || []
      }
    })
  }

  const useFindOneCashBox = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['cashboxes', id],
      queryFn: async () => {
        const res = await getCashBoxById({ path: { id: toValue(id) } })
        if (res.error) throw res.error
        return res.data ? mapCashBoxResponseToUI(res.data as CashBoxResponse) : null
      },
      enabled: computed(() => !!toValue(id))
    })
  }

  const useFindCashBoxMovements = (cashBoxId: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['cashbox', cashBoxId, 'movements'],
      queryFn: async () => {
        const res = await getMovements1({ path: { id: toValue(cashBoxId) } })
        const data = res.data || []
        return Array.isArray(data) 
          ? data.map((item) => mapMovementCashboxResponseToUI(item as MovementCashboxResponse)) 
          : (data as any)?.content?.map((item: any) => mapMovementCashboxResponseToUI(item as MovementCashboxResponse)) || []
      },
      enabled: computed(() => !!toValue(cashBoxId))
    })
  }

  const useOpenCashBox = () => {
    return useMutation({
      mutationFn: async (cashBox: Partial<CashBox>) => {
        const body = mapCashBoxRequestFromUI(cashBox)
        const res = await openCashBox({ body })
        if (res.error) throw res.error
        return res.data ? mapCashBoxResponseToUI(res.data as CashBoxResponse) : null
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cashboxes'] })
      }
    })
  }

  const useCloseCashBox = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await closeCashBox({ path: { id } })
        if (res.error) throw res.error
        return res.data ? mapCashBoxResponseToUI(res.data as CashBoxResponse) : null
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['cashboxes'] })
        queryClient.invalidateQueries({ queryKey: ['cashboxes', id] })
      }
    })
  }

  const useAddMovementCashbox = () => {
    return useMutation({
      mutationFn: async ({ movement, cashBoxId }: { movement: Partial<MovementCashbox>; cashBoxId: number }) => {
        const body = mapMovementCashboxRequestFromUI(movement, cashBoxId)
        const res = await addMovement1({ body })
        if (res.error) throw res.error
        return res.data ? mapMovementCashboxResponseToUI(res.data as any) : null
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['cashboxes'] })
        queryClient.invalidateQueries({ queryKey: ['cashbox', variables.cashBoxId, 'movements'] })
      }
    })
  }

  return {
    useFindAllCashBoxes,
    useFindOneCashBox,
    useFindCashBoxMovements,
    useOpenCashBox,
    useCloseCashBox,
    useAddMovementCashbox
  }
}

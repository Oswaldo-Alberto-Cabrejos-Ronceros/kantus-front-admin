import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import {
  getCashBoxes,
  getCashBoxById,
  openCashBox,
  closeCashBox,
  getMovements1,
  addMovement1,
  getCashBoxesByEmployeeId,
  getLatestCashBoxByEmployeeId
} from '~/api/sdk.gen'
import type { CashBoxResponse, MovementCashboxResponse } from '~/api/types.gen'
import {
  mapCashBoxResponseToUI,
  mapCashBoxRequestFromUI,
  mapMovementCashboxResponseToUI,
  mapMovementCashboxRequestFromUI
} from '~/adapters/cashbox'
import { extractItems, STALE } from '~/utils/query'
import type { CashBox, MovementCashbox } from '~/types'

export const useCashBoxes = () => {
  const queryClient = useQueryClient()

  const useFindAllCashBoxes = () => {
    return useQuery({
      queryKey: ['cashboxes'],
      staleTime: STALE.MEDIUM,
      queryFn: async (): Promise<CashBox[]> => {
        const res = await getCashBoxes({ query: { page: 0, size: 100 } })
        return extractItems<CashBoxResponse>(res.data as any).map(mapCashBoxResponseToUI)
      }
    })
  }

  const useFindCashBoxesByEmployee = (
    employeeId: MaybeRef<number>,
    page: MaybeRef<number> = 0,
    size: MaybeRef<number> = 10
  ) => {
    return useQuery({
      queryKey: ['cashboxes', 'employee', employeeId, page, size],
      staleTime: STALE.MEDIUM,
      queryFn: async () => {
        const res = await getCashBoxesByEmployeeId({
          path: { employeeId: toValue(employeeId) },
          query: { page: toValue(page), size: toValue(size) }
        })
        const content = extractItems<CashBoxResponse>(res.data as any)
        return {
          content: content.map(mapCashBoxResponseToUI),
          totalElements: (res.data as any)?.totalElements ?? 0,
          totalPages: (res.data as any)?.totalPages ?? 0
        }
      },
      enabled: computed(() => !!toValue(employeeId))
    })
  }

  /** Primera caja con status ABIERTA del sistema (para que el mozo pueda usarla) */
  const useFindActiveCashBox = () => {
    return useQuery({
      queryKey: ['cashboxes', 'active'],
      staleTime: STALE.LIVE,
      queryFn: async (): Promise<CashBox | null> => {
        try {
          const res = await getCashBoxes({ query: { status: 'ABIERTA', page: 0, size: 1 } })
          const items = extractItems<CashBoxResponse>(res.data as any)
          return items.length > 0 ? mapCashBoxResponseToUI(items[0]) : null
        } catch {
          return null
        }
      }
    })
  }

  const useFindLatestCashBoxByEmployee = (employeeId: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['cashboxes', 'employee', employeeId, 'latest'],
      staleTime: STALE.MEDIUM,
      queryFn: async (): Promise<CashBox | null> => {
        try {
          const res = await getLatestCashBoxByEmployeeId({
            path: { employeeId: toValue(employeeId) }
          })
          if (res.error) return null
          return res.data ? mapCashBoxResponseToUI(res.data as CashBoxResponse) : null
        } catch {
          return null
        }
      },
      enabled: computed(() => !!toValue(employeeId))
    })
  }

  const useFindOneCashBox = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['cashboxes', id],
      staleTime: STALE.MEDIUM,
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
      staleTime: STALE.MEDIUM,
      queryFn: async (): Promise<MovementCashbox[]> => {
        const res = await getMovements1({ path: { id: toValue(cashBoxId) } })
        return extractItems<MovementCashboxResponse>(res.data as any).map(mapMovementCashboxResponseToUI)
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
        queryClient.invalidateQueries({ queryKey: ['cashboxes', 'active'] })
      }
    })
  }

  const useCloseCashBox = () => {
    return useMutation({
      mutationFn: async ({ id, closingAmount }: { id: number; closingAmount?: number }) => {
        const res = await closeCashBox({
          path: { id },
          body: closingAmount != null ? { closingAmount } : undefined
        } as any)
        if (res.error) throw res.error
        return res.data ? mapCashBoxResponseToUI(res.data as CashBoxResponse) : null
      },
      onSuccess: (_, vars) => {
        queryClient.invalidateQueries({ queryKey: ['cashboxes'] })
        queryClient.invalidateQueries({ queryKey: ['cashboxes', 'active'] })
        queryClient.invalidateQueries({ queryKey: ['cashboxes', vars.id] })
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
        queryClient.invalidateQueries({ queryKey: ['cashboxes', variables.cashBoxId] })
        queryClient.invalidateQueries({ queryKey: ['cashbox', variables.cashBoxId, 'movements'] })
        queryClient.invalidateQueries({ queryKey: ['cashboxes'], exact: true })
      }
    })
  }

  return {
    useFindAllCashBoxes,
    useFindActiveCashBox,
    useFindCashBoxesByEmployee,
    useFindLatestCashBoxByEmployee,
    useFindOneCashBox,
    useFindCashBoxMovements,
    useOpenCashBox,
    useCloseCashBox,
    useAddMovementCashbox
  }
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import {
  getAllTables,
  createTable,
  updateTable,
  activateTable,
  deactivateTable,
  occupyTable,
  freeTable,
  getTableById
} from '~/api/sdk.gen'
import type { RestaurantTableResponse } from '~/api/types.gen'
import { mapTableResponseToUI, mapTableRequestFromUI } from '~/adapters/table'
import type { Table } from '~/types'

export const useTables = () => {
  const queryClient = useQueryClient()

  const useFindAllTables = () => {
    return useQuery({
      queryKey: ['tables'],
      queryFn: async () => {
        const res = await getAllTables()
        const data = res.data || []
        return Array.isArray(data) 
          ? data.map((item) => mapTableResponseToUI(item as RestaurantTableResponse)) 
          : (data as any)?.content?.map((item: any) => mapTableResponseToUI(item as RestaurantTableResponse)) || []
      }
    })
  }

  const useFindOneTable = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['tables', id],
      queryFn: async () => {
        const res = await getTableById({ path: { id: toValue(id) } })
        if (res.error) throw res.error
        return res.data ? mapTableResponseToUI(res.data as RestaurantTableResponse) : null
      },
      enabled: computed(() => !!toValue(id))
    })
  }

  const useCreateTable = () => {
    return useMutation({
      mutationFn: async (table: Partial<Table>) => {
        const body = mapTableRequestFromUI(table)
        const res = await createTable({ body })
        if (res.error) throw res.error
        return res.data ? mapTableResponseToUI(res.data as RestaurantTableResponse) : null
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tables'] })
      }
    })
  }

  const useUpdateTable = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Partial<Table> }) => {
        const body = mapTableRequestFromUI(data)
        const res = await updateTable({ path: { id }, body })
        if (res.error) throw res.error
        return res.data ? mapTableResponseToUI(res.data as RestaurantTableResponse) : null
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['tables'] })
        queryClient.invalidateQueries({ queryKey: ['tables', variables.id] })
      }
    })
  }

  const useActivateTable = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await activateTable({ path: { id } })
        if (res.error) throw res.error
        return res.data ? mapTableResponseToUI(res.data as RestaurantTableResponse) : null
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['tables'] })
        queryClient.invalidateQueries({ queryKey: ['tables', id] })
      }
    })
  }

  const useDeactivateTable = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await deactivateTable({ path: { id } })
        if (res.error) throw res.error
        return res.data ? mapTableResponseToUI(res.data as RestaurantTableResponse) : null
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['tables'] })
        queryClient.invalidateQueries({ queryKey: ['tables', id] })
      }
    })
  }

  const useOccupyTable = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await occupyTable({ path: { id } })
        if (res.error) throw res.error
        return res.data ? mapTableResponseToUI(res.data as RestaurantTableResponse) : null
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['tables'] })
        queryClient.invalidateQueries({ queryKey: ['tables', id] })
      }
    })
  }

  const useFreeTable = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await freeTable({ path: { id } })
        if (res.error) throw res.error
        return res.data ? mapTableResponseToUI(res.data as RestaurantTableResponse) : null
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['tables'] })
        queryClient.invalidateQueries({ queryKey: ['tables', id] })
      }
    })
  }

  return {
    useFindAllTables,
    useFindOneTable,
    useCreateTable,
    useUpdateTable,
    useActivateTable,
    useDeactivateTable,
    useOccupyTable,
    useFreeTable
  }
}

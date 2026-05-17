import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  activateSupplier,
  deactivateSupplier,
  getSupplierById
} from '~/api/sdk.gen'
import type { SupplierResponse } from '~/api/types.gen'
import { mapSupplierResponseToUI, mapSupplierRequestFromUI } from '~/adapters/supplier'
import type { Supplier } from '~/types'

export const useSuppliers = () => {
  const queryClient = useQueryClient()

  const useFindAllSuppliers = () => {
    return useQuery({
      queryKey: ['suppliers'],
      queryFn: async () => {
        const res = await getAllSuppliers()
        const data = res.data || []
        return Array.isArray(data) 
          ? data.map((item) => mapSupplierResponseToUI(item as SupplierResponse)) 
          : (data as any)?.content?.map((item: any) => mapSupplierResponseToUI(item as SupplierResponse)) || []
      }
    })
  }

  const useFindOneSupplier = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['suppliers', id],
      queryFn: async () => {
        const res = await getSupplierById({ path: { id: toValue(id) } })
        if (res.error) throw res.error
        return res.data ? mapSupplierResponseToUI(res.data as SupplierResponse) : null
      },
      enabled: computed(() => !!toValue(id))
    })
  }

  const useCreateSupplier = () => {
    return useMutation({
      mutationFn: async (supplier: Partial<Supplier>) => {
        const body = mapSupplierRequestFromUI(supplier)
        const res = await createSupplier({ body })
        if (res.error) throw res.error
        return res.data ? mapSupplierResponseToUI(res.data as SupplierResponse) : null
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      }
    })
  }

  const useUpdateSupplier = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Partial<Supplier> }) => {
        const body = mapSupplierRequestFromUI(data)
        const res = await updateSupplier({ path: { id }, body })
        if (res.error) throw res.error
        return res.data ? mapSupplierResponseToUI(res.data as SupplierResponse) : null
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['suppliers'] })
        queryClient.invalidateQueries({ queryKey: ['suppliers', variables.id] })
      }
    })
  }

  const useActivateSupplier = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await activateSupplier({ path: { id } })
        if (res.error) throw res.error
        return res.data ? mapSupplierResponseToUI(res.data as SupplierResponse) : null
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['suppliers'] })
        queryClient.invalidateQueries({ queryKey: ['suppliers', id] })
      }
    })
  }

  const useDeactivateSupplier = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await deactivateSupplier({ path: { id } })
        if (res.error) throw res.error
        return res.data ? mapSupplierResponseToUI(res.data as SupplierResponse) : null
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['suppliers'] })
        queryClient.invalidateQueries({ queryKey: ['suppliers', id] })
      }
    })
  }

  return {
    useFindAllSuppliers,
    useFindOneSupplier,
    useCreateSupplier,
    useUpdateSupplier,
    useActivateSupplier,
    useDeactivateSupplier
  }
}

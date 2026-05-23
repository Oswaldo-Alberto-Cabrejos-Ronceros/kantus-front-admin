import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import {
  getAllCategories,
  createCategory,
  updateCategory,
  activateCategory,
  deactivateCategory,
  getCategoryById,
} from '~/api/sdk.gen'
import type { CategoryResponse } from '~/api/types.gen'
import { mapCategoryResponseToUI, mapCategoryRequestFromUI } from '~/adapters/category'
import { extractItems, STALE } from '~/utils/query'
import type { Category } from '~/types'

export const useCategories = () => {
  const queryClient = useQueryClient()

  const useFindAllCategories = () => {
    return useQuery({
      queryKey: ['categories'],
      staleTime: STALE.STATIC,
      queryFn: async (): Promise<Category[]> => {
        const res = await getAllCategories()
        return extractItems<CategoryResponse>(res.data as any).map(mapCategoryResponseToUI)
      }
    })
  }

  const useFindOneCategory = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['categories', id],
      staleTime: STALE.STATIC,
      queryFn: async () => {
        const res = await getCategoryById({ path: { id: toValue(id) } })
        if (res.error) throw res.error
        return res.data ? mapCategoryResponseToUI(res.data as CategoryResponse) : null
      },
      enabled: computed(() => !!toValue(id))
    })
  }

  const useCreateCategory = () => {
    return useMutation({
      mutationFn: async (category: Partial<Category>) => {
        const body = mapCategoryRequestFromUI(category)
        const res = await createCategory({ body })
        if (res.error) throw res.error
        return res.data ? mapCategoryResponseToUI(res.data as CategoryResponse) : null
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categories'], exact: true })
      }
    })
  }

  const useUpdateCategory = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Partial<Category> }) => {
        const body = mapCategoryRequestFromUI(data)
        const res = await updateCategory({ path: { id }, body })
        if (res.error) throw res.error
        return res.data ? mapCategoryResponseToUI(res.data as CategoryResponse) : null
      },
      onSuccess: (updatedCategory, variables) => {
        if (updatedCategory) queryClient.setQueryData(['categories', variables.id], updatedCategory)
        queryClient.invalidateQueries({ queryKey: ['categories'], exact: true })
      }
    })
  }

  const useActivateCategory = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await activateCategory({ path: { id } })
        if (res.error) throw res.error
        return res.data ? mapCategoryResponseToUI(res.data as CategoryResponse) : null
      },
      onSuccess: (updated, id) => {
        if (updated) queryClient.setQueryData(['categories', id], updated)
        queryClient.invalidateQueries({ queryKey: ['categories'], exact: true })
      }
    })
  }

  const useDeactivateCategory = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await deactivateCategory({ path: { id } })
        if (res.error) throw res.error
        return res.data ? mapCategoryResponseToUI(res.data as CategoryResponse) : null
      },
      onSuccess: (updated, id) => {
        if (updated) queryClient.setQueryData(['categories', id], updated)
        queryClient.invalidateQueries({ queryKey: ['categories'], exact: true })
      }
    })
  }

  return {
    useFindAllCategories,
    useFindOneCategory,
    useCreateCategory,
    useUpdateCategory,
    useActivateCategory,
    useDeactivateCategory
  }
}

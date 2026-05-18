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
import type { Category } from '~/types'

export const useCategories = () => {
  const queryClient = useQueryClient()

  const useFindAllCategories = () => {
    return useQuery({
      queryKey: ['categories'],
      queryFn: async (): Promise<Category[]> => {
        const res = await getAllCategories()
        const data = res.data || []
        return Array.isArray(data) 
          ? data.map((item) => mapCategoryResponseToUI(item as CategoryResponse)) 
          : (data as any)?.content?.map((item: any) => mapCategoryResponseToUI(item as CategoryResponse)) || []
      }
    })
  }

  const useFindOneCategory = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['categories', id],
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
        queryClient.invalidateQueries({ queryKey: ['categories'] })
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
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['categories'] })
        queryClient.invalidateQueries({ queryKey: ['categories', variables.id] })
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
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['categories'] })
        queryClient.invalidateQueries({ queryKey: ['categories', id] })
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
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['categories'] })
        queryClient.invalidateQueries({ queryKey: ['categories', id] })
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

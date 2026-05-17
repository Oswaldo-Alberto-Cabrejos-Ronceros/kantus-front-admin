import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import {
  getAllProducts,
  createProduct,
  updateProduct,
  activateProduct,
  deactivateProduct,
  getProductsByCategory,
  getProductById
} from '~/api/sdk.gen'
import type { ProductResponse } from '~/api/types.gen'
import { mapProductResponseToUI, mapProductRequestFromUI } from '~/adapters/product'
import type { Product } from '~/types'

export const useProducts = () => {
  const queryClient = useQueryClient()

  const useFindAllProducts = () => {
    return useQuery({
      queryKey: ['products'],
      queryFn: async () => {
        const res = await getAllProducts()
        const data = res.data || []
        return Array.isArray(data) 
          ? data.map((item) => mapProductResponseToUI(item as ProductResponse)) 
          : (data as any)?.content?.map((item: any) => mapProductResponseToUI(item as ProductResponse)) || []
      }
    })
  }

  const useFindOneProduct = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['products', id],
      queryFn: async () => {
        const res = await getProductById({ path: { id: toValue(id) } })
        if (res.error) throw res.error
        return res.data ? mapProductResponseToUI(res.data as ProductResponse) : null
      },
      enabled: computed(() => !!toValue(id))
    })
  }

  const useFindProductsByCategory = (categoryId: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['products', 'category', categoryId],
      queryFn: async () => {
        const res = await getProductsByCategory({ path: { categoryId: toValue(categoryId) } })
        const data = res.data || []
        return Array.isArray(data) 
          ? data.map((item) => mapProductResponseToUI(item as ProductResponse)) 
          : (data as any)?.content?.map((item: any) => mapProductResponseToUI(item as ProductResponse)) || []
      },
      enabled: computed(() => !!toValue(categoryId))
    })
  }

  const useCreateProduct = () => {
    return useMutation({
      mutationFn: async (product: Partial<Product>) => {
        const body = mapProductRequestFromUI(product)
        const res = await createProduct({ body })
        if (res.error) throw res.error
        return res.data ? mapProductResponseToUI(res.data as ProductResponse) : null
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
      }
    })
  }

  const useUpdateProduct = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Partial<Product> }) => {
        const body = mapProductRequestFromUI(data)
        const res = await updateProduct({ path: { id }, body })
        if (res.error) throw res.error
        return res.data ? mapProductResponseToUI(res.data as ProductResponse) : null
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['products', variables.id] })
      }
    })
  }

  const useActivateProduct = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await activateProduct({ path: { id } })
        if (res.error) throw res.error
        return res.data ? mapProductResponseToUI(res.data as ProductResponse) : null
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['products', id] })
      }
    })
  }

  const useDeactivateProduct = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await deactivateProduct({ path: { id } })
        if (res.error) throw res.error
        return res.data ? mapProductResponseToUI(res.data as ProductResponse) : null
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['products', id] })
      }
    })
  }

  return {
    useFindAllProducts,
    useFindOneProduct,
    useFindProductsByCategory,
    useCreateProduct,
    useUpdateProduct,
    useActivateProduct,
    useDeactivateProduct
  }
}

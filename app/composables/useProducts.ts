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
  getProductById,
  getTopProducts
} from '~/api/sdk.gen'
import type { ProductResponse } from '~/api/types.gen'
import { mapProductResponseToUI, mapProductRequestFromUI } from '~/adapters/product'
import { extractItems, STALE } from '~/utils/query'
import type { Product, ProductTop } from '~/types'

export const useProducts = () => {
  const queryClient = useQueryClient()

  const useFindAllProducts = () => {
    return useQuery({
      queryKey: ['products'],
      staleTime: STALE.STATIC,
      queryFn: async (): Promise<Product[]> => {
        const res = await getAllProducts()
        return extractItems<ProductResponse>(res.data as any).map(mapProductResponseToUI)
      }
    })
  }

  const useFindOneProduct = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['products', id],
      staleTime: STALE.STATIC,
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
      staleTime: STALE.STATIC,
      queryFn: async (): Promise<Product[]> => {
        const res = await getProductsByCategory({ path: { categoryId: toValue(categoryId) } })
        return extractItems<ProductResponse>(res.data as any).map(mapProductResponseToUI)
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
        queryClient.invalidateQueries({ queryKey: ['products'], exact: true })
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
      onSuccess: (updatedProduct, variables) => {
        if (updatedProduct) queryClient.setQueryData(['products', variables.id], updatedProduct)
        queryClient.invalidateQueries({ queryKey: ['products'], exact: true })
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
      onSuccess: (updatedProduct, id) => {
        if (updatedProduct) queryClient.setQueryData(['products', id], updatedProduct)
        queryClient.invalidateQueries({ queryKey: ['products'], exact: true })
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
      onSuccess: (updatedProduct, id) => {
        if (updatedProduct) queryClient.setQueryData(['products', id], updatedProduct)
        queryClient.invalidateQueries({ queryKey: ['products'], exact: true })
      }
    })
  }

  const useGetTopProducts = () => {
    return useQuery({
      queryKey: ['products', 'top'],
      staleTime: STALE.MEDIUM,
      queryFn: async (): Promise<ProductTop[]> => {
        const res = await getTopProducts()
        if (res.error) throw res.error
        return extractItems<ProductTop>(res.data as any)
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
    useDeactivateProduct,
    useGetTopProducts
  }
}

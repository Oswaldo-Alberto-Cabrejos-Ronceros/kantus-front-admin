import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import {
  getAllCategoriesInventory,
  createCategoryInventory,
  updateCategoryInventory,
  activateCategoryInventory,
  deactivateCategoryInventory,
  getCategoryInventoryById,
  getAllProductsInventory,
  createProductInventory,
  updateProductInventory,
  activateProductInventory,
  deactivateProductInventory,
  getProductInventoryById,
  getMovements,
  addMovement,
  getMovementById
} from '~/api/sdk.gen'
import type { CategoryInventoryResponse, ProductInventoryResponse, MovementInventoryResponse } from '~/api/types.gen'
import {
  mapCategoryInventoryResponseToUI,
  mapCategoryInventoryRequestFromUI,
  mapProductInventoryResponseToUI,
  mapProductInventoryRequestFromUI,
  mapMovementInventoryResponseToUI,
  mapMovementInventoryRequestFromUI
} from '~/adapters/inventory'
import type { CategoryInventory, ProductInventory, MovementInventory } from '~/types'

export const useInventory = () => {
  const queryClient = useQueryClient()

  // --- Category Inventory ---
  const useFindAllCategoriesInventory = () => useQuery({
    queryKey: ['categories-inventory'],
    queryFn: async (): Promise<CategoryInventory[]> => {
      const res = await getAllCategoriesInventory()
      const data = res.data || []
      return Array.isArray(data) 
        ? data.map((item) => mapCategoryInventoryResponseToUI(item as CategoryInventoryResponse)) 
        : (data as any)?.content?.map((item: any) => mapCategoryInventoryResponseToUI(item as CategoryInventoryResponse)) || []
    }
  })

  const useFindOneCategoryInventory = (id: MaybeRef<number>) => useQuery({
    queryKey: ['categories-inventory', id],
    queryFn: async () => {
      const res = await getCategoryInventoryById({ path: { id: toValue(id) } })
      if (res.error) throw res.error
      return res.data ? mapCategoryInventoryResponseToUI(res.data as CategoryInventoryResponse) : null
    },
    enabled: computed(() => !!toValue(id))
  })

  const useCreateCategoryInventory = () => useMutation({
    mutationFn: async (category: Partial<CategoryInventory>) => {
      const body = mapCategoryInventoryRequestFromUI(category)
      const res = await createCategoryInventory({ body })
      if (res.error) throw res.error
      return res.data ? mapCategoryInventoryResponseToUI(res.data as CategoryInventoryResponse) : null
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories-inventory'] })
  })

  const useUpdateCategoryInventory = () => useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CategoryInventory> }) => {
      const body = mapCategoryInventoryRequestFromUI(data)
      const res = await updateCategoryInventory({ path: { id }, body })
      if (res.error) throw res.error
      return res.data ? mapCategoryInventoryResponseToUI(res.data as CategoryInventoryResponse) : null
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories-inventory'] })
      queryClient.invalidateQueries({ queryKey: ['categories-inventory', variables.id] })
    }
  })

  const useActivateCategoryInventory = () => useMutation({
    mutationFn: async (id: number) => {
      const res = await activateCategoryInventory({ path: { id } })
      if (res.error) throw res.error
      return res.data ? mapCategoryInventoryResponseToUI(res.data as CategoryInventoryResponse) : null
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['categories-inventory'] })
      queryClient.invalidateQueries({ queryKey: ['categories-inventory', id] })
    }
  })

  const useDeactivateCategoryInventory = () => useMutation({
    mutationFn: async (id: number) => {
      const res = await deactivateCategoryInventory({ path: { id } })
      if (res.error) throw res.error
      return res.data ? mapCategoryInventoryResponseToUI(res.data as CategoryInventoryResponse) : null
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['categories-inventory'] })
      queryClient.invalidateQueries({ queryKey: ['categories-inventory', id] })
    }
  })

  // --- Product Inventory ---
  const useFindAllProductsInventory = () => useQuery({
    queryKey: ['products-inventory'],
    queryFn: async (): Promise<ProductInventory[]> => {
      const res = await getAllProductsInventory()
      const data = res.data || []
      return Array.isArray(data) 
        ? data.map((item) => mapProductInventoryResponseToUI(item as ProductInventoryResponse)) 
        : (data as any)?.content?.map((item: any) => mapProductInventoryResponseToUI(item as ProductInventoryResponse)) || []
    }
  })

  const useFindOneProductInventory = (id: MaybeRef<number>) => useQuery({
    queryKey: ['products-inventory', id],
    queryFn: async () => {
      const res = await getProductInventoryById({ path: { id: toValue(id) } })
      if (res.error) throw res.error
      return res.data ? mapProductInventoryResponseToUI(res.data as ProductInventoryResponse) : null
    },
    enabled: computed(() => !!toValue(id))
  })

  const useCreateProductInventory = () => useMutation({
    mutationFn: async (product: Partial<ProductInventory>) => {
      const body = mapProductInventoryRequestFromUI(product)
      const res = await createProductInventory({ body })
      if (res.error) throw res.error
      return res.data ? mapProductInventoryResponseToUI(res.data as ProductInventoryResponse) : null
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products-inventory'] })
  })

  const useUpdateProductInventory = () => useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ProductInventory> }) => {
      const body = mapProductInventoryRequestFromUI(data)
      const res = await updateProductInventory({ path: { id }, body })
      if (res.error) throw res.error
      return res.data ? mapProductInventoryResponseToUI(res.data as ProductInventoryResponse) : null
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products-inventory'] })
      queryClient.invalidateQueries({ queryKey: ['products-inventory', variables.id] })
    }
  })

  const useActivateProductInventory = () => useMutation({
    mutationFn: async (id: number) => {
      const res = await activateProductInventory({ path: { id } })
      if (res.error) throw res.error
      return res.data ? mapProductInventoryResponseToUI(res.data as ProductInventoryResponse) : null
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['products-inventory'] })
      queryClient.invalidateQueries({ queryKey: ['products-inventory', id] })
    }
  })

  const useDeactivateProductInventory = () => useMutation({
    mutationFn: async (id: number) => {
      const res = await deactivateProductInventory({ path: { id } })
      if (res.error) throw res.error
      return res.data ? mapProductInventoryResponseToUI(res.data as ProductInventoryResponse) : null
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['products-inventory'] })
      queryClient.invalidateQueries({ queryKey: ['products-inventory', id] })
    }
  })

  // --- Movements Inventory ---
  const useFindAllMovementsInventory = () => useQuery({
    queryKey: ['movements-inventory'],
    queryFn: async (): Promise<MovementInventory[]> => {
      const res = await getMovements()
      const data = res.data || []
      return Array.isArray(data) 
        ? data.map((item) => mapMovementInventoryResponseToUI(item as MovementInventoryResponse)) 
        : (data as any)?.content?.map((item: any) => mapMovementInventoryResponseToUI(item as MovementInventoryResponse)) || []
    }
  })

  const useFindOneMovementInventory = (id: MaybeRef<number>) => useQuery({
    queryKey: ['movements-inventory', id],
    queryFn: async () => {
      const res = await getMovementById({ path: { id: toValue(id) } })
      if (res.error) throw res.error
      return res.data ? mapMovementInventoryResponseToUI(res.data as MovementInventoryResponse) : null
    },
    enabled: computed(() => !!toValue(id))
  })

  const useAddMovement = () => useMutation({
    mutationFn: async (movement: Partial<MovementInventory>) => {
      const body = mapMovementInventoryRequestFromUI(movement)
      const res = await addMovement({ body })
      if (res.error) throw res.error
      return res.data ? mapMovementInventoryResponseToUI(res.data as MovementInventoryResponse) : null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements-inventory'] })
      queryClient.invalidateQueries({ queryKey: ['products-inventory'] })
    }
  })

  return {
    useFindAllCategoriesInventory,
    useFindOneCategoryInventory,
    useCreateCategoryInventory,
    useUpdateCategoryInventory,
    useActivateCategoryInventory,
    useDeactivateCategoryInventory,
    
    useFindAllProductsInventory,
    useFindOneProductInventory,
    useCreateProductInventory,
    useUpdateProductInventory,
    useActivateProductInventory,
    useDeactivateProductInventory,

    useFindAllMovementsInventory,
    useFindOneMovementInventory,
    useAddMovement
  }
}

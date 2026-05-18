import type {
  CategoryInventoryResponse,
  CategoryInventoryRequest,
  ProductInventoryResponse,
  ProductInventoryRequest,
  MovementInventoryResponse,
  MovementInventoryRequest
} from '~/api/types.gen'
import type { CategoryInventory, ProductInventory, MovementInventory, MovementType } from '~/types'

// Category Inventory
export const mapCategoryInventoryResponseToUI = (data: CategoryInventoryResponse): CategoryInventory => ({
  id: data.id,
  name: data.name,
  description: data.description,
  status: data.status
})

export const mapCategoryInventoryRequestFromUI = (data: Partial<CategoryInventory>): CategoryInventoryRequest => ({
  name: data.name || '',
  description: data.description
})

// Product Inventory
export const mapProductInventoryResponseToUI = (data: ProductInventoryResponse): ProductInventory => ({
  id: data.id || 0,
  name: data.name || '',
  description: data.description,
  categoryId: data.categoryId || 0,
  unitary: data.unitary || 'Unidad',
  status: data.status ?? false
})

export const mapProductInventoryRequestFromUI = (data: Partial<ProductInventory>): ProductInventoryRequest => ({
  name: data.name || '',
  description: data.description,
  categoryId: data.categoryId || 0,
  unitary: data.unitary || 'Unidad'
})

// Movement Inventory
export const mapMovementInventoryResponseToUI = (data: MovementInventoryResponse): MovementInventory => ({
  id: data.id || 0,
  fecha: data.fecha || new Date(),
  productInventoryId: data.productInventoryId || 0,  // campo correcto
  productName: data.productInventoryName || '',
  tipo: (data.tipo || 'ENTRADA') as MovementType,
  cantidad: data.cantidad || 0,
  razon: data.razon || ''
})

export const mapMovementInventoryRequestFromUI = (data: Partial<MovementInventory>): MovementInventoryRequest => ({
  productInventoryId: data.productInventoryId || 0,  // campo correcto (no productId)
  tipo: (data.tipo || 'ENTRADA') as 'ENTRADA' | 'SALIDA',
  cantidad: data.cantidad || 0,
  razon: data.razon || ''
})

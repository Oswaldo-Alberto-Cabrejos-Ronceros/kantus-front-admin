import type {
  CategoryInventoryResponse,
  CategoryInventoryRequest,
  ProductInventoryResponse,
  ProductInventoryRequest,
  MovementInventoryResponse,
  MovementInventoryRequest
} from '~/api/types.gen'
import type { CategoryInventory, ProductInventory, MovementInventory } from '~/types'

// Category Inventory
export const mapCategoryInventoryResponseToUI = (data: CategoryInventoryResponse): CategoryInventory => ({
  id: data.id,
  name: data.name,
  status: data.status
})

export const mapCategoryInventoryRequestFromUI = (data: Partial<CategoryInventory>): CategoryInventoryRequest => ({
  name: data.name || '',
  description: ''
})

// Product Inventory
export const mapProductInventoryResponseToUI = (data: ProductInventoryResponse): ProductInventory => ({
  id: data.id || 0,
  name: data.name || '',
  categoryId: data.categoryId || 0,
  cantidad: 0, // Assuming 'cantidad' is handled separately or by movement sum as it's not in the openapi
  unidad: (data.unitary as any) || 'Unidad',
  fechaVencimiento: new Date(), // Not mapped directly in response
  estado: data.status ?? false
})

export const mapProductInventoryRequestFromUI = (data: Partial<ProductInventory>): ProductInventoryRequest => ({
  name: data.name || '',
  categoryId: data.categoryId || 0,
  unitary: data.unidad || 'Unidad',
  description: ''
})

// Movement Inventory
export const mapMovementInventoryResponseToUI = (data: MovementInventoryResponse): MovementInventory => ({
  id: data.id || 0,
  fecha: data.fecha || new Date(),
  productId: data.productInventoryId || 0,
  productName: data.productInventoryName || '',
  tipo: (data.tipo?.toLowerCase() as 'entrada' | 'salida') || 'entrada',
  cantidad: data.cantidad || 0,
  razon: data.razon || ''
})

export const mapMovementInventoryRequestFromUI = (data: Partial<MovementInventory>): MovementInventoryRequest => ({
  productInventoryId: data.productId || 0,
  tipo: data.tipo === 'salida' ? 'SALIDA' : 'ENTRADA',
  cantidad: data.cantidad || 0,
  razon: data.razon || ''
})

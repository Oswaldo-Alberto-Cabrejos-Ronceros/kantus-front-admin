import type { ProductResponse, ProductRequest } from '~/api/types.gen'
import type { Product } from '~/types'

export const mapProductResponseToUI = (data: ProductResponse): Product => {
  return {
    id: data.id || 0,
    categoryId: data.categoryId || 0,
    imageUrl: '', // Default as it's not present in the OpenAPI generated types
    name: data.name || '',
    description: data.description || '',
    price: data.price || 0,
    status: data.status ?? false
  }
}

export const mapProductRequestFromUI = (data: Partial<Product>): ProductRequest => {
  return {
    name: data.name || '',
    description: data.description || '',
    price: data.price || 0,
    categoryId: data.categoryId || 0
  }
}

import type { CategoryResponse, CategoryRequest } from '~/api/types.gen'
import type { Category } from '~/types'

export const mapCategoryResponseToUI = (data: CategoryResponse): Category => ({
  id: data.id,
  name: data.name,
  description: data.description,
  status: data.status
})

export const mapCategoryRequestFromUI = (data: Partial<Category>): CategoryRequest => ({
  name: data.name || '',
  description: data.description || ''  // requerido por el backend
})

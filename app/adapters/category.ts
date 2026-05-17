import type { CategoryResponse, CategoryRequest } from '~/api/types.gen'
import type { Category } from '~/types'

export const mapCategoryResponseToUI = (data: CategoryResponse): Category => {
  return {
    id: data.id,
    name: data.name,
    status: data.status
  }
}

export const mapCategoryRequestFromUI = (data: Partial<Category>): CategoryRequest => {
  return {
    name: data.name || '',
    description: '' // Default, as UI doesn't use description for Category currently
  }
}

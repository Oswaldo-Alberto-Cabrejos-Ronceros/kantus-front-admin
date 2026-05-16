import type { Category } from '~/types'

export const mockCategories: Category[] = [
  { id: 1, name: 'Pollo a la Brasa', status: true },
  { id: 2, name: 'Parrillas', status: true },
  { id: 3, name: 'Bebidas', status: true },
  { id: 4, name: 'Postres', status: false }
]

export default defineEventHandler(async () => {
  return mockCategories
})

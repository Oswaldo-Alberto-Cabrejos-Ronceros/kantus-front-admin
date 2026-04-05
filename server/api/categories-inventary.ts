import type { CategoryInventory } from '~/types'

export default defineEventHandler(async () => {
  const categories: CategoryInventory[] = [
    { id: 1, name: 'Carnes' },
    { id: 2, name: 'Lácteos' },
    { id: 3, name: 'Vegetales' }
  ]

  return categories
})

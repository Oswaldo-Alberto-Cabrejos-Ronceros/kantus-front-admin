import type { CategoryInventory } from '~/types'

export default defineEventHandler(async () => {
  const categories: CategoryInventory[] = [
    { id: 1, name: 'Carnes y Aves', status: true },
    { id: 2, name: 'Verduras y Tubérculos', status: true },
    { id: 3, name: 'Insumos Generales', status: true },
    { id: 4, name: 'Bebidas', status: true }
  ]
  return categories
})

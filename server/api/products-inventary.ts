import type { ProductInventory } from '~/types'

export default defineEventHandler(async () => {
  const products: ProductInventory[] = [
    {
      id: 1,
      name: 'Carne de Res',
      categoryId: 1,
      cantidad: 15,
      unidad: 'Kilogramo',
      fechaVencimiento: '2026-05-15',
      estado: true
    }
  ]
  return products
})

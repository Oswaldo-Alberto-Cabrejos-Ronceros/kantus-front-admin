import type { MovementInventory } from '~/types'

export default defineEventHandler(async () => {
  const movements: MovementInventory[] = [
    {
      id: 1,
      fecha: new Date(),
      productId: 1,
      productName: 'Carne de Res',
      tipo: 'entrada',
      cantidad: 10,
      razon: 'Abastecimiento semanal'
    }
  ]
  return movements
})

import { defineEventHandler } from 'h3'
import type { MovementInventory } from '~/types'

export default defineEventHandler(async () => {
  const movements: MovementInventory[] = [
    {
      id: 1,
      fecha: new Date().toISOString(),
      productId: 1,
      productName: 'Carne de Res',
      tipo: 'entrada',
      cantidad: 20,
      razon: 'Compra semanal a proveedor'
    },
    {
      id: 2,
      fecha: new Date(Date.now() - 86400000).toISOString(), // Hace un día
      productId: 2,
      productName: 'Papas',
      tipo: 'salida',
      cantidad: 5,
      razon: 'Merma por mal estado'
    }
  ]

  return movements
})

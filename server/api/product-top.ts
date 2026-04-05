import type { ProductTop } from '~/types'

export default defineEventHandler(async () => {
  const topProducts: ProductTop[] = [
    { id: 1, productId: 1, productName: '1/4 de Pollo a la Brasa', quantity: 150, totalCollected: 2775.00 },
    { id: 2, productId: 3, productName: 'Pollo a la Brasa Entero', quantity: 120, totalCollected: 7800.00 },
    { id: 3, productId: 6, productName: 'Jarra de Chicha Morada 1L', quantity: 95, totalCollected: 1140.00 },
    { id: 4, productId: 2, productName: '1/2 Pollo a la Brasa', quantity: 60, totalCollected: 2100.00 },
    { id: 5, productId: 4, productName: 'Parrilla Mixta', quantity: 45, totalCollected: 2160.00 }
  ]
  return topProducts
})

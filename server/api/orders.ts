import type { Order } from '~/types'

export const mockOrders: Order[] = [
  {
    id: 1,
    code: 'ORD-001',
    status: 'Pendiente',
    type: 'salon',
    products: [
      { id: 1, name: 'Ceviche Clásico', priceUnitary: 35.00, quantity: 2 },
      { id: 2, name: 'Pisco Sour', priceUnitary: 10.00, quantity: 2 }
    ],
    time: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // Hace 5 minutos
    totalPrice: 90.00
  },
  {
    id: 2,
    code: 'ORD-002',
    status: 'Preparando',
    type: 'delivery',
    products: [
      { id: 3, name: 'Lomo Saltado', priceUnitary: 40.00, quantity: 1 },
      { id: 4, name: 'Chicha Morada 1L', priceUnitary: 15.00, quantity: 1 }
    ],
    time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // Hace 15 minutos
    totalPrice: 55.00,
    customerName: 'Juan Pérez',
    customerPhone: '987654321',
    location: 'Av. Larco 123, Miraflores'
  }
]

export default defineEventHandler(async () => {
  return mockOrders
})

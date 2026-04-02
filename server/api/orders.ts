import type { Order } from '~/types'

export default defineEventHandler(async () => {
  const mockOrders: Order[] = [
    {
      id: 1,
      code: 'ORD-001',
      status: 'Pendiente',
      type: 'salon',
      products: [
        { name: 'Ceviche Clásico', quantity: 2 },
        { name: 'Pisco Sour', quantity: 2 }
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
        { name: 'Lomo Saltado', quantity: 1 },
        { name: 'Chicha Morada 1L', quantity: 1 }
      ],
      time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // Hace 15 minutos
      totalPrice: 55.00,
      customerName: 'Juan Pérez',
      customerPhone: '987654321',
      location: 'Av. Larco 123, Miraflores'
    }
  ]
  return mockOrders
})

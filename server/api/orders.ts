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
    time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    totalPrice: 90.00,
    tableId: 2,
    tableName: 'Mesa 2'
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
    time: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    totalPrice: 55.00,
    customerName: 'Juan Pérez',
    customerPhone: '987654321',
    customerEmail: 'juan@email.com',
    location: 'Av. Larco 123, Miraflores'
  },
  {
    id: 3,
    code: 'ORD-003',
    status: 'Listo',
    type: 'salon',
    products: [
      { id: 1, name: '1/4 de Pollo a la Brasa', priceUnitary: 18.50, quantity: 4 },
      { id: 6, name: 'Chicha Morada 1L', priceUnitary: 12.00, quantity: 2 }
    ],
    time: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    totalPrice: 98.00,
    tableId: 3,
    tableName: 'Mesa 3'
  },
  {
    id: 4,
    code: 'ORD-004',
    status: 'Pendiente',
    type: 'delivery',
    products: [
      { id: 4, name: 'Parrilla Mixta', priceUnitary: 48.00, quantity: 1 },
      { id: 7, name: 'Gaseosa Personal', priceUnitary: 5.00, quantity: 2 }
    ],
    time: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    totalPrice: 58.00,
    customerName: 'Ana García',
    customerPhone: '912345678',
    location: 'Calle Los Olivos 456, San Borja'
  },
  {
    id: 5,
    code: 'ORD-005',
    status: 'Preparando',
    type: 'salon',
    products: [
      { id: 2, name: '1/2 Pollo a la Brasa', priceUnitary: 35.00, quantity: 2 },
      { id: 5, name: 'Anticuchos de Corazón', priceUnitary: 24.00, quantity: 1 }
    ],
    time: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    totalPrice: 94.00,
    tableId: 5,
    tableName: 'Mesa 5'
  }
]

export default defineEventHandler(async () => {
  return mockOrders
})

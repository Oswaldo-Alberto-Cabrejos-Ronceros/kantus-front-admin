import type { OrderDelivery } from '~/types'

export default defineEventHandler(async () => {
  const mockDeliveries: OrderDelivery[] = [
    {
      id: 1,
      code: 'DEL-001',
      status: 'Pendiente',
      customerName: 'Carlos Mendoza',
      customerPhone: '987654321',
      customerEmail: 'carlos@email.com',
      customerDni: '12345678',
      address: 'Av. Los Faisanes 123, Surquillo',
      totalPrice: 45.00,
      products: [
        { id: 1, name: '1/4 de Pollo a la Brasa', priceUnitary: 18.50, quantity: 2 },
        { id: 7, name: 'Gaseosa Personal', priceUnitary: 5.00, quantity: 1 }
      ],
      time: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      paymentMethod: 'Mercado Pago'
    },
    {
      id: 2,
      code: 'DEL-002',
      status: 'Camino',
      customerName: 'Ana Paredes',
      customerPhone: '912345678',
      customerEmail: 'ana@email.com',
      customerDni: '87654321',
      address: 'Calle Las Camelias 456, San Isidro',
      totalPrice: 85.50,
      products: [
        { id: 2, name: '1/2 Pollo a la Brasa', priceUnitary: 35.00, quantity: 2 },
        { id: 6, name: 'Chicha Morada 1L', priceUnitary: 12.00, quantity: 1 }
      ],
      time: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      paymentMethod: 'Mercado Pago'
    },
    {
      id: 3,
      code: 'DEL-003',
      status: 'Entregado',
      customerName: 'Luis Sánchez',
      customerPhone: '998877665',
      customerEmail: 'luis@email.com',
      customerDni: '11223344',
      address: 'Av. Benavides 789, Miraflores',
      totalPrice: 120.00,
      products: [
        { id: 3, name: 'Pollo a la Brasa Entero', priceUnitary: 65.00, quantity: 1 },
        { id: 4, name: 'Parrilla Mixta', priceUnitary: 48.00, quantity: 1 },
        { id: 7, name: 'Gaseosa Personal', priceUnitary: 5.00, quantity: 2 }
      ],
      time: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      paymentMethod: 'Efectivo'
    }
  ]
  return mockDeliveries
})

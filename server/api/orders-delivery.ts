import type { OrderDelivery } from '~/types'

export default defineEventHandler(async () => {
  const mockDeliveries: OrderDelivery[] = [
    {
      id: 1,
      status: 'Pendiente',
      customerName: 'Carlos Mendoza',
      address: 'Av. Los Faisanes 123, Surquillo',
      totalPrice: 45.00
    },
    {
      id: 2,
      status: 'Camino',
      customerName: 'Ana Paredes',
      address: 'Calle Las Camelias 456, San Isidro',
      totalPrice: 85.50
    },
    {
      id: 3,
      status: 'Entregado',
      customerName: 'Luis Sánchez',
      address: 'Av. Benavides 789, Miraflores',
      totalPrice: 120.00
    }
  ]
  return mockDeliveries
})

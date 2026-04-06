import type { CashBox } from '~/types'

export default defineEventHandler(async () => {
  const mockCashBoxes: CashBox[] = [
    {
      id: 1,
      name: 'Caja Principal',
      openingAmount: 150.00,
      currentBalance: 850.50,
      collectedSales: 700.50,
      openingTime: new Date(new Date().setHours(8, 0, 0)).toISOString(),
      status: 'Abierta'
    },
    {
      id: 2,
      name: 'Caja Secundaria',
      openingAmount: 100.00,
      currentBalance: 100.00,
      collectedSales: 0.00,
      openingTime: new Date(new Date().setHours(10, 30, 0)).toISOString(),
      status: 'Abierta'
    },
    {
      id: 3,
      name: 'Caja Turno Noche',
      openingAmount: 200.00,
      currentBalance: 1250.00,
      collectedSales: 1050.00,
      openingTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      closingTime: new Date(new Date().setHours(6, 0, 0)).toISOString(),
      status: 'Cerrada'
    }
  ]

  return mockCashBoxes
})

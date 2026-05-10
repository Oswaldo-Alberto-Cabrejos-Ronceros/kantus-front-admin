import type { Table } from '~/types'
import { mockOrders } from './orders'

export default defineEventHandler(async () => {
  const mockTables: Table[] = [
    { id: 1, name: 'Mesa 1', occupied: false },
    { id: 2, name: 'Mesa 2', occupied: true, order: mockOrders[0] },
    { id: 3, name: 'Mesa 3', occupied: true, order: mockOrders[1] },
    { id: 4, name: 'Mesa 4', occupied: false },
    { id: 5, name: 'Mesa 5', occupied: false },
    { id: 6, name: 'Mesa 6', occupied: false }
  ]

  return mockTables
})

import type { Table } from '~/types'
import { mockOrders } from './orders'

export const mockTables: Table[] = [
  { id: 1, name: 'Mesa 1', occupied: false, status: true, qrUrl: '/mesa/1/carta' },
  { id: 2, name: 'Mesa 2', occupied: true, status: true, order: mockOrders[0], qrUrl: '/mesa/2/carta' },
  { id: 3, name: 'Mesa 3', occupied: true, status: true, order: mockOrders[2], qrUrl: '/mesa/3/carta' },
  { id: 4, name: 'Mesa 4', occupied: false, status: true, qrUrl: '/mesa/4/carta' },
  { id: 5, name: 'Mesa 5', occupied: true, status: true, order: mockOrders[4], qrUrl: '/mesa/5/carta' },
  { id: 6, name: 'Mesa 6', occupied: false, status: true, qrUrl: '/mesa/6/carta' },
  { id: 7, name: 'Mesa 7', occupied: false, status: true, qrUrl: '/mesa/7/carta' },
  { id: 8, name: 'Mesa 8', occupied: false, status: true, qrUrl: '/mesa/8/carta' }
]

import type { RestaurantTableResponse, RestaurantTableRequest } from '~/api/types.gen'
import type { Table } from '~/types'

export const mapTableResponseToUI = (data: RestaurantTableResponse): Table => ({
  id: data.id || 0,
  name: data.name || '',
  capacity: data.capacity,
  occupied: data.occupied ?? false,
  status: data.status ?? false,
  qrUrl: data.qrUrl || undefined
})

export const mapTableRequestFromUI = (data: Partial<Table>): RestaurantTableRequest => ({
  name: data.name || '',
  capacity: data.capacity || 1   // Backend requiere capacity
})

import type { RestaurantTableResponse, RestaurantTableRequest } from '~/api/types.gen'
import type { Table } from '~/types'

export const mapTableResponseToUI = (data: RestaurantTableResponse): Table => ({
  id: data.id || 0,
  name: data.name || '',
  occupied: data.occupied ?? false,
  status: data.status ?? false,
  qrUrl: data.qrUrl || ''
})

export const mapTableRequestFromUI = (data: Partial<Table>): RestaurantTableRequest => ({
  name: data.name || ''
})

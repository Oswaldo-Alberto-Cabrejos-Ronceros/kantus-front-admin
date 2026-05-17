import type { OrderResponse, OrderRequest, OrderItemResponse, OrderItemRequest } from '~/api/types.gen'
import type { Order, OrderProduct } from '~/types'

export const mapOrderProductResponseToUI = (data: OrderItemResponse): OrderProduct => ({
  id: data.productId || 0,
  name: data.productName || '',
  priceUnitary: data.priceUnitary || 0,
  quantity: data.quantity || 0
})

export const mapOrderProductRequestFromUI = (data: Partial<OrderProduct>): OrderItemRequest => ({
  productId: data.id || 0,
  quantity: data.quantity || 0
})

export const mapOrderResponseToUI = (data: OrderResponse): Order => ({
  id: data.id || 0,
  code: data.code || '',
  status: (data.status ? data.status.charAt(0) + data.status.slice(1).toLowerCase() : 'Pendiente') as any,
  type: (data.type?.toLowerCase() as 'salon' | 'delivery') || 'salon',
  products: (data.items || []).map(mapOrderProductResponseToUI),
  time: data.createdAt || new Date(),
  totalPrice: data.totalPrice || 0,
  location: data.location || '',
  customerName: data.customerName || '',
  customerPhone: data.customerPhone || '',
  customerEmail: data.customerEmail || '',
  customerDni: data.customerDni || '',
  tableId: data.tableId || undefined,
  tableName: data.tableName || '',
  paymentMethod: (data.paymentMethod?.toLowerCase() as any) || undefined
})

export const mapOrderRequestFromUI = (data: Partial<Order>): OrderRequest => ({
  type: data.type === 'delivery' ? 'DELIVERY' : 'SALON',
  tableId: data.tableId,
  customerName: data.customerName,
  customerPhone: data.customerPhone,
  customerEmail: data.customerEmail,
  customerDni: data.customerDni,
  location: data.location,
  paymentMethod: data.paymentMethod?.toUpperCase(),
  items: (data.products || []).map(mapOrderProductRequestFromUI)
})

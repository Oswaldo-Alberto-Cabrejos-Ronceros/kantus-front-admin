import type { OrderResponse, OrderRequest, OrderItemResponse, OrderItemRequest } from '~/api/types.gen'
import type { Order, OrderProduct, OrderStatus, OrderType } from '~/types'

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
  // Backend devuelve MAYÚSCULAS — las usamos directamente
  status: (data.status || 'PENDIENTE') as OrderStatus,
  type: (data.type || 'SALON') as OrderType,
  products: (data.items || []).map(mapOrderProductResponseToUI),
  time: data.createdAt || new Date(),
  totalPrice: data.totalPrice || 0,
  location: data.location || undefined,
  customerName: data.customerName || undefined,
  customerPhone: data.customerPhone || undefined,
  customerEmail: data.customerEmail || undefined,
  customerDni: data.customerDni || undefined,
  tableId: data.tableId || undefined,
  tableName: data.tableName || undefined,
  paymentMethod: data.paymentMethod || undefined
})

export const mapOrderRequestFromUI = (data: Partial<Order>): OrderRequest => ({
  type: data.type || 'SALON',
  tableId: data.tableId,
  customerName: data.customerName,
  customerPhone: data.customerPhone,
  customerEmail: data.customerEmail,
  customerDni: data.customerDni,
  location: data.location,
  paymentMethod: data.paymentMethod,
  items: (data.products || []).map(mapOrderProductRequestFromUI)
})

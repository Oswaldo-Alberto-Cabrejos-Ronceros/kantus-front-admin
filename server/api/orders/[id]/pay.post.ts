import { mockOrders } from '../../orders'
import type { ProcessOrderRequest } from '~/utils/validations'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<ProcessOrderRequest>(event)

  const index = mockOrders.findIndex(o => o.id === id)

  const order = mockOrders[index]

  if (!order) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Order not found'
    })
  }

  order.status = 'Pagado'
  order.paymentMethod = body.paymentMethod
  order.tip = body.tip

  return order
})

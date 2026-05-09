import { defineEventHandler, readBody, createError } from 'h3'
import type { OrderStatus } from '~/types'
import { mockOrders } from '../../orders'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody<{ status: OrderStatus }>(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'El ID de la orden es requerido' })
  }

  if (!body || !body.status) {
    throw createError({ statusCode: 400, statusMessage: 'El nuevo estado de la orden es requerido' })
  }

  const order = mockOrders.find(o => String(o.id) === id)
  if (!order) {
    throw createError({ statusCode: 404, statusMessage: 'Orden no encontrada' })
  }

  order.status = body.status

  return { success: true, order }
})

import { mockTables } from '../tables.state'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  const index = mockTables.findIndex(t => t.id === id)

  const table = mockTables[index]

  if (!table) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Table not found'
    })
  }

  table.status = false

  return { success: true }
})

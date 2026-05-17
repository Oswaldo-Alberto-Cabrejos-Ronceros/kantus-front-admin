import { mockTables } from '../tables.state'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<{ name?: string, status?: boolean }>(event)

  const index = mockTables.findIndex(t => t.id === id)
  const table = mockTables[index]

  if (!table) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Table not found'
    })
  }

  if (body.name !== undefined) table.name = body.name
  if (body.status !== undefined) table.status = body.status

  return table
})

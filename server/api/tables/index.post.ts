import { mockTables } from '../tables.state'
import type { Table } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name: string, status?: boolean }>(event)

  const newId = mockTables.length > 0 ? Math.max(...mockTables.map(t => t.id)) + 1 : 1

  const newTable: Table = {
    id: newId,
    name: body.name,
    occupied: false,
    status: body.status !== undefined ? body.status : true,
    qrUrl: `/mesa/${newId}/carta`
  }

  mockTables.push(newTable)

  return newTable
})

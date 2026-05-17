import type { SaleResponse, SaleRequest } from '~/api/types.gen'
import type { Sale } from '~/types'

export const mapSaleResponseToUI = (data: SaleResponse): Sale => ({
  id: data.id || 0,
  fecha: data.fecha || new Date(),
  codigo: data.codigo || '',
  metodo: (data.metodo?.toLowerCase() as any) || 'efectivo',
  monto: data.monto || 0,
  tipo: undefined // Assuming order type isn't directly on sale response
})

export const mapSaleRequestFromUI = (data: Partial<Sale>, orderId: number): SaleRequest => ({
  orderId: orderId,
  metodo: (data.metodo?.toUpperCase() as any) || 'EFECTIVO'
})

import type { SaleResponse, SaleRequest } from '~/api/types.gen'
import type { Sale, SaleMethod } from '~/types'

export const mapSaleResponseToUI = (data: SaleResponse): Sale => ({
  id: data.id || 0,
  fecha: data.fecha || new Date(),
  codigo: data.codigo || '',
  // Backend ya devuelve en MAYÚSCULAS, los usamos directamente
  metodo: (data.metodo || 'EFECTIVO') as SaleMethod,
  monto: data.monto || 0,
  orderId: data.orderId
})

export const mapSaleRequestFromUI = (data: Partial<Sale>, orderId: number): SaleRequest => ({
  orderId: orderId,
  // Usar directamente en MAYÚSCULAS (SaleMethod ya es uppercase)
  metodo: (data.metodo || 'EFECTIVO') as 'EFECTIVO' | 'TARJETA' | 'YAPE' | 'MERCADO_PAGO'
})

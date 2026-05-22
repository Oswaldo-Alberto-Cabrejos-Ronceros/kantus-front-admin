import type { SaleResponse, SaleRequest } from '~/api/types.gen'
import type { Sale, SaleMethod } from '~/types'

export const mapSaleResponseToUI = (data: SaleResponse): Sale => ({
  id: data.id || 0,
  fecha: data.fecha || new Date(),
  codigo: data.codigo || '',
  metodo: (data.metodo || 'EFECTIVO') as SaleMethod,
  monto: data.monto || 0,
  orderId: data.orderId,
  orderCode: (data as any).orderCode ?? undefined,
  comprobanteId: (data as any).comprobanteId ?? undefined
})

export const mapSaleRequestFromUI = (
  data: Partial<Sale>,
  orderId: number,
  cashBoxId: number,
  amountReceived?: number,
  comprobante?: { tipo: string; clienteNombre: string; clienteDocumento: string }
): SaleRequest => ({
  orderId: orderId,
  cashBoxId: cashBoxId,
  metodo: (data.metodo || 'EFECTIVO') as 'EFECTIVO' | 'TARJETA' | 'YAPE' | 'MERCADO_PAGO',
  // Solo se envía cuando el pago es en efectivo
  amountReceived: amountReceived as unknown as number,
  // Comprobante opcional — backend ignora si es null/undefined
  ...(comprobante ? { comprobante: comprobante as any } : {})
})

import type {
  CashBoxResponse,
  CashBoxRequest,
  MovementCashboxResponse,
  MovementCashboxRequest
} from '~/api/types.gen'
import type { CashBox, MovementCashbox } from '~/types'

// CashBox
export const mapCashBoxResponseToUI = (data: CashBoxResponse): CashBox => ({
  id: data.id || 0,
  name: data.name || '',
  openingAmount: data.openingAmount || 0,
  currentBalance: data.currentBalance || 0,
  collectedSales: data.collectedSales || 0,
  openingTime: data.openingTime || new Date(),
  closingTime: data.closingTime,
  status: (data.status === 'ABIERTA' ? 'Abierta' : 'Cerrada') as any
})

export const mapCashBoxRequestFromUI = (data: Partial<CashBox>): CashBoxRequest => ({
  name: data.name || '',
  openingAmount: data.openingAmount || 0
})

// Movement Cashbox
export const mapMovementCashboxResponseToUI = (data: MovementCashboxResponse): MovementCashbox => ({
  id: data.id || 0,
  dia: data.dia || new Date(),
  hora: data.hora || '',
  codigoPedidos: data.codigoPedidos,
  tipoComprobante: (data.tipoComprobante as any) || undefined,
  descripcion: data.descripcion,
  tipo: (data.tipo === 'INGRESO' ? 'Ingreso' : 'Egreso') as any,
  monto: data.monto || 0
})

export const mapMovementCashboxRequestFromUI = (data: Partial<MovementCashbox>, cashBoxId: number): MovementCashboxRequest => ({
  cashBoxId,
  codigoPedidos: data.codigoPedidos,
  tipoComprobante: data.tipoComprobante,
  descripcion: data.descripcion || '',
  tipo: data.tipo === 'Ingreso' ? 'INGRESO' : 'EGRESO',
  monto: data.monto || 0
})

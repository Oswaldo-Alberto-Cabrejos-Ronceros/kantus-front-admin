import type {
  CashBoxResponse,
  CashBoxRequest,
  MovementCashboxResponse,
  MovementCashboxRequest
} from '~/api/types.gen'
import type { CashBox, CashBoxStatus, MovementCashbox, MovementCashboxType } from '~/types'

// CashBox
export const mapCashBoxResponseToUI = (data: CashBoxResponse): CashBox => ({
  id: data.id || 0,
  name: data.name || '',
  openingAmount: data.openingAmount || 0,
  currentBalance: data.currentBalance || 0,
  collectedSales: data.collectedSales || 0,
  closingAmount: (data as any).closingAmount ?? undefined,
  digitalBalance: (data as any).digitalBalance ?? 0,
  openingTime: data.openingTime || new Date(),
  closingTime: data.closingTime,
  // Backend usa MAYÚSCULAS, el tipo UI ahora también usa MAYÚSCULAS
  status: (data.status || 'CERRADA') as CashBoxStatus,
  employeeId: data.employeeId,
  employeeName: data.employeeName
})

export const mapCashBoxRequestFromUI = (data: Partial<CashBox>): CashBoxRequest => ({
  name: data.name || '',
  openingAmount: data.openingAmount || 0,
  employeeId: (data.employeeId || undefined) as unknown as number
})

// Movement Cashbox
export const mapMovementCashboxResponseToUI = (data: MovementCashboxResponse): MovementCashbox => ({
  id: data.id || 0,
  cashBoxId: data.cashBoxId || 0,
  dia: data.dia || new Date(),
  hora: data.hora || '',
  codigoPedidos: data.codigoPedidos,
  tipoComprobante: data.tipoComprobante,
  metodoPago: (data as any).metodoPago ?? undefined,
  descripcion: data.descripcion || '',
  // Backend usa MAYÚSCULAS, el tipo UI ahora también usa MAYÚSCULAS
  tipo: (data.tipo || 'EGRESO') as MovementCashboxType,
  monto: data.monto || 0
})

export const mapMovementCashboxRequestFromUI = (data: Partial<MovementCashbox>, cashBoxId: number): MovementCashboxRequest => ({
  cashBoxId: data.cashBoxId || cashBoxId,
  codigoPedidos: data.codigoPedidos,
  tipoComprobante: data.tipoComprobante,
  descripcion: data.descripcion || '',
  tipo: (data.tipo || 'EGRESO') as 'INGRESO' | 'EGRESO',
  monto: data.monto || 0
})

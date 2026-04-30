import { defineEventHandler } from 'h3'
import type { MovementCashbox } from '~~/app/types'

export default defineEventHandler(() => {
  const movements: MovementCashbox[] = [
    {
      id: 1,
      dia: '2023-10-25',
      hora: '08:30 AM',
      codigoPedidos: 'PED-001',
      tipoComprobante: 'Boleta',
      descripcion: 'Venta de desayuno mesa 1',
      tipo: 'Ingreso',
      monto: 50.00
    },
    {
      id: 2,
      dia: '2023-10-25',
      hora: '10:00 AM',
      descripcion: 'Pago a proveedor de insumos',
      tipo: 'Egreso',
      monto: 120.00
    }
  ]

  return movements
})

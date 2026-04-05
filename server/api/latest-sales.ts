import type { Sale } from '~/types'

export default defineEventHandler(async () => {
  const sales: Sale[] = [
    { id: 1, fecha: new Date().toISOString(), codigo: 'V-001', metodo: 'efectivo', monto: 150.50 },
    { id: 2, fecha: new Date().toISOString(), codigo: 'V-002', metodo: 'tarjeta', monto: 80.00 },
    { id: 3, fecha: new Date().toISOString(), codigo: 'V-003', metodo: 'yape/plin', monto: 45.00 },
    { id: 4, fecha: new Date().toISOString(), codigo: 'V-004', metodo: 'transferencia', monto: 320.00 },
    { id: 5, fecha: new Date().toISOString(), codigo: 'V-005', metodo: 'efectivo', monto: 20.00 }
  ]
  return sales
})

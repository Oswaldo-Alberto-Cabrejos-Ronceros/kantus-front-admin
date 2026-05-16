import type { Sale } from '~/types'

export default defineEventHandler(async () => {
  const sales: Sale[] = [
    { id: 1, codigo: 'V-1045', fecha: '2026-05-16T14:30:00Z', metodo: 'Efectivo', monto: 145.50 },
    { id: 2, codigo: 'V-1046', fecha: '2026-05-16T15:15:00Z', metodo: 'Tarjeta', monto: 85.00 },
    { id: 3, codigo: 'V-1047', fecha: '2026-05-16T15:45:00Z', metodo: 'Yape', monto: 45.00 },
    { id: 4, codigo: 'V-1048', fecha: '2026-05-16T16:10:00Z', metodo: 'Tarjeta', monto: 210.00 },
    { id: 5, codigo: 'V-1049', fecha: '2026-05-16T16:25:00Z', metodo: 'Efectivo', monto: 35.00 },
  ]
  
  // Add 1s delay to simulate network
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return sales
})

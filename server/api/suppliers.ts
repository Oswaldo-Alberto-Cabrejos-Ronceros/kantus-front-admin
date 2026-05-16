import type { Supplier } from '~/types'

export default defineEventHandler(async () => {
  const suppliers: Supplier[] = [
    { id: 1, nombre: 'Avícola San Fernando', ruc: '20100154308', contacto: 'Pedro Ruiz', email: 'ventas@sanfernando.com', telefono: '01-6198500', estado: true },
    { id: 2, nombre: 'Distribuidora de Bebidas Lima', ruc: '20501234567', contacto: 'María Torres', email: 'pedidos@bebidaslima.pe', telefono: '01-4567890', estado: true },
    { id: 3, nombre: 'Insumos del Sur', ruc: '20607891234', contacto: 'Carlos Vega', email: 'info@insumosdelsur.pe', telefono: '054-234567', estado: false }
  ]
  return suppliers
})

import type { SupplierResponse, SupplierRequest } from '~/api/types.gen'
import type { Supplier } from '~/types'

export const mapSupplierResponseToUI = (data: SupplierResponse): Supplier => ({
  id: data.id || 0,
  nombre: data.nombre || '',
  ruc: data.ruc || '',
  contacto: data.contacto || '',
  email: data.email || '',
  telefono: data.telefono || '',
  estado: data.estado ?? false
})

export const mapSupplierRequestFromUI = (data: Partial<Supplier>): SupplierRequest => ({
  nombre: data.nombre || '',
  ruc: data.ruc || '',
  contacto: data.contacto || '',
  email: data.email || '',
  telefono: data.telefono || ''
})

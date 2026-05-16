import type { ProductInventory } from '~/types'

export default defineEventHandler(async () => {
  const products: ProductInventory[] = [
    { id: 1, name: 'Pollo entero', categoryId: 1, cantidad: 45, stockMinimo: 10, unidad: 'Unidad', fechaVencimiento: '2026-05-20', estado: true, supplierId: 1 },
    { id: 2, name: 'Papas', categoryId: 2, cantidad: 80, stockMinimo: 20, unidad: 'Kilogramo', fechaVencimiento: '2026-05-25', estado: true },
    { id: 3, name: 'Aceite vegetal', categoryId: 3, cantidad: 15, stockMinimo: 5, unidad: 'Litro', fechaVencimiento: '2026-12-01', estado: true },
    { id: 4, name: 'Sal', categoryId: 3, cantidad: 8, stockMinimo: 3, unidad: 'Kilogramo', fechaVencimiento: '2027-06-01', estado: true },
    { id: 5, name: 'Ají amarillo', categoryId: 2, cantidad: 3, stockMinimo: 5, unidad: 'Kilogramo', fechaVencimiento: '2026-05-18', estado: true },
    { id: 6, name: 'Gaseosas 500ml', categoryId: 4, cantidad: 120, stockMinimo: 30, unidad: 'Unidad', fechaVencimiento: '2026-08-15', estado: true, supplierId: 2 },
    { id: 7, name: 'Carbón vegetal', categoryId: 3, cantidad: 25, stockMinimo: 10, unidad: 'Kilogramo', fechaVencimiento: '2027-12-01', estado: true },
    { id: 8, name: 'Chorizos', categoryId: 1, cantidad: 2, stockMinimo: 10, unidad: 'Kilogramo', fechaVencimiento: '2026-05-17', estado: false, supplierId: 1 }
  ]
  return products
})

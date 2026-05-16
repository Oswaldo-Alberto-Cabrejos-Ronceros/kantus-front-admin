import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('El formato del correo no es válido'),

  password: z.string('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export type LoginRequest = z.infer<typeof loginSchema>

// ===== CARTA =====

export const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  status: z.boolean().default(true)
})

export type CategoryRequest = z.infer<typeof categorySchema>

export const productSchema = z.object({
  categoryId: z.number('La categoría es obligatoria'),
  imageUrl: z.string('La imagen es obligatoria').min(1, 'La imagen es obligatoria'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  price: z.number('El precio es obligatorio')
    .positive('El precio debe ser mayor a 0')
})

export type ProductRequest = z.infer<typeof productSchema>

export const discountSchema = z.object({
  tipo: z.enum(['porcentaje', 'precio'], 'El tipo de descuento es obligatorio'),
  cantidad: z.number('La cantidad es obligatoria').positive('La cantidad debe ser mayor a 0')
})

export type DiscountRequest = z.infer<typeof discountSchema>

// ===== INVENTORY =====

export const movementInventorySchema = z.object({
  tipo: z.enum(['entrada', 'salida'], 'El tipo de movimiento es obligatorio'),
  productId: z.number('El producto es obligatorio'),
  cantidad: z.number('La cantidad es obligatoria').positive('La cantidad debe ser mayor a 0'),
  razon: z.string().min(1, 'La razón es obligatoria')
})

export type MovementInventoryRequest = z.infer<typeof movementInventorySchema>

export const productInventorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  categoryId: z.number('La categoría es obligatoria'),
  cantidad: z.number('La cantidad es obligatoria').min(0, 'La cantidad no puede ser negativa'),
  stockMinimo: z.number().min(0, 'El stock mínimo no puede ser negativo').optional(),
  unidad: z.enum(['Unidad', 'Kilogramo', 'Litro', 'Gramo', 'Mililitro'], 'La unidad es obligatoria'),
  fechaVencimiento: z.string().min(1, 'La fecha de vencimiento es obligatoria'),
  estado: z.boolean().default(true),
  supplierId: z.number().optional()
})

export type ProductInventoryRequest = z.infer<typeof productInventorySchema>

export const categoryInventorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  status: z.boolean().default(true)
})

export type CategoryInventoryRequest = z.infer<typeof categoryInventorySchema>

export const supplierSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  ruc: z.string().min(1, 'El RUC es obligatorio'),
  contacto: z.string().min(1, 'El contacto es obligatorio'),
  email: z.email('El formato del correo no es válido'),
  telefono: z.string().min(1, 'El teléfono es obligatorio'),
  estado: z.boolean().default(true)
})

export type SupplierRequest = z.infer<typeof supplierSchema>

// ===== EMPLOYEES =====

export const employeeSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  lastname: z.string().min(1, 'El apellido es obligatorio'),
  documentType: z.enum(['DNI', 'CE'], 'El tipo de documento es obligatorio'),
  documentNumber: z.string().min(1, 'El número de documento es obligatorio'),
  birthdate: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  hoursWeek: z.number('Debe ser un número').positive('Las horas a la semana deben ser mayor a 0'),
  hourlyWage: z.number('Debe ser un número').positive('El salario debe ser mayor a 0'),
  position: z.enum(['Administrative', 'Chef', 'Waiter', 'Cashier', 'Delivery'], 'El puesto es obligatorio'),
  status: z.boolean()
})

export type EmployeeRequest = z.infer<typeof employeeSchema>

export const assignUserSchema = z.object({
  email: z.email('El formato del correo no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['Admin', 'Mozo', 'Cajero', 'Cocinero', 'Delivery'], 'El rol es obligatorio')
})

export type AssignUserRequest = z.infer<typeof assignUserSchema>

// ===== CASHBOX =====

export const openCashboxSchema = z.object({
  openingAmount: z.number({ message: 'Debe ser un número' }).min(0, 'El monto no puede ser negativo')
})
export type OpenCashboxRequest = z.infer<typeof openCashboxSchema>

export const closeCashboxSchema = z.object({
  closingAmount: z.number({ message: 'Debe ser un número' }).min(0, 'El monto no puede ser negativo')
})
export type CloseCashboxRequest = z.infer<typeof closeCashboxSchema>

// ===== ORDERS =====

export const processOrderSchema = z.object({
  orderId: z.number('El ID de la orden es obligatorio'),
  paymentMethod: z.enum(['efectivo', 'transferencia', 'tarjeta', 'yape/plin'], 'El método de pago es obligatorio')
})

export type ProcessOrderRequest = z.infer<typeof processOrderSchema>

export const processDeliveryOrderSchema = z.object({
  orderId: z.number('El ID de la orden es obligatorio'),
  status: z.enum(['Pendiente', 'Camino', 'Entregado'], 'El estado es obligatorio')
})

export type ProcessDeliveryOrderRequest = z.infer<typeof processDeliveryOrderSchema>

export const takeOrderSchema = z.object({
  tableId: z.number('La mesa es obligatoria'),
  products: z.array(z.object({
    productId: z.number(),
    name: z.string(),
    quantity: z.number().positive('La cantidad debe ser mayor a 0'),
    priceUnitary: z.number()
  })).min(1, 'Debe agregar al menos un producto')
})

export type TakeOrderRequest = z.infer<typeof takeOrderSchema>

// ===== DELIVERY CLIENT =====

export const deliveryClientOrderSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  celular: z.string().min(9, 'El celular debe tener al menos 9 dígitos'),
  email: z.email('El formato del correo no es válido'),
  dni: z.string().min(8, 'El DNI debe tener al menos 8 dígitos'),
  direccion: z.string().min(1, 'La dirección es obligatoria'),
  productos: z.array(z.object({
    productId: z.number(),
    name: z.string(),
    quantity: z.number().positive(),
    priceUnitary: z.number()
  })).min(1, 'Debe agregar al menos un producto')
})

export type DeliveryClientOrderRequest = z.infer<typeof deliveryClientOrderSchema>

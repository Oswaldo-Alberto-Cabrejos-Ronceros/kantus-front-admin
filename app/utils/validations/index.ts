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
  description: z.string().min(1, 'La descripción es obligatoria')  // requerido por backend
})

export type CategoryRequest = z.infer<typeof categorySchema>

export const productSchema = z.object({
  categoryId: z.number({ message: 'La categoría es obligatoria' }),
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  price: z.number({ message: 'El precio es obligatorio' })
    .positive('El precio debe ser mayor a 0')
  // imageUrl no se envía al backend, se gestiona por separado si aplica
})

export type ProductRequest = z.infer<typeof productSchema>

export const discountSchema = z.object({
  tipo: z.enum(['porcentaje', 'precio'], { message: 'El tipo de descuento es obligatorio' }),
  cantidad: z.number({ message: 'La cantidad es obligatoria' }).positive('La cantidad debe ser mayor a 0')
})

export type DiscountRequest = z.infer<typeof discountSchema>

// ===== INVENTORY =====

export const movementInventorySchema = z.object({
  tipo: z.enum(['ENTRADA', 'SALIDA'], { message: 'El tipo de movimiento es obligatorio' }),
  productInventoryId: z.number({ message: 'El producto es obligatorio' }),  // era productId
  cantidad: z.number({ message: 'La cantidad es obligatoria' }).positive('La cantidad debe ser mayor a 0'),
  razon: z.string().min(1, 'La razón es obligatoria')
})

export type MovementInventoryRequest = z.infer<typeof movementInventorySchema>

export const productInventorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
  categoryId: z.number({ message: 'La categoría es obligatoria' }),
  unitary: z.string().min(1, 'La unidad es obligatoria'),  // era unidad+enum
})

export type ProductInventoryRequest = z.infer<typeof productInventorySchema>

export const categoryInventorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional()
})

export type CategoryInventoryRequest = z.infer<typeof categoryInventorySchema>

export const supplierSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  ruc: z.string().min(1, 'El RUC es obligatorio'),
  contacto: z.string().min(1, 'El contacto es obligatorio'),
  email: z.email('El formato del correo no es válido'),
  telefono: z.string().min(1, 'El teléfono es obligatorio')
  // estado no lo envía el request (SupplierRequest no lo incluye)
})

export type SupplierRequest = z.infer<typeof supplierSchema>

// ===== EMPLOYEES =====

export const employeeSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  lastname: z.string().min(1, 'El apellido es obligatorio'),
  documentType: z.enum(['DNI', 'CE'], { message: 'El tipo de documento es obligatorio' }),
  documentNumber: z.string()
    .regex(/^\d{8,10}$/, 'El número de documento debe contener entre 8 y 10 dígitos numéricos'),
  position: z.enum(['Administrative', 'Chef', 'Waiter', 'Cashier', 'Delivery'], { message: 'El puesto es obligatorio' }),
  contractType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT'], { message: 'El tipo de contrato es obligatorio' }),
  weeklyHours: z.number({ message: 'Debe ser un número' }).positive('Las horas semanales deben ser mayor a 0'),
  hourlyWage: z.number({ message: 'Debe ser un número' }).positive('El salario debe ser mayor a 0')
})

export type EmployeeRequest = z.infer<typeof employeeSchema>

// Para crear empleado con usuario en un solo request (POST /api/employees/with-user)
export const employeeWithUserSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  lastname: z.string().min(1, 'El apellido es obligatorio'),
  documentType: z.enum(['DNI', 'CE'], { message: 'El tipo de documento es obligatorio' }),
  documentNumber: z.string().min(1, 'El número de documento es obligatorio'),
  position: z.enum(['Administrative', 'Chef', 'Waiter', 'Cashier', 'Delivery'], { message: 'El puesto es obligatorio' }),
  contractType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT'], { message: 'El tipo de contrato es obligatorio' }),
  weeklyHours: z.number({ message: 'Debe ser un número' }).positive(),
  hourlyWage: z.number({ message: 'Debe ser un número' }).positive(),
  user: z.object({
    email: z.email('El formato del correo no es válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['ADMIN', 'MOZO', 'CAJERO', 'COCINERO', 'DELIVERY'], { message: 'El rol es obligatorio' })
  })
})

export type EmployeeWithUserRequest = z.infer<typeof employeeWithUserSchema>

// Para asignar usuario a empleado existente (POST /api/users)
export const assignUserSchema = z.object({
  username: z.string().min(1, 'El username es obligatorio'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  roleId: z.number({ message: 'El rol es obligatorio' }),
  employeeId: z.number({ message: 'El empleado es obligatorio' }),
  status: z.boolean().default(true)
})

export type AssignUserRequest = z.infer<typeof assignUserSchema>

// ===== CASHBOX =====

export const openCashboxSchema = z.object({
  name: z.string().min(1, 'El nombre de la caja es obligatorio'),
  openingAmount: z.number({ message: 'Debe ser un número' }).min(0, 'El monto no puede ser negativo')
})
export type OpenCashboxRequest = z.infer<typeof openCashboxSchema>

export const closeCashboxSchema = z.object({
  closingAmount: z.number({ message: 'Debe ser un número' }).min(0, 'El monto no puede ser negativo')
})
export type CloseCashboxRequest = z.infer<typeof closeCashboxSchema>

export const movementCashboxSchema = z.object({
  cashBoxId: z.number({ message: 'La caja es obligatoria' }),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  tipo: z.enum(['INGRESO', 'EGRESO'], { message: 'El tipo es obligatorio' }),
  monto: z.number({ message: 'Debe ser un número' }).positive('El monto debe ser mayor a 0'),
  codigoPedidos: z.string().optional(),
  tipoComprobante: z.string().optional()
})
export type MovementCashboxRequest = z.infer<typeof movementCashboxSchema>

// ===== ORDERS =====

export const processOrderSchema = z.object({
  orderId: z.number({ message: 'El ID de la orden es obligatorio' }),
  paymentMethod: z.enum(['EFECTIVO', 'TARJETA', 'YAPE', 'MERCADO_PAGO'], { message: 'El método de pago es obligatorio' }),
  tip: z.number().min(0, 'La propina no puede ser negativa').optional()
})

export type ProcessOrderRequest = z.infer<typeof processOrderSchema>

export const processDeliveryOrderSchema = z.object({
  orderId: z.number({ message: 'El ID de la orden es obligatorio' }),
  status: z.enum(['Pendiente', 'Camino', 'Entregado'], { message: 'El estado es obligatorio' })
})

export type ProcessDeliveryOrderRequest = z.infer<typeof processDeliveryOrderSchema>

export const takeOrderSchema = z.object({
  tableId: z.number({ message: 'La mesa es obligatoria' }),
  customerName: z.string().optional(),
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

// ===== TABLES =====

export const tableSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  capacity: z.number({ message: 'La capacidad es obligatoria' }).int().positive('La capacidad debe ser mayor a 0')
})

export type TableRequest = z.infer<typeof tableSchema>

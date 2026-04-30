import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('El formato del correo no es válido'),

  password: z.string('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export type LoginRequest = z.infer<typeof loginSchema>

export const productSchema = z.object({
  categoryId: z.number('La categoría es obligatoria'),
  imageUrl: z.string('La imagen es obligatoria').min(1, 'La imagen es obligatoria'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  price: z.number('El precio es obligatorio')
    .positive('El precio debe ser mayor a 0')
})

export type ProductRequest = z.infer<typeof productSchema>

export const movementInventorySchema = z.object({
  tipo: z.enum(['entrada', 'salida'], 'El tipo de movimiento es obligatorio'),
  productId: z.number('El producto es obligatorio'),
  cantidad: z.number('La cantidad es obligatoria').positive('La cantidad debe ser mayor a 0'),
  razon: z.string().min(1, 'La razón es obligatoria')
})

export type MovementInventoryRequest = z.infer<typeof movementInventorySchema>

export const employeeSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  lastname: z.string().min(1, 'El apellido es obligatorio'),
  documentType: z.enum(['DNI', 'CE'], 'El tipo de documento es obligatorio'),
  documentNumber: z.string().min(1, 'El número de documento es obligatorio'),
  birthdate: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  hoursWeek: z.number('Debe ser un número').positive('Las horas a la semana deben ser mayor a 0'),
  hourlyWage: z.number('Debe ser un número').positive('El salario debe ser mayor a 0'),
  position: z.enum(['Administrative', 'Chef', 'Waiter'], 'El puesto es obligatorio'),
  status: z.boolean()
})

export type EmployeeRequest = z.infer<typeof employeeSchema>

export const openCashboxSchema = z.object({
  openingAmount: z.number({ message: 'Debe ser un número' }).min(0, 'El monto no puede ser negativo')
})
export type OpenCashboxRequest = z.infer<typeof openCashboxSchema>

export const closeCashboxSchema = z.object({
  closingAmount: z.number({ message: 'Debe ser un número' }).min(0, 'El monto no puede ser negativo')
})
export type CloseCashboxRequest = z.infer<typeof closeCashboxSchema>

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

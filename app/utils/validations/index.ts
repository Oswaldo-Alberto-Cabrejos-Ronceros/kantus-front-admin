import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('El formato del correo no es válido'),

  password: z.string('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export type LoginRequest = z.infer<typeof loginSchema>

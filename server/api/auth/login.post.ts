import type { AuthRequest, AuthResponse } from '../../../app/types'

// Mock de usuarios para probar cada rol
const MOCK_USERS: Array<AuthResponse & { email: string, password: string }> = [
  {
    id: 1,
    name: 'Juan',
    lastname: 'Pérez',
    email: 'admin@kantus.com',
    password: 'password123',
    role: 'Admin'
  },
  {
    id: 2,
    name: 'María',
    lastname: 'Gómez',
    email: 'mozo@kantus.com',
    password: 'password123',
    role: 'Mozo'
  },
  {
    id: 3,
    name: 'Carlos',
    lastname: 'López',
    email: 'cajero@kantus.com',
    password: 'password123',
    role: 'Cajero'
  }
]

export default defineEventHandler(async (event) => {
  const body = await readBody<AuthRequest>(event)

  const { email, password } = body

  const user = MOCK_USERS.find(u => u.email === email && u.password === password)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Credenciales inválidas'
    })
  }

  const { email: _email, password: _password, ...authResponse } = user

  return authResponse
})

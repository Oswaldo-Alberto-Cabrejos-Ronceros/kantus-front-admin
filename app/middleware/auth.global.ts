import type { UserRole } from '~/types'

// Route access configuration per role
const ROLE_ROUTES: Record<UserRole, string[]> = {
  Admin: [
    '/',
    '/gestion-carta',
    '/pedidos-cocina',
    '/cajas',
    '/inventario',
    '/ingresos',
    '/empleados'
  ],
  Mozo: [
    '/mozo/mesas',
    '/pedidos-cocina'
  ],
  Cocinero: [
    '/pedidos-cocina'
  ],
  Cajero: [
    '/cajas'
  ],
  Delivery: [
    '/delivery/pedidos'
  ],
  Cliente: [
    '/mesa',
    '/delivery-order'
  ]
}

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/login',
  '/cambio-password',
  '/establecer-password',
  '/mesa',
  '/delivery-order',
  '/payment-success',
  '/payment-failure'
]

function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some(route => decodeURI(path).startsWith(route))
}

function getDefaultRoute(role: UserRole): string {
  switch (role) {
    case 'Admin': return '/'
    case 'Mozo': return '/mozo/mesas'
    case 'Cajero': return '/cajas'
    case 'Cocinero': return '/pedidos-cocina'
    case 'Delivery': return '/delivery/pedidos'
    case 'Cliente': return '/delivery-order'
    default: return '/'
  }
}

function hasRouteAccess(role: UserRole, path: string): boolean {
  const allowedRoutes = ROLE_ROUTES[role] || []
  const decodedPath = decodeURI(path)

  return allowedRoutes.some((route) => {
    if (decodedPath === route) return true
    if (decodedPath.startsWith(route + '/')) return true
    return false
  })
}

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    authStore.initAuth()
  }

  const path = decodeURI(to.path)

  // Allow public routes without authentication
  if (isPublicRoute(path)) {
    // If authenticated and trying to access login, redirect to home
    if (authStore.isAuthenticated && path === '/login') {
      return navigateTo(getDefaultRoute(authStore.user!.role))
    }
    return
  }

  // If not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Check role-based access
  const userRole = authStore.user!.role
  if (!hasRouteAccess(userRole, path)) {
    return navigateTo(getDefaultRoute(userRole))
  }
})

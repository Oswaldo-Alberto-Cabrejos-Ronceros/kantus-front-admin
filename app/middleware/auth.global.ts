const ROLE_ROUTES: Record<string, string[]> = {
  ADMIN: ['/', '/gestion-carta', '/pedidos-cocina', '/cajas', '/inventario', '/ingresos', '/empleados','/mesas'],
  MOZO: ['/mozo/mesas', '/pedidos-cocina'],
  COCINERO: ['/pedidos-cocina'],
  CAJERO: ['/cajas'],
  DELIVERY: ['/delivery/pedidos'],
  CLIENTE: ['/mesa', '/delivery-order']
}

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
  const decodedPath = decodeURI(path)
  return PUBLIC_ROUTES.some(route => {
    if (decodedPath === route) return true
    if (decodedPath.startsWith(route + '/')) return true
    return false
  })
}

// 2. CORREGIDO: Switch evaluado en mayúsculas
function getDefaultRoute(role: string): string {
  const normalizedRole = role.toUpperCase()
  switch (normalizedRole) {
    case 'ADMIN': return '/'
    case 'MOZO': return '/mozo/mesas'
    case 'CAJERO': return '/cajas'
    case 'COCINERO': return '/pedidos-cocina'
    case 'DELIVERY': return '/delivery/pedidos'
    case 'CLIENTE': return '/delivery-order'
    default: return '/'
  }
}

function hasRouteAccess(role: string, path: string): boolean {
  const allowedRoutes = ROLE_ROUTES[role.toUpperCase()] || []
  const decodedPath = decodeURI(path)

  return allowedRoutes.some((route) => {
    if (decodedPath === route) return true
    if (decodedPath.startsWith(route + '/')) return true
    return false
  })
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const path = decodeURI(to.path)
  const fromPath = decodeURI(from.path)

  let isLogged = authStore.isAuthenticated

  if (!isLogged) {
    const success = await authStore.initAuth()
    isLogged = success || authStore.isAuthenticated
  }

  if (isPublicRoute(path)) {
    if (isLogged && path === '/login') {
      const userRole = authStore.user?.role
      if (userRole) {
        const homeRoute = getDefaultRoute(userRole)
        if (fromPath === homeRoute) return
        return navigateTo(homeRoute)
      }
    }
    return
  }

  if (!isLogged) {
    if (path === '/login') return
    return navigateTo('/login')
  }

  const userRole = authStore.user?.role
  
  if (!userRole) {
    return navigateTo('/login')
  }
  if (!hasRouteAccess(userRole, path)) {
    const targetRoute = getDefaultRoute(userRole)
    
    if (path === targetRoute || fromPath === targetRoute) {
      return
    }
    return navigateTo(targetRoute)
  }
})
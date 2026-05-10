export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    authStore.initAuth()
  }

  const publicRoutes = ['/login', '/cambio-password', '/establecer-password']
  const isPublicRoute = publicRoutes.includes(decodeURI(to.path))

  if (!authStore.isAuthenticated) {
    if (!isPublicRoute) {
      return navigateTo('/login')
    }
    return
  }

  if (isPublicRoute) {
    return navigateTo('/')
  }
})

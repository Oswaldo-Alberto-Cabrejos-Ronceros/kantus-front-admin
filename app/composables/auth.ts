import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { login as apiLogin } from '~/api/sdk.gen'
import { useAuthStore } from '~/stores/auth'
import type { AuthRequest, AuthResponse, BackendUserRole, UserRole } from '~/types'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  // Computed properties for role checks
  const isAdmin = computed(() => authStore.user?.role === 'ADMIN')
  const isMozo = computed(() => authStore.user?.role === 'MOZO')
  const isCajero = computed(() => authStore.user?.role === 'CAJERO')
  const isCocinero = computed(() => authStore.user?.role === 'COCINERO')
  const isDelivery = computed(() => authStore.user?.role === 'DELIVERY')

  // Helper to check if user has a specific role
  const hasRole = (role: BackendUserRole) => computed(() => authStore.user?.role === role)

  // Helper to check if user has any of the given roles
  const hasAnyRole = (...roles: BackendUserRole[]) => computed(() => {
    return roles.includes(authStore.user?.role as BackendUserRole)
  })

  // User display name
  const displayName = computed(() => {
    if (!authStore.user) return 'Usuario'
    return `${authStore.user.name} ${authStore.user.lastname}`
  })

  // User initials for avatar
  const initials = computed(() => {
    if (!authStore.user) return 'U'
    return `${authStore.user.name.charAt(0)}${authStore.user.lastname.charAt(0)}`
  })

  const useLogin = () => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: async (credentials: AuthRequest) => {
        const res = await apiLogin({ body: { email: credentials.email, password: credentials.password } as any })
        if (res.error) throw res.error
        return res.data as unknown as AuthResponse
      },
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ['user'] })
        authStore.setAuth(response)

        switch (response.role) {
          case 'ADMIN':
            router.push('/')
            break
          case 'MOZO':
            router.push('/mozo/mesas')
            break
          case 'CAJERO':
            router.push('/cajas')
            break
          case 'COCINERO':
            router.push('/pedidos-cocina')
            break
          case 'DELIVERY':
            router.push('/delivery/pedidos')
            break
          default:
            router.push('/')
        }
      },
      onError: () => {
        authStore.clearAuth()
      }
    })
  }

  const useLogout = () => {
    authStore.clearAuth()
    router.push('/login')
  }

  return {
    useLogin,
    user,
    isAuthenticated,
    isAdmin,
    isMozo,
    isCajero,
    isCocinero,
    isDelivery,
    hasRole,
    hasAnyRole,
    displayName,
    initials,
    useLogout
  }
}

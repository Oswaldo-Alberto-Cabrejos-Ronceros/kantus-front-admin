import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { login as apiLogin } from '~/api/sdk.gen'
import { useAuthStore } from '~/stores/auth'
import type { AuthRequest, AuthResponse, UserRole } from '~/types'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  // Computed properties for role checks
  const isAdmin = computed(() => authStore.user?.role === 'Admin')
  const isMozo = computed(() => authStore.user?.role === 'Mozo')
  const isCajero = computed(() => authStore.user?.role === 'Cajero')
  const isCocinero = computed(() => authStore.user?.role === 'Cocinero')
  const isDelivery = computed(() => authStore.user?.role === 'Delivery')
  const isCliente = computed(() => authStore.user?.role === 'Cliente')

  // Helper to check if user has a specific role
  const hasRole = (role: UserRole) => computed(() => authStore.user?.role === role)

  // Helper to check if user has any of the given roles
  const hasAnyRole = (...roles: UserRole[]) => computed(() => {
    return roles.includes(authStore.user?.role as UserRole)
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
          case 'Admin':
            router.push('/')
            break
          case 'Mozo':
            router.push('/mozo/mesas')
            break
          case 'Cajero':
            router.push('/cajas')
            break
          case 'Cocinero':
            router.push('/pedidos-cocina')
            break
          case 'Delivery':
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
    isCliente,
    hasRole,
    hasAnyRole,
    displayName,
    initials,
    useLogout
  }
}

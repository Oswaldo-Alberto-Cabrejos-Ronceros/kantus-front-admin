import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useAuthStore } from '~/stores/auth'
import type { AuthRequest, AuthResponse } from '~/types'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  // Computed properties útiles para validar el rol en la interfaz
  const isAdmin = computed(() => authStore.user?.role === 'Admin')
  const isMozo = computed(() => authStore.user?.role === 'Mozo')
  const isCajero = computed(() => authStore.user?.role === 'Cajero')
  const isCocinero = computed(() => authStore.user?.role === 'Cocinero')
  const isDelivery = computed(() => authStore.user?.role === 'Delivery')

  const useLogin = () => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: async (credentials: AuthRequest) => {
        return await $fetch<AuthResponse>('/api/auth/login', {
          method: 'POST',
          body: credentials
        })
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

  return {
    useLogin,
    user,
    isAuthenticated,
    isAdmin,
    isMozo,
    isCajero,
    isCocinero,
    isDelivery
  }
}

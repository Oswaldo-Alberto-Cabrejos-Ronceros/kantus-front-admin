import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthResponse } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<null | AuthResponse>(null)

  const isAuthenticated = computed(() => !!user.value)

  const setAuth = (userData: AuthResponse) => {
    user.value = userData
    sessionStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const clearAuth = () => {
    user.value = null
    sessionStorage.removeItem('auth_user')
  }

  const initAuth = () => {
    const storedUser = sessionStorage.getItem('auth_user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  }

  return {
    user,
    isAuthenticated,
    setAuth,
    clearAuth,
    initAuth
  }
})

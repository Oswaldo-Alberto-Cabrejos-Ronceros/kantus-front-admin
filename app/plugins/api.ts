import { defineNuxtPlugin, navigateTo } from '#app'
// import { client } from '~/api/client.gen'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  /* client.setConfig({
    baseURL: config.public.apiBaseUrl as string || 'http://localhost:8080/api/v1',
    withCredentials: true
  })

  client.instance.defaults.withCredentials = true

  client.instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response?.status === 401) {
        console.warn('Sesión expirada o no autorizada. Redirigiendo al login...')

        navigateTo('/login')
      }

      return Promise.reject(error)
    }
  ) */
})

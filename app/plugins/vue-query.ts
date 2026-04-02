import { defineNuxtPlugin } from '#app'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 3
      }
    }
  })
  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
})

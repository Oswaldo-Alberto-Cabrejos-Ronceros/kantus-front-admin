<script setup lang="ts">
import { es } from '@nuxt/ui/locale'

const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#1b1718' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap' }
  ],
  htmlAttrs: {
    lang: 'es'
  }
})

const title = 'Kantus - Pollería & Restaurante'
const description = 'Sistema de gestión integral para Kantus Pollería. Administra pedidos, carta, inventario, delivery y más desde un solo lugar.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

const authStore = useAuthStore()
authStore.initAuth()

</script>

<template>
  <UApp :locale="es">
    <NuxtLoadingIndicator color="#f59e0b" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

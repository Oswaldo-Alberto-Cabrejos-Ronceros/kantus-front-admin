<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 p-4 gradient-hero">
    <UColorModeButton class="absolute top-4 right-4" />

    <div class="w-full max-w-md animate-fade-in-up">
      <!-- Logo -->
      <div class="flex flex-col items-center mb-8">
        <div class="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/20 mb-4">
          <span class="text-white font-black text-3xl">K</span>
        </div>
        <h1 class="text-2xl font-bold text-highlighted">Kantus Pollería</h1>
        <p class="text-sm text-muted mt-1">Sistema de Gestión</p>
      </div>

      <UPageCard class="w-full">
        <UAuthForm
          :schema="loginSchema"
          title="Inicio de sesión"
          description="Ingrese sus credenciales para acceder"
          icon="i-lucide-lock"
          :fields="fields"
          :loading="isPending"
          @submit="onSubmit"
        />
      </UPageCard>

      <!-- Demo credentials hint -->
      <div class="mt-4 text-center">
        <p class="text-xs text-muted">Demo: admin@kantus.com / password123</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import type { AuthRequest } from '~/types'
import { loginSchema } from '~/utils/validations'

definePageMeta({
  layout: false
})

const toast = useToast()
const { useLogin } = useAuth()

const { mutate: login, isPending } = useLogin()

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: 'Correo electrónico',
  placeholder: 'Ingrese su correo',
  required: true
}, {
  name: 'password',
  label: 'Contraseña',
  type: 'password',
  placeholder: 'Ingrese su contraseña',
  required: true
}]

async function onSubmit(payload: FormSubmitEvent<AuthRequest>) {
  login(payload.data, {
    onSuccess() {
      toast.add({
        title: '¡Bienvenido!',
        description: 'Inicio de sesión exitoso.',
        color: 'success'
      })
    },
    onError(error) {
      console.log(error)
      toast.add({
        title: 'Error al iniciar sesión',
        description: 'Credenciales inválidas. Por favor, verifique e intente nuevamente',
        color: 'error'
      })
    }
  })
}
</script>

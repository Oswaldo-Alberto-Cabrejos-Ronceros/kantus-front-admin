<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
    <UColorModeButton class="absolute top-2 right-2" />
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="loginSchema"
        title="Inicio de sesión"
        description="Ingrese sus credenciales"
        icon="i-lucide-user"
        :fields="fields"
        :loading="isPending"
        @submit="onSubmit"
      />
    </UPageCard>
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

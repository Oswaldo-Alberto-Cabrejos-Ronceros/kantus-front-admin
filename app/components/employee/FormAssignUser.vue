<template>
  <UForm :schema="assignUserSchema" :state="state" class="space-y-4" @submit="onSubmit">
    <div class="bg-elevated/50 p-3 rounded-lg mb-2">
      <p class="text-sm text-muted">Asignar usuario del sistema a: <span class="font-semibold text-highlighted">{{ employeeName }}</span></p>
    </div>
    <UFormField label="Correo Electrónico" name="email">
      <UInput v-model="state.email" type="email" placeholder="correo@kantus.com" class="w-full" />
    </UFormField>
    <UFormField label="Contraseña" name="password">
      <UInput v-model="state.password" type="password" placeholder="Mínimo 6 caracteres" class="w-full" />
    </UFormField>
    <UFormField label="Rol del Sistema" name="role">
      <USelect v-model="state.role" :options="roles" class="w-full" />
    </UFormField>
    <div class="flex justify-end gap-2 mt-4">
      <UButton color="neutral" variant="ghost" @click="$emit('cancel')">Cancelar</UButton>
      <UButton type="submit" color="primary" :loading="loading" icon="i-lucide-user-plus">Asignar Usuario</UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { assignUserSchema, type AssignUserRequest } from '~/utils/validations'

defineProps<{ loading?: boolean, employeeName: string, employeeId: number | string }>()

const emit = defineEmits<{ submit: [data: AssignUserRequest], cancel: [] }>()

const roles = ['Admin', 'Mozo', 'Cajero', 'Cocinero', 'Delivery']

const state = reactive<Partial<AssignUserRequest>>({ email: '', password: '', role: 'Mozo' })

async function onSubmit(event: FormSubmitEvent<AssignUserRequest>) { emit('submit', event.data) }
</script>

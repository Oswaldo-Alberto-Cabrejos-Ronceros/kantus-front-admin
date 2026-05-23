<template>
  <UForm
    :schema="assignUserSchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <div class="bg-elevated/50 p-3 rounded-lg mb-2">
      <p class="text-sm text-muted">
        Asignar usuario del sistema a: <span class="font-semibold text-highlighted">{{ employeeName }}</span>
      </p>
    </div>

    <UFormField label="Username / Email" name="username">
      <UInput
        v-model="state.username"
        placeholder="ej. juan.perez"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Contraseña" name="password">
      <UInput
        v-model="state.password"
        type="password"
        placeholder="Mínimo 6 caracteres"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Rol del Sistema" name="roleId">
      <USelect v-model="state.roleId" :items="roleOptions" value-key="value" label-key="label" class="w-full" />
    </UFormField>

    <div class="flex justify-end gap-2 mt-4">
      <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
        Cancelar
      </UButton>
      <UButton
        type="submit"
        color="primary"
        :loading="loading"
        icon="i-lucide-user-plus"
      >
        Asignar Usuario
      </UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { assignUserSchema, type AssignUserRequest } from '~/utils/validations'

const props = defineProps<{ loading?: boolean, employeeName: string, employeeId: number | string }>()

const emit = defineEmits<{ submit: [data: AssignUserRequest], cancel: [] }>()

// roleId mapea a: 1=ADMIN, 2=MOZO, 3=CAJERO, 4=COCINERO, 5=DELIVERY (ajustar según tu BD)
const roleOptions = [
  { label: 'Mozo', value: 2 },
  { label: 'Cajero', value: 3 },
  { label: 'Cocinero', value: 4 },
  { label: 'Delivery', value: 5 },
  { label: 'Admin', value: 1 }
]

const state = reactive<Partial<AssignUserRequest>>({
  username: '',
  password: '',
  roleId: 2,
  employeeId: Number(props.employeeId),
  status: true
})

async function onSubmit(event: FormSubmitEvent<AssignUserRequest>) {
  emit('submit', { ...event.data, employeeId: Number(props.employeeId) })
}
</script>

<template>
  <UForm
    :schema="employeeWithUserSchema"
    :state="state"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Nombres" name="name">
        <UInput v-model="state.name" placeholder="Ej. Juan" class="w-full" />
      </UFormField>
      <UFormField label="Apellidos" name="lastname">
        <UInput v-model="state.lastname" placeholder="Ej. Pérez" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Tipo de Doc." name="documentType">
        <USelect v-model="state.documentType" :items="['DNI', 'CE']" class="w-full" />
      </UFormField>
      <UFormField label="Número de Doc." name="documentNumber">
        <UInput v-model="state.documentNumber" placeholder="Número" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Tipo de Contrato" name="contractType" class="col-span-2">
        <USelect v-model="state.contractType" :items="contractTypeOptions" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Horas semanales" name="weeklyHours">
        <UInput
          v-model.number="state.weeklyHours"
          type="number"
          placeholder="40"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Salario/hora (S/)" name="hourlyWage">
        <UInput
          v-model.number="state.hourlyWage"
          type="number"
          placeholder="15"
          class="w-full"
        />
      </UFormField>
    </div>

    <div class="border-t border-default pt-4 mt-2 space-y-4">
      <h3 class="text-sm font-semibold text-highlighted">Datos de Usuario de Sistema</h3>
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Correo Electrónico" name="user.email">
          <UInput v-model="state.user.email" type="email" placeholder="correo@restaurante.com" class="w-full" />
        </UFormField>
        <UFormField label="Contraseña" name="user.password">
          <UInput v-model="state.user.password" type="password" placeholder="Contraseña de acceso" class="w-full" />
        </UFormField>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Rol de Sistema" name="user.role">
          <USelect v-model="state.user.role" :items="roleOptions" class="w-full" />
        </UFormField>
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-4">
      <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
        Cancelar
      </UButton>
      <UButton type="submit" color="primary" :loading="loading">
        Guardar Empleado y Usuario
      </UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { employeeWithUserSchema } from '~/utils/validations'
import type { EmployeeWithUserRequest } from '~/utils/validations'

defineProps<{ loading?: boolean }>()
const emit = defineEmits<{
  (e: 'submit', data: EmployeeWithUserRequest): void
  (e: 'cancel'): void
}>()

const contractTypeOptions = [
  { label: 'Tiempo Completo', value: 'FULL_TIME' },
  { label: 'Medio Tiempo', value: 'PART_TIME' },
  { label: 'Por Contrato', value: 'CONTRACT' }
]

const roleOptions = [
  { label: 'Administrador', value: 'ADMIN' },
  { label: 'Mozo', value: 'MOZO' },
  { label: 'Cajero', value: 'CAJERO' },
  { label: 'Cocinero', value: 'COCINERO' },
  { label: 'Repartidor', value: 'DELIVERY' }
]

interface FormState {
  name: string
  lastname: string
  documentType: 'DNI' | 'CE'
  documentNumber: string
  position: 'Administrative' | 'Chef' | 'Waiter' | 'Cashier' | 'Delivery'
  contractType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT'
  weeklyHours: number
  hourlyWage: number
  user: {
    email: string
    password: string
    role: 'ADMIN' | 'MOZO' | 'CAJERO' | 'COCINERO' | 'DELIVERY'
  }
}

const state = reactive<FormState>({
  name: '',
  lastname: '',
  documentType: 'DNI',
  documentNumber: '',
  position: 'Waiter',
  contractType: 'FULL_TIME',
  weeklyHours: 40,
  hourlyWage: 0,
  user: {
    email: '',
    password: '',
    role: 'MOZO'
  }
})

// Auto-map user role to employee position
watch(() => state.user.role, (newRole) => {
  const roleToPosition: Record<string, 'Administrative' | 'Chef' | 'Waiter' | 'Cashier' | 'Delivery'> = {
    ADMIN: 'Administrative',
    MOZO: 'Waiter',
    CAJERO: 'Cashier',
    COCINERO: 'Chef',
    DELIVERY: 'Delivery'
  }
  state.position = roleToPosition[newRole] || 'Waiter'
}, { immediate: true })

async function onSubmit(event: FormSubmitEvent<EmployeeWithUserRequest>) {
  emit('submit', event.data)
}
</script>

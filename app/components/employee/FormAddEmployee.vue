<template>
  <UForm
    :schema="employeeSchema"
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
        <USelect v-model="state.documentType" :options="['DNI', 'CE']" class="w-full" />
      </UFormField>
      <UFormField label="Número de Doc." name="documentNumber">
        <UInput v-model="state.documentNumber" placeholder="Número de documento" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Fecha de Nacimiento" name="birthdate">
        <UInput v-model="state.birthdate" type="date" class="w-full" />
      </UFormField>
      <UFormField label="Puesto" name="position">
        <USelect v-model="state.position" :options="['Administrative', 'Chef', 'Waiter']" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Horas a la semana" name="hoursWeek">
        <UInput
          v-model.number="state.hoursWeek"
          type="number"
          placeholder="Ej. 48"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Salario por hora" name="hourlyWage">
        <UInput
          v-model.number="state.hourlyWage"
          type="number"
          placeholder="Ej. 15"
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField label="Estado" name="status">
      <USwitch v-model="state.status" />
      <span class="ml-2 align-middle text-sm">{{ state.status ? 'Activo' : 'Inactivo' }}</span>
    </UFormField>

    <div class="flex justify-end gap-3 mt-4">
      <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
        Cancelar
      </UButton>
      <UButton type="submit" color="primary" :loading="loading">
        Guardar Empleado
      </UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { employeeSchema, type EmployeeRequest } from '~/utils/validations'

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: EmployeeRequest): void
  (e: 'cancel'): void
}>()

const state = reactive<Partial<EmployeeRequest>>({
  name: '',
  lastname: '',
  documentType: 'DNI',
  documentNumber: '',
  birthdate: '',
  hoursWeek: 0,
  hourlyWage: 0,
  position: 'Administrative',
  status: true
})

async function onSubmit(event: FormSubmitEvent<EmployeeRequest>) {
  emit('submit', event.data)
}
</script>

<style>

</style>

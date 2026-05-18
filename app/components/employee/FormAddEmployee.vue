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
        <USelect v-model="state.documentType" :items="['DNI', 'CE']" class="w-full" />
      </UFormField>
      <UFormField label="Número de Doc." name="documentNumber">
        <UInput v-model="state.documentNumber" placeholder="Número" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Puesto" name="position">
        <USelect v-model="state.position" :items="positionOptions" class="w-full" />
      </UFormField>
      <UFormField label="Tipo de Contrato" name="contractType">
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

defineProps<{ loading?: boolean }>()
const emit = defineEmits<{ (e: 'submit', data: EmployeeRequest): void, (e: 'cancel'): void }>()

const positionOptions = ['Administrative', 'Chef', 'Waiter', 'Cashier', 'Delivery']
const contractTypeOptions = [
  { label: 'Tiempo Completo', value: 'FULL_TIME' },
  { label: 'Medio Tiempo', value: 'PART_TIME' },
  { label: 'Por Contrato', value: 'CONTRACT' }
]

const state = reactive<Partial<EmployeeRequest>>({
  name: '',
  lastname: '',
  documentType: 'DNI',
  documentNumber: '',
  position: 'Administrative',
  contractType: 'FULL_TIME',
  weeklyHours: 40,
  hourlyWage: 0
})

async function onSubmit(event: FormSubmitEvent<EmployeeRequest>) { emit('submit', event.data) }
</script>

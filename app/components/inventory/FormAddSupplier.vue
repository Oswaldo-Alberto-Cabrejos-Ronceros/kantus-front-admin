<template>
  <UForm
    :schema="supplierSchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField label="Nombre / Razón Social" name="nombre">
      <UInput v-model="state.nombre" placeholder="Ej. Avícola San Fernando" class="w-full" />
    </UFormField>
    <div class="grid grid-cols-2 gap-4">
      <UFormField label="RUC" name="ruc">
        <UInput v-model="state.ruc" placeholder="20XXXXXXXXX" class="w-full" />
      </UFormField>
      <UFormField label="Contacto" name="contacto">
        <UInput v-model="state.contacto" placeholder="Nombre del contacto" class="w-full" />
      </UFormField>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Email" name="email">
        <UInput
          v-model="state.email"
          type="email"
          placeholder="correo@ejemplo.com"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Teléfono" name="telefono">
        <UInput v-model="state.telefono" placeholder="01-XXXXXXX" class="w-full" />
      </UFormField>
    </div>
    <!-- estado no es parte de SupplierRequest, el backend lo gestiona internamente -->
    <div class="flex justify-end gap-2 mt-4">
      <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
        Cancelar
      </UButton>
      <UButton type="submit" :loading="loading">
        Guardar
      </UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { supplierSchema, type SupplierRequest } from '~/utils/validations'

defineProps<{ loading?: boolean }>()
const emit = defineEmits<{ submit: [data: SupplierRequest], cancel: [] }>()

// SupplierRequest: { nombre, ruc, contacto, email, telefono } — sin estado
const state = reactive<Partial<SupplierRequest>>({
  nombre: '', ruc: '', contacto: '', email: '', telefono: ''
})

async function onSubmit(event: FormSubmitEvent<SupplierRequest>) { emit('submit', event.data) }
</script>

<template>
  <UForm
    :schema="categoryInventorySchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField label="Nombre de la Categoría" name="name">
      <UInput v-model="state.name" placeholder="Ej. Carnes y Aves" class="w-full" />
    </UFormField>
    <UFormField label="Estado" name="status">
      <div class="flex items-center gap-3">
        <USwitch v-model="state.status" />
        <span class="text-sm">{{ state.status ? 'Activa' : 'Inactiva' }}</span>
      </div>
    </UFormField>
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
import { categoryInventorySchema, type CategoryInventoryRequest } from '~/utils/validations'

defineProps<{ loading?: boolean }>()

const emit = defineEmits<{ submit: [data: CategoryInventoryRequest], cancel: [] }>()

const state = reactive<Partial<CategoryInventoryRequest>>({ name: '', status: true })

async function onSubmit(event: FormSubmitEvent<CategoryInventoryRequest>) { emit('submit', event.data) }
</script>

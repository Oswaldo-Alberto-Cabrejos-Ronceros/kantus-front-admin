<template>
  <UForm
    :schema="categorySchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField label="Nombre de la Categoría" name="name">
      <UInput
        v-model="state.name"
        placeholder="Ej. Pollo a la Brasa"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Descripción" name="description">
      <UInput
        v-model="state.description"
        placeholder="Ej. Platos a base de pollo a la brasa"
        class="w-full"
      />
    </UFormField>

    <div class="flex justify-end gap-2 mt-4">
      <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
        Cancelar
      </UButton>
      <UButton type="submit" :loading="loading">
        {{ initialData ? 'Actualizar' : 'Crear' }} Categoría
      </UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Category } from '~/types'
import { categorySchema, type CategoryRequest } from '~/utils/validations'

const props = defineProps<{
  loading?: boolean
  initialData?: Category
}>()

const emit = defineEmits<{
  submit: [data: CategoryRequest]
  edit: [id: number, data: CategoryRequest]
  cancel: []
}>()

const state = reactive<Partial<CategoryRequest>>({
  name: props.initialData?.name || '',
  description: props.initialData?.description || ''
})

watch(() => props.initialData, (newData) => {
  if (newData) {
    state.name = newData.name
    state.description = newData.description || ''
  } else {
    state.name = ''
    state.description = ''
  }
})

async function onSubmit(event: FormSubmitEvent<CategoryRequest>) {
  if (props.initialData?.id) {
    emit('edit', props.initialData.id, event.data)
  } else {
    emit('submit', event.data)
  }
}
</script>

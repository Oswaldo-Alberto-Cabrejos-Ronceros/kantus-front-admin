<template>
  <UForm
    :schema="tableSchema"
    :state="state"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <UFormField label="Nombre de la Mesa" name="name">
      <UInput v-model="state.name" placeholder="Ej. Mesa 1" icon="i-lucide-armchair" class="w-full" />
    </UFormField>

    <UFormField label="Estado" name="status">
      <USwitch v-model="state.status" />
      <span class="ml-2 text-sm text-muted">{{ state.status ? 'Activa' : 'Inactiva' }}</span>
    </UFormField>

    <div class="flex justify-end gap-3 mt-4">
      <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
        Cancelar
      </UButton>
      <UButton type="submit" color="primary" :loading="loading">
        Guardar
      </UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { tableSchema, type TableRequest } from '~/utils/validations'
import type { Table } from '~/types'

const props = defineProps<{
  loading?: boolean
  initialData?: Table | null
}>()

const emit = defineEmits<{
  submit: [data: TableRequest]
  cancel: []
}>()

const state = reactive<TableRequest>({
  name: '',
  status: true
})

watch(() => props.initialData, (newData) => {
  if (newData) {
    state.name = newData.name
    state.status = newData.status !== undefined ? newData.status : true
  } else {
    state.name = ''
    state.status = true
  }
}, { immediate: true })

async function onSubmit(event: FormSubmitEvent<TableRequest>) {
  emit('submit', event.data)
}
</script>

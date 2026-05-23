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

    <UFormField label="Capacidad (personas)" name="capacity">
      <UInput
        v-model.number="state.capacity"
        type="number"
        placeholder="4"
        icon="i-lucide-users"
        class="w-full"
      />
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
  capacity: 4
})

watch(() => props.initialData, (newData) => {
  if (newData) {
    state.name = newData.name
    state.capacity = newData.capacity || 4
  } else {
    state.name = ''
    state.capacity = 4
  }
}, { immediate: true })

async function onSubmit(event: FormSubmitEvent<TableRequest>) {
  emit('submit', event.data)
}
</script>

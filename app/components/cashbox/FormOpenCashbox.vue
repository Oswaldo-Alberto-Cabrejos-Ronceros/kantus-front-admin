<template>
  <UForm
    :schema="openCashboxSchema"
    :state="state"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <UFormField label="Monto de Apertura (S/)" name="openingAmount">
      <UInput
        v-model.number="state.openingAmount"
        type="number"
        placeholder="Ej. 100.00"
        class="w-full"
      />
    </UFormField>

    <div class="flex justify-end gap-3 mt-4">
      <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
        Cancelar
      </UButton>
      <UButton type="submit" color="primary" :loading="loading">
        Abrir Caja
      </UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { openCashboxSchema, type OpenCashboxRequest } from '~/utils/validations'

defineProps<{ loading?: boolean }>()
const emit = defineEmits<{ (e: 'submit', data: OpenCashboxRequest): void, (e: 'cancel'): void }>()

const state = reactive<Partial<OpenCashboxRequest>>({ openingAmount: 0 })

async function onSubmit(event: FormSubmitEvent<OpenCashboxRequest>) {
  emit('submit', event.data)
}
</script>

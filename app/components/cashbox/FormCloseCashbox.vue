<template>
  <UForm
    :schema="closeCashboxSchema"
    :state="state"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <UFormField label="Monto de Cierre (S/)" name="closingAmount">
      <UInput
        v-model.number="state.closingAmount"
        type="number"
        placeholder="Ej. 500.00"
        class="w-full"
      />
    </UFormField>

    <div class="flex justify-end gap-3 mt-4">
      <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
        Cancelar
      </UButton>
      <UButton type="submit" color="primary" :loading="loading">
        Cerrar Caja
      </UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { closeCashboxSchema, type CloseCashboxRequest } from '~/utils/validations'

defineProps<{ loading?: boolean }>()
const emit = defineEmits<{ (e: 'submit', data: CloseCashboxRequest): void, (e: 'cancel'): void }>()

const state = reactive<Partial<CloseCashboxRequest>>({ closingAmount: 0 })

async function onSubmit(event: FormSubmitEvent<CloseCashboxRequest>) {
  emit('submit', event.data)
}
</script>

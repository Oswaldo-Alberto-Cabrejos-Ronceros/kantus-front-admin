<template>
  <UForm
    :schema="openCashboxAmountSchema"
    :state="state"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <!-- Nombre auto-generado (solo informativo) -->
    <div class="flex items-center gap-3 rounded-lg border border-default bg-elevated/40 px-4 py-3">
      <UIcon name="i-lucide-cash-register" class="w-5 h-5 text-primary shrink-0" />
      <div class="flex flex-col">
        <span class="text-xs text-muted uppercase tracking-wide">Nombre de la caja</span>
        <span class="font-semibold text-highlighted">{{ cashboxName }}</span>
      </div>
    </div>

    <UFormField label="Monto de Apertura (S/)" name="openingAmount" hint="Dinero inicial para dar vuelto">
      <UInput
        v-model.number="state.openingAmount"
        type="number"
        min="0.01"
        step="0.50"
        placeholder="Ej. 100.00"
        icon="i-lucide-coins"
        class="w-full"
      />
    </UFormField>

    <div class="flex justify-end gap-3 mt-2">
      <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
        Cancelar
      </UButton>
      <UButton type="submit" color="primary" :loading="loading" icon="i-lucide-unlock">
        Abrir Caja
      </UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { openCashboxAmountSchema, type OpenCashboxAmountRequest } from '~/utils/validations'

defineProps<{
  loading?: boolean
  cashboxName?: string
}>()

const emit = defineEmits<{
  (e: 'submit', data: OpenCashboxAmountRequest): void
  (e: 'cancel'): void
}>()

const state = reactive<Partial<OpenCashboxAmountRequest>>({ openingAmount: undefined })

async function onSubmit(event: FormSubmitEvent<OpenCashboxAmountRequest>) {
  emit('submit', event.data)
}
</script>

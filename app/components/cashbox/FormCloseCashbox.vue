<template>
  <UForm
    :schema="closeCashboxSchema"
    :state="state"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <!-- Resumen del sistema para que el cajero compare mientras cuenta el efectivo -->
    <div class="rounded-lg border border-default bg-elevated/40 p-4 flex flex-col gap-2 text-sm">
      <p class="font-semibold text-highlighted mb-1">Resumen del sistema</p>
      <div class="flex justify-between">
        <span class="text-muted">Monto de apertura</span>
        <span class="font-medium">S/ {{ fmt(openingAmount) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-muted">Ventas cobradas</span>
        <span class="font-medium text-success">+ S/ {{ fmt(collectedSales) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-muted">Vueltos entregados</span>
        <span class="font-medium text-error">− S/ {{ fmt(totalEgresos) }}</span>
      </div>
      <div class="flex justify-between border-t border-default pt-2 mt-1">
        <span class="font-semibold text-highlighted">Saldo esperado en caja</span>
        <span class="text-lg font-bold text-primary">S/ {{ fmt(currentBalance) }}</span>
      </div>
    </div>

    <UFormField label="Efectivo contado físicamente (S/)" name="closingAmount">
      <UInput
        v-model.number="state.closingAmount"
        type="number"
        min="0"
        step="0.01"
        :placeholder="`Sistema espera: S/ ${fmt(currentBalance)}`"
        class="w-full"
      />
    </UFormField>

    <!-- Diferencia en tiempo real -->
    <div
      v-if="state.closingAmount !== undefined && state.closingAmount !== null"
      :class="[
        'rounded-lg px-4 py-3 flex justify-between items-center text-sm font-medium',
        diferencia === 0
          ? 'bg-success/10 border border-success/30 text-success'
          : diferencia > 0
            ? 'bg-info/10 border border-info/30 text-info'
            : 'bg-error/10 border border-error/30 text-error'
      ]"
    >
      <span>{{ diferencia === 0 ? 'Sin diferencias' : diferencia > 0 ? 'Sobrante' : 'Faltante' }}</span>
      <span class="text-base font-bold">
        {{ diferencia >= 0 ? '+' : '' }}S/ {{ fmt(Math.abs(diferencia)) }}
      </span>
    </div>

    <div class="flex justify-end gap-3 mt-2">
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
import { reactive, computed } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { closeCashboxSchema, type CloseCashboxRequest } from '~/utils/validations'

const props = defineProps<{
  loading?: boolean
  openingAmount?: number
  collectedSales?: number
  currentBalance?: number
  totalEgresos?: number
}>()

const emit = defineEmits<{ (e: 'submit', data: CloseCashboxRequest): void; (e: 'cancel'): void }>()

const state = reactive<Partial<CloseCashboxRequest>>({ closingAmount: undefined })

const diferencia = computed(() => {
  if (state.closingAmount == null) return 0
  return state.closingAmount - (props.currentBalance ?? 0)
})

function fmt(value?: number) {
  return (value ?? 0).toFixed(2)
}

async function onSubmit(event: FormSubmitEvent<CloseCashboxRequest>) {
  emit('submit', event.data)
}
</script>

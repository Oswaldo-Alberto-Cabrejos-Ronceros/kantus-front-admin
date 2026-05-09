<template>
  <div class="space-y-4">
    <div class="text-sm mb-4 text-gray-600 dark:text-gray-400">
      Agregando oferta para: <span class="font-semibold text-gray-900 dark:text-white">{{ productName }}</span>
    </div>
    <UForm
      :schema="discountSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField label="Tipo de Descuento" name="tipo">
        <URadioGroup
          v-model="state.tipo"
          orientation="horizontal"
          :items="discountTypes"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Cantidad de Descuento" name="cantidad">
        <UInput
          v-model.number="state.cantidad"
          type="number"
          placeholder="0"
          class="w-full"
        />
      </UFormField>

      <div class="flex justify-end gap-2 mt-4">
        <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
          Cancelar
        </UButton>
        <UButton type="submit" :loading="loading">
          Guardar Oferta
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { discountSchema, type DiscountRequest } from '~/utils/validations'

const props = defineProps<{
  productId: number
  productName: string
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [productId: number, data: DiscountRequest]
  cancel: []
}>()

const discountTypes = [
  { label: 'Porcentaje (%)', value: 'porcentaje' },
  { label: 'Precio Fijo', value: 'precio' }
]

const state = reactive<Partial<DiscountRequest>>({
  tipo: 'porcentaje',
  cantidad: undefined
})

async function onSubmit(event: FormSubmitEvent<DiscountRequest>) {
  emit('submit', props.productId, event.data)
}
</script>

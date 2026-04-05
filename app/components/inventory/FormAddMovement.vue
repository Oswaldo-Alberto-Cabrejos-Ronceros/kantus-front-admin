<template>
  <UForm
    :schema="movementInventorySchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Tipo de Movimiento"
      name="tipo"
    >
      <URadioGroup
        v-model="state.tipo"
        orientation="horizontal"
        variant="table"
        :items="movementTypes"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Producto"
      name="productId"
    >
      <USelectMenu
        v-model="state.productId"
        :items="products"
        value-key="id"
        option-key="name"
        placeholder="Seleccione un producto"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Cantidad"
      name="cantidad"
    >
      <UInput
        v-model.number="state.cantidad"
        type="number"
        placeholder="0"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Razón"
      name="razon"
    >
      <UInput
        v-model="state.razon"
        placeholder="Ej. Compra de insumos, merma..."
        class="w-full"
      />
    </UFormField>

    <div class="flex justify-end gap-2">
      <UButton
        color="neutral"
        variant="ghost"
        @click="$emit('cancel')"
      >
        Cancelar
      </UButton>
      <UButton
        type="submit"
        :loading="loading"
      >
        Guardar
      </UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import { movementInventorySchema, type MovementInventoryRequest } from '~/utils/validations'
import type { ProductInventory } from '~/types'
import { reactive } from 'vue'

defineProps<{
  loading?: boolean
  products: ProductInventory[]
}>()

const emit = defineEmits<{
  submit: [data: MovementInventoryRequest]
  cancel: []
}>()

const movementTypes = [
  { label: 'Entrada', value: 'entrada' },
  { label: 'Salida', value: 'salida' }
]

const state = reactive<Partial<MovementInventoryRequest>>({
  tipo: 'entrada',
  productId: undefined,
  cantidad: undefined,
  razon: undefined
})

async function onSubmit(event: FormSubmitEvent<MovementInventoryRequest>) {
  emit('submit', event.data)
}
</script>

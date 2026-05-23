<template>
  <UForm
    :schema="productInventorySchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField label="Nombre" name="name">
      <UInput v-model="state.name" placeholder="Ej. Pollo entero" class="w-full" />
    </UFormField>

    <UFormField label="Descripción" name="description">
      <UInput v-model="state.description" placeholder="Descripción opcional del producto" class="w-full" />
    </UFormField>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Categoría" name="categoryId">
        <USelectMenu
          v-model="state.categoryId"
          :items="categories"
          value-key="id"
          label-key="name"
          placeholder="Seleccionar"
          class="w-full"
        />
      </UFormField>
      <!-- Unidad (unitary) es el único campo requerido además de name y categoryId -->
      <UFormField label="Unidad de medida" name="unitary">
        <USelect v-model="state.unitary" :items="unitOptions" class="w-full" />
      </UFormField>
    </div>

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
import type { CategoryInventory } from '~/types'
import { productInventorySchema, type ProductInventoryRequest } from '~/utils/validations'

defineProps<{
  loading?: boolean
  categories: CategoryInventory[]
}>()

const emit = defineEmits<{
  submit: [data: ProductInventoryRequest]
  cancel: []
}>()

// Backend usa unitary como string libre (ej: "Unidad", "Kilogramo", etc.)
const unitOptions = ['Unidad', 'Kilogramo', 'Litro', 'Gramo', 'Mililitro']

const state = reactive<Partial<ProductInventoryRequest>>({
  name: '',
  description: undefined,
  categoryId: undefined,
  unitary: 'Unidad'
})

async function onSubmit(event: FormSubmitEvent<ProductInventoryRequest>) {
  emit('submit', event.data)
}
</script>

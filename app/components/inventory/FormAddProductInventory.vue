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

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Categoría" name="categoryId">
        <USelectMenu v-model="state.categoryId" :items="categories" value-key="id" label-key="name" placeholder="Seleccionar" class="w-full" />
      </UFormField>
      <UFormField label="Proveedor" name="supplierId">
        <USelectMenu v-model="state.supplierId" :items="suppliers" value-key="id" label-key="nombre" placeholder="Seleccionar" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <UFormField label="Cantidad" name="cantidad">
        <UInput v-model.number="state.cantidad" type="number" placeholder="0" class="w-full" />
      </UFormField>
      <UFormField label="Stock Mínimo" name="stockMinimo">
        <UInput v-model.number="state.stockMinimo" type="number" placeholder="0" class="w-full" />
      </UFormField>
      <UFormField label="Unidad" name="unidad">
        <USelect v-model="state.unidad" :options="units" class="w-full" />
      </UFormField>
    </div>

    <UFormField label="Fecha de Vencimiento" name="fechaVencimiento">
      <UInput v-model="state.fechaVencimiento" type="date" class="w-full" />
    </UFormField>

    <UFormField label="Estado" name="estado">
      <div class="flex items-center gap-3">
        <USwitch v-model="state.estado" />
        <span class="text-sm">{{ state.estado ? 'Activo' : 'Inactivo' }}</span>
      </div>
    </UFormField>

    <div class="flex justify-end gap-2 mt-4">
      <UButton color="neutral" variant="ghost" @click="$emit('cancel')">Cancelar</UButton>
      <UButton type="submit" :loading="loading">Guardar</UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CategoryInventory, Supplier } from '~/types'
import { productInventorySchema, type ProductInventoryRequest } from '~/utils/validations'

defineProps<{
  loading?: boolean
  categories: CategoryInventory[]
  suppliers: Supplier[]
}>()

const emit = defineEmits<{
  submit: [data: ProductInventoryRequest]
  cancel: []
}>()

const units = ['Unidad', 'Kilogramo', 'Litro', 'Gramo', 'Mililitro']

const state = reactive<Partial<ProductInventoryRequest>>({
  name: '',
  categoryId: undefined,
  cantidad: undefined,
  stockMinimo: undefined,
  unidad: 'Unidad',
  fechaVencimiento: '',
  estado: true,
  supplierId: undefined
})

async function onSubmit(event: FormSubmitEvent<ProductInventoryRequest>) {
  emit('submit', event.data)
}
</script>

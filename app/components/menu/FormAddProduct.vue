<template>
  <UForm
    :schema="productSchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Nombre"
      name="name"
    >
      <UInput
        v-model="state.name"
        placeholder="Ej. Ceviche Clásico"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Descripción"
      name="description"
    >
      <UInput
        v-model="state.description"
        placeholder="Plato tradicional peruano..."
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Precio"
      name="price"
    >
      <UInput
        v-model.number="state.price"
        type="number"
        placeholder="0.00"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Categoría"
      name="categoryId"
    >
      <USelectMenu
        v-model="state.categoryId"
        :items="categories"
        value-key="id"
        option-key="name"
        placeholder="Seleccione una categoría"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="URL de Imagen"
      name="imageUrl"
    >
      <UInput
        v-model="state.imageUrl"
        placeholder="https://ejemplo.com/imagen.jpg"
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
import { productSchema, type ProductRequest } from '~/utils/validations'
import type { Product, Category } from '~/types'
import { reactive, watch } from 'vue'

const props = defineProps<{
  loading?: boolean
  initialData?: Product
  categories: Category[]
}>()

const emit = defineEmits<{
  submit: [data: ProductRequest]
  edit: [id: number, data: Partial<ProductRequest>]
  cancel: []
}>()

const state = reactive<Partial<ProductRequest>>({
  name: props.initialData?.name || undefined,
  description: props.initialData?.description || undefined,
  price: props.initialData?.price || undefined,
  categoryId: props.initialData?.categoryId || undefined,
  imageUrl: props.initialData?.imageUrl || undefined
})

watch(() => props.initialData, (newData) => {
  if (newData) {
    state.name = newData.name
    state.description = newData.description
    state.price = newData.price
    state.categoryId = newData.categoryId
    state.imageUrl = newData.imageUrl
  } else {
    state.name = undefined
    state.description = undefined
    state.price = undefined
    state.categoryId = undefined
    state.imageUrl = undefined
  }
})

async function onSubmit(event: FormSubmitEvent<ProductRequest>) {
  if (props.initialData?.id) {
    emit('edit', props.initialData.id, event.data as Partial<ProductRequest>)
  } else {
    emit('submit', event.data)
  }
}
</script>

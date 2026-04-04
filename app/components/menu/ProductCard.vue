<template>
  <UCard :ui="{ body: 'py-4 sm:p-4', footer: 'py-4 sm:p-4' }">
    <template #header>
      <div class="flex justify-center overflow-hidden h-40 -m-4 sm:-m-6 mb-0 sm:mb-0">
        <img
          :src="imageUrl"
          :alt="name"
          class="w-full h-full object-cover"
        >
      </div>
    </template>

    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
        {{ name }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 h-10">
        {{ description }}
      </p>
      <span class="text-xl font-bold text-primary mt-1">{{ formatPrice(price) }}</span>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          icon="i-lucide-pencil"
          size="sm"
          color="secondary"
          @click="emit('edit')"
        >
          Editar
        </UButton>
        <UButton
          icon="i-lucide-trash-2"
          size="sm"
          color="error"
          @click="emit('delete')"
        >
          Eliminar
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
defineProps<{
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
}>()

const emit = defineEmits(['edit', 'delete'])

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(value)
}
</script>

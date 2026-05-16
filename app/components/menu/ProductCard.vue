<template>
  <UCard :ui="{ body: 'py-4 sm:p-4', footer: 'py-4 sm:p-4' }" class="card-hover group overflow-hidden">
    <template #header>
      <div class="relative flex justify-center overflow-hidden h-44 -m-4 sm:-m-6 mb-0 sm:mb-0">
        <img
          :src="imageUrl"
          :alt="name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        >
        <!-- Status overlay -->
        <div v-if="!status" class="absolute inset-0 bg-black/50 flex items-center justify-center">
          <UBadge color="error" variant="solid" size="lg">Inactivo</UBadge>
        </div>
        <!-- Promotion badge -->
        <div v-if="promotion && promotion.status" class="absolute top-2 right-2">
          <UBadge color="warning" variant="solid" size="sm" class="badge-glow-warning font-bold shadow-lg">
            <UIcon name="i-lucide-badge-percent" class="w-3 h-3 mr-1" />
            {{ promotion.tipo === 'porcentaje' ? `-${promotion.valor}%` : `S/ ${promotion.valor} OFF` }}
          </UBadge>
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-2">
      <h3 class="text-base font-semibold text-highlighted line-clamp-1">
        {{ name }}
      </h3>
      <p class="text-sm text-muted line-clamp-2 h-10">
        {{ description }}
      </p>
      <div class="flex items-center gap-2 mt-1">
        <span v-if="promotion && promotion.status" class="text-sm text-muted line-through">
          {{ formatPrice(price) }}
        </span>
        <span class="text-xl font-bold text-primary">
          {{ formatPrice(effectivePrice) }}
        </span>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center gap-2">
        <UButton
          icon="i-lucide-badge-percent"
          size="sm"
          color="primary"
          variant="soft"
          @click="emit('addDiscount')"
        >
          Oferta
        </UButton>
        <div class="flex items-center gap-1.5">
          <UTooltip :text="status ? 'Desactivar' : 'Reactivar'">
            <UButton
              :icon="status ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              size="sm"
              :color="status ? 'warning' : 'success'"
              variant="ghost"
              @click="emit('toggleStatus')"
            />
          </UTooltip>
          <UButton
            icon="i-lucide-pencil"
            size="sm"
            color="secondary"
            variant="ghost"
            @click="emit('edit')"
          />
          <UButton
            icon="i-lucide-trash-2"
            size="sm"
            color="error"
            variant="ghost"
            @click="emit('delete')"
          />
        </div>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Promotion } from '~/types'

const props = defineProps<{
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  status: boolean
  promotion?: Promotion
}>()

const emit = defineEmits(['edit', 'delete', 'addDiscount', 'toggleStatus'])

const effectivePrice = computed(() => {
  if (!props.promotion || !props.promotion.status) return props.price
  if (props.promotion.tipo === 'porcentaje') {
    return props.price * (1 - props.promotion.valor / 100)
  }
  return Math.max(0, props.price - props.promotion.valor)
})

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(value)
}
</script>

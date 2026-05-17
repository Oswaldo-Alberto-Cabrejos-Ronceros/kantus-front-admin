<template>
  <UCard
    :ui="{ body: 'p-0', header: 'p-0' }"
    class="card-hover group overflow-hidden cursor-pointer"
    @click="emit('add')"
  >
    <div class="relative h-40 overflow-hidden">
      <img
        :src="imageUrl"
        :alt="name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      >
      <!-- Promotion badge -->
      <div v-if="promotion && promotion.status" class="absolute top-2 left-2">
        <UBadge
          color="warning"
          variant="solid"
          size="xs"
          class="font-bold shadow-lg"
        >
          {{ promotion.tipo === 'porcentaje' ? `-${promotion.valor}%` : `S/ ${promotion.valor} OFF` }}
        </UBadge>
      </div>
      <!-- Add overlay on hover -->
      <div class="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
        <div class="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div class="bg-primary text-white rounded-full p-2.5 shadow-lg">
            <UIcon name="i-lucide-plus" class="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>

    <div class="p-3.5">
      <h3 class="text-sm font-semibold text-highlighted line-clamp-1 mb-1">
        {{ name }}
      </h3>
      <p class="text-xs text-muted line-clamp-2 mb-2 h-8">
        {{ description }}
      </p>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <span v-if="promotion && promotion.status" class="text-xs text-muted line-through">
            {{ formatPrice(price) }}
          </span>
          <span class="text-base font-bold text-primary">
            {{ formatPrice(effectivePrice) }}
          </span>
        </div>
      </div>
    </div>
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
  promotion?: Promotion
}>()

const emit = defineEmits<{
  add: []
}>()

const effectivePrice = computed(() => {
  if (!props.promotion || !props.promotion.status) return props.price
  if (props.promotion.tipo === 'porcentaje') {
    return props.price * (1 - props.promotion.valor / 100)
  }
  return Math.max(0, props.price - props.promotion.valor)
})

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}
</script>

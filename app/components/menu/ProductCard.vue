<template>
  <div
    class="group relative rounded-xl border border-default bg-default overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30 flex flex-col"
    :class="!status && 'opacity-60'"
  >
    <!-- Image -->
    <div class="relative h-40 overflow-hidden bg-elevated shrink-0">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      >
      <!-- Placeholder when no image -->
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-elevated to-accented/20">
        <UIcon name="i-lucide-utensils" class="w-10 h-10 text-muted/40" />
      </div>

      <!-- Status overlay -->
      <div v-if="!status" class="absolute inset-0 bg-black/40 flex items-center justify-center">
        <span class="text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Inactivo
        </span>
      </div>

      <!-- Promotion badge -->
      <div v-if="promotion && promotion.status" class="absolute top-2 left-2">
        <span class="inline-flex items-center gap-1 bg-warning text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
          <UIcon name="i-lucide-zap" class="w-3 h-3" />
          {{ promotion.tipo === 'porcentaje' ? `-${promotion.valor}%` : `S/. ${promotion.valor} OFF` }}
        </span>
      </div>

      <!-- Quick actions overlay (desktop hover) -->
      <div class="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          class="w-7 h-7 rounded-lg bg-default/90 backdrop-blur-sm border border-default shadow flex items-center justify-center text-muted hover:text-primary transition-colors"
          title="Editar"
          @click="emit('edit')"
        >
          <UIcon name="i-lucide-pencil" class="w-3.5 h-3.5" />
        </button>
        <button
          :title="status ? 'Desactivar' : 'Activar'"
          class="w-7 h-7 rounded-lg bg-default/90 backdrop-blur-sm border border-default shadow flex items-center justify-center transition-colors"
          :class="status ? 'text-muted hover:text-warning' : 'text-muted hover:text-success'"
          @click="emit('toggleStatus')"
        >
          <UIcon :name="status ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-3.5 h-3.5" />
        </button>
        <button
          class="w-7 h-7 rounded-lg bg-default/90 backdrop-blur-sm border border-default shadow flex items-center justify-center text-muted hover:text-error transition-colors"
          title="Eliminar"
          @click="emit('delete')"
        >
          <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Body -->
    <div class="flex flex-col gap-1.5 px-3 pt-3 pb-1 flex-1">
      <h3 class="text-sm font-semibold text-highlighted line-clamp-1 leading-snug">
        {{ name }}
      </h3>
      <p class="text-xs text-muted line-clamp-2 leading-relaxed flex-1">
        {{ description || '—' }}
      </p>
      <div class="flex items-baseline gap-1.5 mt-1">
        <span v-if="promotion && promotion.status" class="text-xs text-muted line-through">
          {{ formatPrice(price) }}
        </span>
        <span class="text-base font-bold text-primary">
          {{ formatPrice(effectivePrice) }}
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-3 pb-3 pt-2 flex items-center justify-between gap-2 border-t border-default/50 mt-2">
      <button
        class="inline-flex items-center gap-1.5 text-xs font-medium text-primary/80 hover:text-primary bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-lg transition-colors"
        @click="emit('addDiscount')"
      >
        <UIcon name="i-lucide-badge-percent" class="w-3.5 h-3.5" />
        Oferta
      </button>

      <!-- Mobile actions (always visible) -->
      <div class="flex items-center gap-1 md:hidden">
        <button
          class="w-7 h-7 rounded-lg border border-default flex items-center justify-center text-muted hover:text-primary transition-colors"
          @click="emit('edit')"
        >
          <UIcon name="i-lucide-pencil" class="w-3.5 h-3.5" />
        </button>
        <button
          class="w-7 h-7 rounded-lg border border-default flex items-center justify-center transition-colors"
          :class="status ? 'text-muted hover:text-warning' : 'text-muted hover:text-success'"
          @click="emit('toggleStatus')"
        >
          <UIcon :name="status ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-3.5 h-3.5" />
        </button>
        <button
          class="w-7 h-7 rounded-lg border border-default flex items-center justify-center text-muted hover:text-error transition-colors"
          @click="emit('delete')"
        >
          <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
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

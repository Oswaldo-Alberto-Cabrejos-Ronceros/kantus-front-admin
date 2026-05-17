<template>
  <div class="space-y-3">
    <!-- Low stock alerts -->
    <div v-if="lowStockProducts.length > 0">
      <h3 class="text-sm font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
        <UIcon name="i-lucide-triangle-alert" class="w-4 h-4 text-warning" />
        Bajo Stock ({{ lowStockProducts.length }})
      </h3>
      <div class="space-y-2">
        <UPageCard
          v-for="product in lowStockProducts"
          :key="product.id"
          :title="product.name"
          icon="i-lucide-package-minus"
          variant="subtle"
          class="animate-fade-in-up"
          highlight
          highlight-color="warning"
        >
          <template #description>
            <div class="flex items-center gap-2">
              <UBadge
                color="warning"
                variant="subtle"
                size="xs"
                class="badge-glow-warning"
              >
                Stock: {{ product.cantidad }} {{ product.unidad }}
              </UBadge>
              <span class="text-xs text-muted">Mín: {{ product.stockMinimo }} {{ product.unidad }}</span>
            </div>
          </template>
        </UPageCard>
      </div>
    </div>

    <!-- Expiring soon alerts -->
    <div v-if="expiringProducts.length > 0">
      <h3 class="text-sm font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
        <UIcon name="i-lucide-calendar-clock" class="w-4 h-4 text-error" />
        Próximos a Vencer ({{ expiringProducts.length }})
      </h3>
      <div class="space-y-2">
        <UPageCard
          v-for="product in expiringProducts"
          :key="product.id"
          :title="product.name"
          icon="i-lucide-clock-alert"
          variant="subtle"
          class="animate-fade-in-up"
          highlight
          highlight-color="error"
        >
          <template #description>
            <div class="flex items-center gap-2">
              <UBadge
                color="error"
                variant="subtle"
                size="xs"
                class="badge-glow-error"
              >
                Vence: {{ formatDate(product.fechaVencimiento) }}
              </UBadge>
              <span class="text-xs text-muted">{{ getDaysUntilExpiry(product.fechaVencimiento) }} días</span>
            </div>
          </template>
        </UPageCard>
      </div>
    </div>

    <!-- All good message -->
    <div v-if="lowStockProducts.length === 0 && expiringProducts.length === 0" class="empty-state py-8">
      <UIcon name="i-lucide-check-circle" class="w-12 h-12 mb-3 text-success" />
      <p class="text-sm font-medium text-muted">
        Todo en orden. No hay alertas pendientes.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { ProductInventory } from '~/types'

const props = defineProps<{
  products: ProductInventory[]
  daysThreshold?: number
}>()

const threshold = computed(() => props.daysThreshold || 7)

const lowStockProducts = computed(() =>
  props.products.filter(p => p.estado && p.stockMinimo && p.cantidad <= p.stockMinimo)
)

const expiringProducts = computed(() =>
  props.products.filter((p) => {
    if (!p.estado) return false
    const days = getDaysUntilExpiry(p.fechaVencimiento)
    return days >= 0 && days <= threshold.value
  })
)

function getDaysUntilExpiry(date: string | Date): number {
  const now = new Date()
  const expiry = new Date(date)
  const diff = expiry.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

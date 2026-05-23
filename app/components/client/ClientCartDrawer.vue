<template>
  <USlideover v-model:open="isOpen" title="Tu Pedido" side="right">
    <UButton
      icon="i-lucide-shopping-cart"
      color="primary"
      size="lg"
      class="fab"
      :ui="{ rounded: 'rounded-full' }"
      @click="isOpen = true"
    >
      <template #trailing>
        <UBadge
          v-if="totalItems > 0"
          color="error"
          variant="solid"
          size="xs"
          class="animate-count-bounce"
        >
          {{ totalItems }}
        </UBadge>
      </template>
    </UButton>

    <template #body>
      <div class="flex flex-col h-full">
        <!-- Empty cart -->
        <div v-if="items.length === 0" class="empty-state flex-1">
          <UIcon name="i-lucide-shopping-cart" class="w-16 h-16 mb-4 text-muted" />
          <p class="text-lg font-medium text-muted">
            Tu carrito está vacío
          </p>
          <p class="text-sm text-dimmed mt-1">
            Agrega productos desde la carta
          </p>
        </div>

        <!-- Cart items -->
        <div v-else class="flex-1 overflow-y-auto space-y-3">
          <div
            v-for="item in items"
            :key="item.productId"
            class="flex items-center gap-3 p-3 rounded-lg bg-elevated/50 animate-fade-in-up"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-highlighted truncate">
                {{ item.name }}
              </p>
              <p class="text-xs text-muted">
                {{ formatPrice(item.priceUnitary) }} c/u
              </p>
            </div>
            <div class="flex items-center gap-2">
              <UButton
                icon="i-lucide-minus"
                size="xs"
                color="neutral"
                variant="soft"
                :ui="{ rounded: 'rounded-full' }"
                @click="emit('updateQuantity', item.productId, item.quantity - 1)"
              />
              <span class="text-sm font-semibold w-6 text-center">{{ item.quantity }}</span>
              <UButton
                icon="i-lucide-plus"
                size="xs"
                color="primary"
                variant="soft"
                :ui="{ rounded: 'rounded-full' }"
                @click="emit('updateQuantity', item.productId, item.quantity + 1)"
              />
            </div>
            <span class="text-sm font-bold text-primary w-20 text-right">
              {{ formatPrice(item.priceUnitary * item.quantity) }}
            </span>
          </div>
        </div>

        <!-- Cart footer -->
        <div v-if="items.length > 0" class="border-t border-default pt-4 mt-4 space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold text-highlighted">Total</span>
            <span class="text-2xl font-bold text-primary">{{ formatPrice(total) }}</span>
          </div>
          <UButton
            block
            color="primary"
            size="lg"
            icon="i-lucide-check"
            :loading="loading"
            @click="emit('confirm')"
          >
            Confirmar Pedido
          </UButton>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface CartItem {
  productId: number
  name: string
  priceUnitary: number
  quantity: number
}

const props = defineProps<{
  items: CartItem[]
  loading?: boolean
}>()

const emit = defineEmits<{
  updateQuantity: [productId: number, quantity: number]
  confirm: []
}>()

const isOpen = defineModel<boolean>('open', { default: false })

const totalItems = computed(() => props.items.reduce((sum, i) => sum + i.quantity, 0))
const total = computed(() => props.items.reduce((sum, i) => sum + i.priceUnitary * i.quantity, 0))

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}
</script>

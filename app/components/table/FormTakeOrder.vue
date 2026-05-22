<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex justify-between items-center pb-2 border-b border-default">
      <h2 class="text-xl font-bold text-highlighted">
        Tomar Pedido - {{ tableName }}
      </h2>
    </div>

    <!-- Customer Name -->
    <div class="space-y-1">
      <label class="text-sm font-semibold text-muted uppercase tracking-wider block">
        Nombre del Cliente (Opcional)
      </label>
      <UInput
        v-model="customerName"
        placeholder="Nombre del cliente..."
        icon="i-lucide-user"
        class="w-full"
      />
    </div>

    <!-- Product selection -->
    <div class="space-y-3">
      <h3 class="text-sm font-semibold text-muted uppercase tracking-wider">
        Seleccionar Productos
      </h3>

      <!-- Search -->
      <UInput
        v-model="search"
        placeholder="Buscar producto..."
        icon="i-lucide-search"
        class="w-full"
      />

      <!-- Products grid -->
      <div class="max-h-64 overflow-y-auto space-y-2">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="flex items-center justify-between p-3 rounded-lg bg-elevated/50 hover:bg-elevated transition-colors"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-highlighted truncate">
              {{ product.name }}
            </p>
            <p class="text-xs text-muted">
              {{ formatPrice(product.price) }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              v-if="getItemQuantity(product.id) > 0"
              icon="i-lucide-minus"
              size="xs"
              color="neutral"
              variant="soft"
              :ui="{ base: 'rounded-full' }"
              @click="removeItem(product)"
            />
            <span v-if="getItemQuantity(product.id) > 0" class="text-sm font-semibold w-6 text-center">
              {{ getItemQuantity(product.id) }}
            </span>
            <UButton
              icon="i-lucide-plus"
              size="xs"
              color="primary"
              variant="soft"
              :ui="{ base: 'rounded-full' }"
              @click="addItem(product)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Selected items summary -->
    <div v-if="selectedItems.length > 0" class="space-y-2">
      <h3 class="text-sm font-semibold text-muted uppercase tracking-wider">
        Resumen del Pedido
      </h3>
      <div
        v-for="item in selectedItems"
        :key="item.productId"
        class="flex items-center justify-between text-sm"
      >
        <span class="text-highlighted">{{ item.quantity }}x {{ item.name }}</span>
        <span class="font-medium text-primary">{{ formatPrice(item.priceUnitary * item.quantity) }}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-between items-center border-t border-default pt-4">
      <div class="text-xl font-bold text-highlighted">
        Total: <span class="text-primary">{{ formatPrice(total) }}</span>
      </div>
      <div class="flex gap-3">
        <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
          Cancelar
        </UButton>
        <UButton
          color="primary"
          icon="i-lucide-send"
          :loading="loading"
          :disabled="selectedItems.length === 0"
          @click="handleSubmit"
        >
          Enviar Pedido
        </UButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Product } from '~/types'
import type { TakeOrderRequest } from '~/utils/validations'

interface SelectedItem {
  productId: number
  name: string
  quantity: number
  priceUnitary: number
}

const props = defineProps<{
  tableId: number
  tableName: string
  products: Product[]
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: TakeOrderRequest]
  cancel: []
}>()

const search = ref('')
const customerName = ref('')
const selectedItems = ref<SelectedItem[]>([])

const filteredProducts = computed(() => {
  const activeProducts = props.products.filter(p => p.status)
  if (!search.value) return activeProducts
  return activeProducts.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const total = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.priceUnitary * item.quantity, 0)
)

function getItemQuantity(productId: number): number {
  return selectedItems.value.find(i => i.productId === productId)?.quantity || 0
}

function addItem(product: Product) {
  const existing = selectedItems.value.find(i => i.productId === product.id)
  if (existing) {
    existing.quantity++
  } else {
    selectedItems.value.push({
      productId: product.id,
      name: product.name,
      quantity: 1,
      priceUnitary: product.price
    })
  }
}

function removeItem(product: Product) {
  const existing = selectedItems.value.find(i => i.productId === product.id)
  if (existing) {
    existing.quantity--
    if (existing.quantity <= 0) {
      selectedItems.value = selectedItems.value.filter(i => i.productId !== product.id)
    }
  }
}

function handleSubmit() {
  emit('submit', {
    tableId: props.tableId,
    customerName: customerName.value || undefined,
    products: selectedItems.value
  })
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}
</script>

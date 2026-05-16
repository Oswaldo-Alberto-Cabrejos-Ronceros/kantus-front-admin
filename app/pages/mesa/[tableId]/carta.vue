<template>
  <div class="menu-digital-bg min-h-screen">
    <!-- Header -->
    <div class="sticky top-0 z-20 bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg border-b border-default">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md">
            <span class="text-white font-black text-lg">K</span>
          </div>
          <div>
            <h1 class="text-lg font-bold text-highlighted leading-tight">Kantus Pollería</h1>
            <p class="text-xs text-muted">{{ tableName }}</p>
          </div>
        </div>
        <UColorModeButton />
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-5xl mx-auto px-4 py-6">
      <!-- Categories filter -->
      <div class="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <UButton
          v-for="cat in activeCategories"
          :key="cat.id"
          :color="selectedCategoryId === cat.id ? 'primary' : 'neutral'"
          :variant="selectedCategoryId === cat.id ? 'solid' : 'soft'"
          size="sm"
          class="shrink-0"
          @click="selectedCategoryId = cat.id"
        >
          {{ cat.name }}
        </UButton>
        <UButton
          :color="!selectedCategoryId ? 'primary' : 'neutral'"
          :variant="!selectedCategoryId ? 'solid' : 'soft'"
          size="sm"
          class="shrink-0"
          @click="selectedCategoryId = null"
        >
          Todos
        </UButton>
      </div>

      <!-- Products grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        <ClientProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :id="product.id"
          :name="product.name"
          :description="product.description"
          :price="product.price"
          :image-url="product.imageUrl"
          :promotion="product.promotion"
          class="stagger-item"
          @add="addToCart(product)"
        />
      </div>

      <div v-if="filteredProducts.length === 0" class="empty-state py-16">
        <UIcon name="i-lucide-search-x" class="w-16 h-16 mb-4" />
        <p class="text-lg font-medium">No hay productos en esta categoría</p>
      </div>
    </div>

    <!-- Cart Drawer -->
    <ClientCartDrawer
      v-model:open="isCartOpen"
      :items="cartItems"
      :loading="isSubmitting"
      @update-quantity="updateQuantity"
      @confirm="confirmOrder"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Category, Product } from '~/types'

definePageMeta({ layout: false })

const route = useRoute()
const toast = useToast()
const tableId = route.params.tableId as string
const tableName = computed(() => `Mesa ${tableId}`)

const { data: categories } = await useFetch<Category[]>('/api/categories')
const { data: products } = await useFetch<Product[]>('/api/products')

const activeCategories = computed(() => categories.value?.filter(c => c.status) || [])
const selectedCategoryId = ref<number | null>(null)
const isCartOpen = ref(false)
const isSubmitting = ref(false)

const filteredProducts = computed(() => {
  const active = products.value?.filter(p => p.status) || []
  if (!selectedCategoryId.value) return active
  return active.filter(p => p.categoryId === selectedCategoryId.value)
})

interface CartItem {
  productId: number
  name: string
  priceUnitary: number
  quantity: number
}

const cartItems = ref<CartItem[]>([])

function addToCart(product: Product) {
  const existing = cartItems.value.find(i => i.productId === product.id)
  if (existing) {
    existing.quantity++
  } else {
    cartItems.value.push({
      productId: product.id,
      name: product.name,
      priceUnitary: product.price,
      quantity: 1
    })
  }
  toast.add({ title: `${product.name} agregado`, color: 'success', icon: 'i-lucide-check' })
}

function updateQuantity(productId: number, quantity: number) {
  if (quantity <= 0) {
    cartItems.value = cartItems.value.filter(i => i.productId !== productId)
  } else {
    const item = cartItems.value.find(i => i.productId === productId)
    if (item) item.quantity = quantity
  }
}

function confirmOrder() {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    cartItems.value = []
    isCartOpen.value = false
    toast.add({ title: '¡Pedido enviado!', description: 'Tu pedido fue recibido en cocina.', color: 'success' })
  }, 1500)
}
</script>

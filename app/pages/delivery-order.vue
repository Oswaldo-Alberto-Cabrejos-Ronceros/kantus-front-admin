<template>
  <div class="menu-digital-bg min-h-screen">
    <!-- Header -->
    <div class="sticky top-0 z-20 bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg border-b border-default">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md">
            <span class="text-white font-black text-lg">K</span>
          </div>
          <div>
            <h1 class="text-lg font-bold text-highlighted leading-tight">
              Kantus Pollería
            </h1>
            <p class="text-xs text-muted">
              Pedido por Delivery
            </p>
          </div>
        </div>
        <UColorModeButton />
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Products column -->
        <div class="lg:col-span-2">
          <h2 class="text-xl font-bold text-highlighted mb-4">
            Nuestra Carta
          </h2>

          <!-- Category tabs -->
          <div class="flex gap-2 overflow-x-auto pb-4">
            <UButton
              :color="!selectedCategoryId ? 'primary' : 'neutral'"
              :variant="!selectedCategoryId ? 'solid' : 'soft'"
              size="sm"
              class="shrink-0"
              @click="selectedCategoryId = null"
            >
              Todos
            </UButton>
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
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ClientProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              v-bind="product"
              class="stagger-item"
              @add="addToCart(product)"
            />
          </div>
        </div>

        <!-- Order/Cart column -->
        <div class="lg:col-span-1">
          <div class="sticky top-20 space-y-4">
            <UCard>
              <template #header>
                <h3 class="font-bold text-highlighted flex items-center gap-2">
                  <UIcon name="i-lucide-shopping-cart" class="w-5 h-5" />
                  Tu Pedido ({{ totalItems }})
                </h3>
              </template>

              <!-- Cart items -->
              <div v-if="cartItems.length > 0" class="space-y-3 mb-4">
                <div v-for="item in cartItems" :key="item.productId" class="flex items-center justify-between text-sm">
                  <div class="flex-1 min-w-0">
                    <p class="text-highlighted truncate">
                      {{ item.name }}
                    </p>
                    <p class="text-xs text-muted">
                      {{ formatPrice(item.priceUnitary) }}
                    </p>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <UButton
                      icon="i-lucide-minus"
                      size="xs"
                      color="neutral"
                      variant="soft"
                      @click="updateQuantity(item.productId, item.quantity - 1)"
                    />
                    <span class="text-xs font-semibold w-5 text-center">{{ item.quantity }}</span>
                    <UButton
                      icon="i-lucide-plus"
                      size="xs"
                      color="primary"
                      variant="soft"
                      @click="updateQuantity(item.productId, item.quantity + 1)"
                    />
                  </div>
                  <span class="text-sm font-bold text-primary w-16 text-right">{{ formatPrice(item.priceUnitary * item.quantity) }}</span>
                </div>
              </div>
              <div v-else class="text-center py-6 text-muted text-sm">
                <UIcon name="i-lucide-shopping-cart" class="w-8 h-8 mb-2 mx-auto" />
                Agrega productos
              </div>

              <div v-if="cartItems.length > 0" class="border-t border-default pt-3">
                <div class="flex justify-between items-center mb-4">
                  <span class="font-bold text-highlighted">Total</span>
                  <span class="text-xl font-bold text-primary">{{ formatPrice(total) }}</span>
                </div>
              </div>
            </UCard>

            <!-- Contact form -->
            <UCard v-if="cartItems.length > 0">
              <template #header>
                <h3 class="font-bold text-highlighted flex items-center gap-2">
                  <UIcon name="i-lucide-user" class="w-5 h-5" />
                  Datos de Contacto
                </h3>
              </template>

              <div class="space-y-3">
                <UFormField label="Nombre completo">
                  <UInput v-model="contactForm.nombre" placeholder="Tu nombre" class="w-full" />
                </UFormField>
                <UFormField label="Celular">
                  <UInput v-model="contactForm.celular" placeholder="987654321" class="w-full" />
                </UFormField>
                <UFormField label="Email">
                  <UInput
                    v-model="contactForm.email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    class="w-full"
                  />
                </UFormField>
                <UFormField label="DNI">
                  <UInput v-model="contactForm.dni" placeholder="12345678" class="w-full" />
                </UFormField>
                <UFormField label="Dirección de entrega">
                  <UInput v-model="contactForm.direccion" placeholder="Av. Ejemplo 123, Distrito" class="w-full" />
                </UFormField>
              </div>

              <template #footer>
                <div class="space-y-2">
                  <UButton
                    block
                    color="primary"
                    size="lg"
                    icon="i-lucide-credit-card"
                    :loading="isSubmitting"
                    :disabled="!isFormValid"
                    @click="submitOrder"
                  >
                    Pagar con Mercado Pago — {{ formatPrice(total) }}
                  </UButton>
                  <p class="text-xs text-center text-muted">
                    Pago seguro procesado por Mercado Pago
                  </p>
                </div>
              </template>
            </UCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import type { Category, Product } from '~/types'

definePageMeta({ layout: false })

const toast = useToast()

const { useFindAllCategories } = useCategories()
const { useFindAllProducts } = useProducts()
const { useCreateOrder } = useOrders()

const { data: categories } = useFindAllCategories()
const { data: products } = useFindAllProducts()
const createOrderMutation = useCreateOrder()

const activeCategories = computed(() => categories.value?.filter((c: Category) => c.status) || [])
const selectedCategoryId = ref<number | null>(null)
const isSubmitting = ref(false)

const filteredProducts = computed(() => {
  const active = products.value?.filter((p: Product) => p.status) || []
  if (!selectedCategoryId.value) return active
  return active.filter((p: Product) => p.categoryId === selectedCategoryId.value)
})

interface CartItem {
  productId: number
  name: string
  priceUnitary: number
  quantity: number
}

const cartItems = ref<CartItem[]>([])

const contactForm = reactive({
  nombre: '',
  celular: '',
  email: '',
  dni: '',
  direccion: ''
})

const totalItems = computed(() => cartItems.value.reduce((s, i) => s + i.quantity, 0))
const total = computed(() => cartItems.value.reduce((s, i) => s + i.priceUnitary * i.quantity, 0))

const isFormValid = computed(() => {
  return contactForm.nombre && contactForm.celular.length >= 9 && contactForm.email && contactForm.dni.length >= 8 && contactForm.direccion && cartItems.value.length > 0
})

function addToCart(product: Product) {
  const existing = cartItems.value.find(i => i.productId === product.id)
  if (existing) {
    existing.quantity++
  } else {
    cartItems.value.push({ productId: product.id, name: product.name, priceUnitary: product.price, quantity: 1 })
  }
  toast.add({ title: `${product.name} agregado`, color: 'success' })
}

function updateQuantity(productId: number, quantity: number) {
  if (quantity <= 0) {
    cartItems.value = cartItems.value.filter(i => i.productId !== productId)
  } else {
    const item = cartItems.value.find(i => i.productId === productId)
    if (item) item.quantity = quantity
  }
}

async function submitOrder() {
  isSubmitting.value = true
  try {
    await createOrderMutation.mutateAsync({
      tableId: undefined,
      type: 'DELIVERY',
      products: cartItems.value.map(item => ({ id: item.productId, quantity: item.quantity, name: '', priceUnitary: 0 }))
    })
    cartItems.value = []
    toast.add({
      title: '¡Pedido realizado!',
      description: 'Serás redirigido a Mercado Pago para completar el pago.',
      color: 'success'
    })
  } catch {
    toast.add({ title: 'Error al procesar el pedido', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}
</script>

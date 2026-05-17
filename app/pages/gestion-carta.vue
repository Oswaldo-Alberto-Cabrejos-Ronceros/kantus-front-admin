<template>
  <UDashboardPanel id="gestion-carta">
    <template #header>
      <UDashboardNavbar title="Gestión de Carta" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 pb-4">
        <!-- Action buttons -->
        <div class="flex justify-end gap-2 flex-wrap">
          <!-- Category modal -->
          <UModal v-model:open="isCategoryModalOpen" title="Gestionar Categoría">
            <UButton icon="i-lucide-folder-plus" variant="soft">
              {{ selectedCategory ? 'Editar' : 'Nueva' }} Categoría
            </UButton>
            <template #body>
              <MenuFormAddCategory
                :initial-data="selectedCategory || undefined"
                :loading="isSubmitting"
                @submit="handleCreateCategory"
                @edit="handleEditCategory"
                @cancel="isCategoryModalOpen = false"
              />
            </template>
          </UModal>

          <!-- Product modal -->
          <UModal v-model:open="isModalOpen" title="Agregar Producto">
            <UButton icon="i-lucide-plus">
              Agregar Producto
            </UButton>
            <template #body>
              <MenuFormAddProduct
                :categories="activeCategories"
                :loading="isSubmitting"
                @submit="handleCreate"
                @cancel="isModalOpen = false"
              />
            </template>
          </UModal>

          <UModal v-model:open="isEditModalOpen" title="Editar Producto">
            <template #body>
              <MenuFormAddProduct
                v-if="selectedProduct"
                :categories="activeCategories"
                :initial-data="selectedProduct"
                :loading="isSubmitting"
                @edit="handleEdit"
                @cancel="isEditModalOpen = false"
              />
            </template>
          </UModal>

          <UModal v-model:open="isDiscountModalOpen" title="Agregar Oferta">
            <template #body>
              <MenuFormAddDiscount
                v-if="selectedProductForDiscount"
                :product-id="selectedProductForDiscount.id"
                :product-name="selectedProductForDiscount.name"
                :loading="isSubmittingDiscount"
                @submit="handleAddDiscount"
                @cancel="isDiscountModalOpen = false"
              />
            </template>
          </UModal>
        </div>

        <!-- Category tabs -->
        <UTabs
          v-if="items && items.length"
          :items="items"
          class="w-full"
        >
          <template
            v-for="category in categories"
            :key="category.id"
            #[`category-${category.id}`]
          >
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UBadge :color="category.status ? 'success' : 'error'" variant="subtle" size="xs">
                  {{ category.status ? 'Activa' : 'Inactiva' }}
                </UBadge>
                <span class="text-sm text-muted">{{ getProductsByCategory(category.id).length }} productos</span>
              </div>
              <div class="flex gap-1">
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-pencil"
                  @click="editCategory(category)"
                />
                <UButton
                  size="xs"
                  variant="ghost"
                  :icon="category.status ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :color="category.status ? 'warning' : 'success'"
                  @click="toggleCategoryStatus(category)"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <MenuProductCard
                v-for="product in getProductsByCategory(category.id)"
                :id="product.id"
                :key="product.id"
                :name="product.name"
                :description="product.description"
                :price="product.price"
                :image-url="product.imageUrl"
                :status="product.status"
                :promotion="product.promotion"
                class="stagger-item"
                @edit="handleEditProduct(product)"
                @delete="handleDeleteProduct(product)"
                @add-discount="openDiscountModal(product)"
                @toggle-status="toggleProductStatus(product)"
              />
            </div>
          </template>
        </UTabs>
        <div v-else class="empty-state">
          <UIcon name="i-lucide-utensils-crossed" class="w-16 h-16 mb-4" />
          <p class="text-lg font-medium">
            No hay categorías para mostrar
          </p>
          <p class="text-sm mt-1">
            Comienza creando una categoría
          </p>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Category, Product } from '~/types'
import type { ProductRequest, DiscountRequest, CategoryRequest } from '~/utils/validations'

const toast = useToast()

const { data: categories } = await useFetch<Category[]>('/api/categories')
const { data: products } = await useFetch<Product[]>('/api/products')

const activeCategories = computed(() => categories.value?.filter(c => c.status) || [])

const items = computed(() => {
  return categories.value?.map(category => ({
    label: category.name + (category.status ? '' : ' (Inactiva)'),
    slot: `category-${category.id}`
  })) || []
})

const getProductsByCategory = (categoryId: number) => {
  return products.value?.filter(p => p.categoryId === categoryId) || []
}

const isModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDiscountModalOpen = ref(false)
const isCategoryModalOpen = ref(false)
const selectedProduct = ref<Product | null>(null)
const selectedProductForDiscount = ref<Product | null>(null)
const selectedCategory = ref<Category | null>(null)
const isSubmitting = ref(false)
const isSubmittingDiscount = ref(false)

async function handleCreateCategory(data: CategoryRequest) {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    isCategoryModalOpen.value = false
    toast.add({ title: '¡Categoría creada!', color: 'success' })
  }, 1000)
}

async function handleEditCategory(id: number, data: CategoryRequest) {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    isCategoryModalOpen.value = false
    toast.add({ title: '¡Categoría actualizada!', color: 'success' })
  }, 1000)
}

function editCategory(category: Category) {
  selectedCategory.value = category
  isCategoryModalOpen.value = true
}

function toggleCategoryStatus(category: Category) {
  toast.add({ title: `Categoría ${category.status ? 'desactivada' : 'reactivada'}`, color: 'info' })
}

function toggleProductStatus(product: Product) {
  toast.add({ title: `Producto ${product.status ? 'desactivado' : 'reactivado'}`, color: 'info' })
}

async function handleCreate(data: ProductRequest) {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    isModalOpen.value = false
    toast.add({ title: '¡Producto creado!', color: 'success' })
  }, 1000)
}

async function handleEdit(id: number, data: Partial<ProductRequest>) {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    isEditModalOpen.value = false
    toast.add({ title: '¡Producto actualizado!', color: 'success' })
  }, 1000)
}

function handleEditProduct(product: Product) {
  selectedProduct.value = product
  isEditModalOpen.value = true
}

function handleDeleteProduct(product: Product) {
  toast.add({ title: 'Producto eliminado', description: product.name, color: 'warning' })
}

function openDiscountModal(product: Product) {
  selectedProductForDiscount.value = product
  isDiscountModalOpen.value = true
}

async function handleAddDiscount(productId: number, data: DiscountRequest) {
  isSubmittingDiscount.value = true
  setTimeout(() => {
    isSubmittingDiscount.value = false
    isDiscountModalOpen.value = false
    toast.add({ title: '¡Oferta agregada!', color: 'success' })
  }, 1000)
}
</script>

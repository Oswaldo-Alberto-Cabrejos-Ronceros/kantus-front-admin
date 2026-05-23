<template>
  <UDashboardPanel id="gestion-carta">
    <template #header>
      <UDashboardNavbar title="Gestión de Carta" :ui="{ right: 'gap-2' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <!-- Nueva Categoría -->
          <UModal v-model:open="isCategoryModalOpen" title="Gestionar Categoría">
            <UButton icon="i-lucide-folder-plus" color="neutral" variant="outline" size="sm">
              Categoría
            </UButton>
            <template #body>
              <MenuFormAddCategory
                :initial-data="selectedCategory || undefined"
                :loading="isSubmitting"
                @submit="handleCreateCategory"
                @edit="handleEditCategory"
                @cancel="closeCategoryModal"
              />
            </template>
          </UModal>

          <!-- Nuevo Producto -->
          <UModal v-model:open="isModalOpen" title="Agregar Producto">
            <UButton icon="i-lucide-plus" color="primary" size="sm">
              Producto
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
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col h-full">

        <!-- ── Barra de categorías (horizontal, todas las pantallas) ── -->
        <div class="shrink-0 border-b border-default bg-default">
          <div class="flex gap-1.5 px-4 py-2.5 overflow-x-auto scrollbar-none">
            <button
              class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
              :class="activeCategoryId === null
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-default hover:bg-elevated'"
              @click="activeCategoryId = null"
            >
              <UIcon name="i-lucide-layout-grid" class="w-3.5 h-3.5 shrink-0" />
              Todos
              <span class="tabular-nums opacity-70">{{ products?.length ?? 0 }}</span>
            </button>

            <button
              v-for="cat in categories"
              :key="cat.id"
              class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
              :class="activeCategoryId === cat.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-default hover:bg-elevated'"
              @click="activeCategoryId = cat.id"
            >
              <span
                class="w-1.5 h-1.5 rounded-full shrink-0"
                :class="cat.status ? 'bg-current opacity-60' : 'bg-neutral-400'"
              />
              {{ cat.name }}
              <span class="tabular-nums opacity-70">{{ getProductsByCategory(cat.id).length }}</span>
            </button>
          </div>
        </div>

        <!-- ── Toolbar: info categoría + acciones + buscador ── -->
        <div class="shrink-0 flex items-center justify-between gap-3 px-4 py-2.5 border-b border-default/50">
          <div class="flex items-center gap-2 min-w-0">
            <template v-if="activeCategory">
              <span class="text-sm font-bold text-highlighted truncate">{{ activeCategory.name }}</span>
              <UBadge :color="activeCategory.status ? 'success' : 'neutral'" variant="subtle" size="xs">
                {{ activeCategory.status ? 'Activa' : 'Inactiva' }}
              </UBadge>
              <UButton
                size="xs"
                variant="ghost"
                color="neutral"
                icon="i-lucide-pencil"
                @click="editCategory(activeCategory)"
              />
              <UButton
                size="xs"
                variant="ghost"
                :icon="activeCategory.status ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :color="activeCategory.status ? 'warning' : 'success'"
                @click="toggleCategoryStatus(activeCategory)"
              />
            </template>
            <span v-else class="text-sm font-bold text-highlighted">Todos los productos</span>
            <span class="text-xs text-muted tabular-nums">{{ visibleProducts.length }}</span>
          </div>

          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Buscar…"
            size="sm"
            class="w-36 md:w-48 shrink-0"
          />
        </div>

        <!-- ── Grid productos (scroll solo aquí) ── -->
        <div class="flex-1 overflow-y-auto px-4 py-4">
          <div v-if="visibleProducts.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            <MenuProductCard
              v-for="product in visibleProducts"
              :id="product.id"
              :key="product.id"
              :name="product.name"
              :description="product.description"
              :price="product.price"
              :image-url="product.imageUrl || ''"
              :status="product.status"
              :promotion="product.promotion"
              @edit="handleEditProduct(product)"
              @delete="handleDeleteProduct(product)"
              @add-discount="openDiscountModal(product)"
              @toggle-status="toggleProductStatus(product)"
            />
          </div>

          <div v-else class="flex flex-col items-center justify-center py-24 text-muted gap-3">
            <UIcon name="i-lucide-package-x" class="w-12 h-12 opacity-25" />
            <p class="text-sm font-medium">Sin productos</p>
            <p v-if="search" class="text-xs">Prueba otro término de búsqueda</p>
          </div>
        </div>
      </div>

      <!-- Modales ocultos -->
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
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Category, Product } from '~/types'
import type { ProductRequest, DiscountRequest, CategoryRequest } from '~/utils/validations'

const toast = useToast()

const { useFindAllCategories, useCreateCategory, useUpdateCategory, useActivateCategory, useDeactivateCategory } = useCategories()
const { useFindAllProducts, useCreateProduct, useUpdateProduct, useActivateProduct, useDeactivateProduct } = useProducts()

const { data: categories } = useFindAllCategories()
const { data: products } = useFindAllProducts()

const createCategoryMutation = useCreateCategory()
const updateCategoryMutation = useUpdateCategory()
const activateCategoryMutation = useActivateCategory()
const deactivateCategoryMutation = useDeactivateCategory()

const createProductMutation = useCreateProduct()
const updateProductMutation = useUpdateProduct()
const activateProductMutation = useActivateProduct()
const deactivateProductMutation = useDeactivateProduct()

// ── Filtros ──────────────────────────────────────────────────────
const activeCategoryId = ref<number | null>(null)
const search = ref('')

const activeCategories = computed(() => categories.value?.filter(c => c.status) ?? [])
const activeCategory = computed(() => categories.value?.find(c => c.id === activeCategoryId.value) ?? null)

const getProductsByCategory = (categoryId: number) =>
  products.value?.filter(p => p.categoryId === categoryId) ?? []

const visibleProducts = computed(() => {
  let list = activeCategoryId.value === null
    ? (products.value ?? [])
    : getProductsByCategory(activeCategoryId.value)
  const q = search.value.trim().toLowerCase()
  if (!q) return list
  return list.filter(p => p.name.toLowerCase().includes(q))
})

// ── Modal state ──────────────────────────────────────────────────
const isModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDiscountModalOpen = ref(false)
const isCategoryModalOpen = ref(false)
const selectedProduct = ref<Product | null>(null)
const selectedProductForDiscount = ref<Product | null>(null)
const selectedCategory = ref<Category | null>(null)
const isSubmitting = ref(false)
const isSubmittingDiscount = ref(false)

function closeCategoryModal() {
  isCategoryModalOpen.value = false
  selectedCategory.value = null
}
function editCategory(cat: Category) {
  selectedCategory.value = cat
  isCategoryModalOpen.value = true
}
function handleEditProduct(product: Product) {
  selectedProduct.value = product
  isEditModalOpen.value = true
}
function openDiscountModal(product: Product) {
  selectedProductForDiscount.value = product
  isDiscountModalOpen.value = true
}

// ── Categorías ───────────────────────────────────────────────────
async function handleCreateCategory(data: CategoryRequest) {
  isSubmitting.value = true
  try {
    await createCategoryMutation.mutateAsync(data)
    closeCategoryModal()
    toast.add({ title: 'Categoría creada', color: 'success' })
  } catch { toast.add({ title: 'Error al crear categoría', color: 'error' }) }
  finally { isSubmitting.value = false }
}

async function handleEditCategory(id: number, data: CategoryRequest) {
  isSubmitting.value = true
  try {
    await updateCategoryMutation.mutateAsync({ id, data })
    closeCategoryModal()
    toast.add({ title: 'Categoría actualizada', color: 'success' })
  } catch { toast.add({ title: 'Error al actualizar', color: 'error' }) }
  finally { isSubmitting.value = false }
}

async function toggleCategoryStatus(category: Category) {
  try {
    category.status
      ? await deactivateCategoryMutation.mutateAsync(category.id)
      : await activateCategoryMutation.mutateAsync(category.id)
    toast.add({ title: category.status ? 'Categoría desactivada' : 'Categoría activada', color: 'success' })
  } catch { toast.add({ title: 'Error al cambiar estado', color: 'error' }) }
}

// ── Productos ────────────────────────────────────────────────────
async function handleCreate(data: ProductRequest) {
  isSubmitting.value = true
  try {
    await createProductMutation.mutateAsync(data)
    isModalOpen.value = false
    toast.add({ title: 'Producto creado', color: 'success' })
  } catch { toast.add({ title: 'Error al crear producto', color: 'error' }) }
  finally { isSubmitting.value = false }
}

async function handleEdit(id: number, data: Partial<ProductRequest>) {
  isSubmitting.value = true
  try {
    await updateProductMutation.mutateAsync({ id, data: data as any })
    isEditModalOpen.value = false
    toast.add({ title: 'Producto actualizado', color: 'success' })
  } catch { toast.add({ title: 'Error al actualizar', color: 'error' }) }
  finally { isSubmitting.value = false }
}

async function handleDeleteProduct(product: Product) {
  try {
    await deactivateProductMutation.mutateAsync(Number(product.id))
    toast.add({ title: 'Producto desactivado', color: 'warning' })
  } catch { toast.add({ title: 'Error', color: 'error' }) }
}

async function toggleProductStatus(product: Product) {
  try {
    product.status
      ? await deactivateProductMutation.mutateAsync(Number(product.id))
      : await activateProductMutation.mutateAsync(Number(product.id))
  } catch { toast.add({ title: 'Error al cambiar estado', color: 'error' }) }
}

async function handleAddDiscount(_productId: number, _data: DiscountRequest) {
  isSubmittingDiscount.value = true
  setTimeout(() => {
    isSubmittingDiscount.value = false
    isDiscountModalOpen.value = false
    toast.add({ title: '¡Oferta agregada!', color: 'success' })
  }, 1000)
}
</script>

<template>
  <UDashboardPanel id="gestion-carta">
    <template #header>
      <UDashboardNavbar
        title="Gestión de Carta"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex justify-end gap-2">
        <UModal
          v-model:open="isModalOpen"
          title="Agregar Producto"
        >
          <UButton icon="i-lucide-plus">
            Agregar Producto
          </UButton>
          <template #body>
            <MenuFormAddProduct
              :categories="categories || []"
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
              :categories="categories || []"
              :initial-data="selectedProduct"
              :loading="isSubmitting"
              @edit="handleEdit"
              @cancel="isEditModalOpen = false"
            />
          </template>
        </UModal>
      </div>
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
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            <MenuProductCard
              v-for="product in getProductsByCategory(category.id)"
              :id="product.id"
              :key="product.id"
              :name="product.name"
              :description="product.description"
              :price="product.price"
              :image-url="product.imageUrl"
              @edit="handleEditProduct(product)"
              @delete="handleDeleteProduct(product)"
            />
          </div>
        </template>
      </UTabs>
      <div v-else class="flex justify-center items-center h-full">
        <p>No hay categorías para mostrar.</p>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Category, Product } from '~/types'
import type { ProductRequest } from '~/utils/validations'

const { data: categories } = await useFetch<Category[]>('/api/categories')
const { data: products } = await useFetch<Product[]>('/api/products')

const items = computed(() => {
  return categories.value?.map(category => ({
    label: category.name,
    slot: `category-${category.id}`
  })) || []
})

const getProductsByCategory = (categoryId: number) => {
  return products.value?.filter(p => p.categoryId === categoryId) || []
}

const isModalOpen = ref(false)
const isEditModalOpen = ref(false)
const selectedProduct = ref<Product | null>(null)
const isSubmitting = ref(false)

async function handleCreate(data: ProductRequest) {
  isSubmitting.value = true
  console.log('Simulando creación de producto...', data)
  setTimeout(() => {
    isSubmitting.value = false
    isModalOpen.value = false
    console.log('¡Producto creado exitosamente!')
  }, 1000)
}

async function handleEdit(id: number, data: Partial<ProductRequest>) {
  isSubmitting.value = true
  console.log('Simulando edición de producto...', id, data)
  setTimeout(() => {
    isSubmitting.value = false
    isEditModalOpen.value = false
    console.log('¡Producto editado exitosamente!')
  }, 1000)
}

function handleEditProduct(product: Product) {
  selectedProduct.value = product
  isEditModalOpen.value = true
}

function handleDeleteProduct(product: Product) {
  // Lógica para eliminar el producto
  console.log('Eliminando producto:', product.id)
}
</script>

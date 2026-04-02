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
      <div class="flex justify-end">
        <UButton
          label="Agregar Producto"
          icon="i-lucide-plus"
          @click="handleAddProduct"
        />
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
import { computed } from 'vue'
import type { Category, Product } from '~/types'

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

function handleAddProduct() {
  // Lógica para abrir modal o navegar para agregar producto
  console.log('Agregar nuevo producto')
}

function handleEditProduct(product: Product) {
  // Lógica para editar el producto
  console.log('Editando producto:', product.id)
}

function handleDeleteProduct(product: Product) {
  // Lógica para eliminar el producto
  console.log('Eliminando producto:', product.id)
}
</script>

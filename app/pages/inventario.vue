<template>
  <UDashboardPanel id="inventario">
    <template #header>
      <UDashboardNavbar title="Inventario" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 pb-4">
        <!-- Alerts section -->
        <InventoryAlerts :products="products || []" />

        <!-- Action buttons -->
        <div class="flex justify-end gap-2 flex-wrap">
          <UModal v-model:open="isCategoryModalOpen" title="Categoría de Inventario">
            <UButton icon="i-lucide-folder-plus" variant="soft" size="sm">Categoría</UButton>
            <template #body>
              <InventoryFormAddCategoryInventory :loading="isSubmitting" @submit="handleCreateCategory" @cancel="isCategoryModalOpen = false" />
            </template>
          </UModal>

          <UModal v-model:open="isProductModalOpen" title="Producto de Inventario">
            <UButton icon="i-lucide-package-plus" variant="soft" size="sm">Producto</UButton>
            <template #body>
              <InventoryFormAddProductInventory :categories="categories || []" :suppliers="suppliers || []" :loading="isSubmitting" @submit="handleCreateProduct" @cancel="isProductModalOpen = false" />
            </template>
          </UModal>

          <UModal v-model:open="isSupplierModalOpen" title="Proveedor">
            <UButton icon="i-lucide-truck" variant="soft" size="sm">Proveedor</UButton>
            <template #body>
              <InventoryFormAddSupplier :loading="isSubmitting" @submit="handleCreateSupplier" @cancel="isSupplierModalOpen = false" />
            </template>
          </UModal>

          <UModal v-model:open="isMovementModalOpen" title="Agregar Movimiento">
            <UButton icon="i-lucide-plus" color="primary">Movimiento</UButton>
            <template #body>
              <InventoryFormAddMovement :products="products || []" :loading="isSubmitting" @submit="handleCreateMovement" @cancel="isMovementModalOpen = false" />
            </template>
          </UModal>
        </div>

        <UTabs :items="tabItems" class="w-full">
          <!-- Stock tab -->
          <template #stock>
            <UTable
              class="mt-4 shrink-0"
              :data="products || []"
              :columns="stockColumns"
              :loading="statusProducts === 'pending'"
              :ui="{
                base: 'table-fixed border-separate border-spacing-0',
                thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                tbody: '[&>tr]:last:[&>td]:border-b-0',
                th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                td: 'border-b border-default',
                separator: 'h-0'
              }"
            />
          </template>

          <!-- Movements tab -->
          <template #movimientos>
            <UTable
              class="mt-4 shrink-0"
              :data="movements || []"
              :columns="movementColumns"
              :loading="statusMovements === 'pending'"
              :ui="{
                base: 'table-fixed border-separate border-spacing-0',
                thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                tbody: '[&>tr]:last:[&>td]:border-b-0',
                th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                td: 'border-b border-default',
                separator: 'h-0'
              }"
            />
          </template>

          <!-- Categories tab -->
          <template #categorias>
            <UTable
              class="mt-4 shrink-0"
              :data="categories || []"
              :columns="categoryColumns"
              :ui="{
                base: 'table-fixed border-separate border-spacing-0',
                thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                tbody: '[&>tr]:last:[&>td]:border-b-0',
                th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                td: 'border-b border-default',
                separator: 'h-0'
              }"
            />
          </template>

          <!-- Suppliers tab -->
          <template #proveedores>
            <UTable
              class="mt-4 shrink-0"
              :data="suppliers || []"
              :columns="supplierColumns"
              :ui="{
                base: 'table-fixed border-separate border-spacing-0',
                thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                tbody: '[&>tr]:last:[&>td]:border-b-0',
                th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                td: 'border-b border-default',
                separator: 'h-0'
              }"
            />
          </template>
        </UTabs>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { h, resolveComponent, computed, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { ProductInventory, MovementInventory, CategoryInventory, Supplier } from '~/types'
import type { MovementInventoryRequest, ProductInventoryRequest, CategoryInventoryRequest, SupplierRequest } from '~/utils/validations'

const UBadge = resolveComponent('UBadge')
const toast = useToast()

const { data: products, status: statusProducts } = await useFetch<ProductInventory[]>('/api/products-inventory')
const { data: movements, status: statusMovements } = await useFetch<MovementInventory[]>('/api/movements-inventory')
const { data: categories } = await useFetch<CategoryInventory[]>('/api/categories-inventory')
const { data: suppliers } = await useFetch<Supplier[]>('/api/suppliers')

const tabItems = [
  { label: 'Stock Actual', slot: 'stock', icon: 'i-lucide-package' },
  { label: 'Movimientos', slot: 'movimientos', icon: 'i-lucide-arrow-left-right' },
  { label: 'Categorías', slot: 'categorias', icon: 'i-lucide-folder' },
  { label: 'Proveedores', slot: 'proveedores', icon: 'i-lucide-truck' }
]

const stockColumns = computed<TableColumn<ProductInventory>[]>(() => [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Producto' },
  {
    id: 'category', header: 'Categoría',
    cell: ({ row }) => {
      const cat = categories.value?.find(c => c.id === row.original.categoryId)
      return cat ? cat.name : '-'
    }
  },
  {
    id: 'stock', header: 'Stock',
    cell: ({ row }) => {
      const isLow = row.original.stockMinimo && row.original.cantidad <= row.original.stockMinimo
      return h('span', { class: isLow ? 'text-error font-semibold' : '' }, `${row.original.cantidad} ${row.original.unidad}`)
    }
  },
  {
    accessorKey: 'fechaVencimiento', header: 'Vencimiento',
    cell: ({ row }) => new Date(row.original.fechaVencimiento).toLocaleDateString('es-PE')
  },
  {
    id: 'estado', header: 'Estado',
    cell: ({ row }) => h(UBadge, { color: row.original.estado ? 'success' : 'error', variant: 'subtle' }, () => row.original.estado ? 'Activo' : 'Inactivo')
  }
])

const movementColumns = computed<TableColumn<MovementInventory>[]>(() => [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'fecha', header: 'Fecha', cell: ({ row }) => new Date(row.original.fecha).toLocaleString('es-PE') },
  { accessorKey: 'productName', header: 'Producto' },
  {
    id: 'tipo', header: 'Tipo',
    cell: ({ row }) => h(UBadge, { color: row.original.tipo === 'entrada' ? 'success' : 'error', variant: 'subtle', class: 'capitalize' }, () => row.original.tipo)
  },
  { accessorKey: 'cantidad', header: 'Cantidad' },
  { accessorKey: 'razon', header: 'Razón' }
])

const categoryColumns = computed<TableColumn<CategoryInventory>[]>(() => [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Nombre' },
  {
    id: 'status', header: 'Estado',
    cell: ({ row }) => h(UBadge, { color: row.original.status ? 'success' : 'error', variant: 'subtle' }, () => row.original.status ? 'Activa' : 'Inactiva')
  }
])

const supplierColumns = computed<TableColumn<Supplier>[]>(() => [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'nombre', header: 'Nombre' },
  { accessorKey: 'ruc', header: 'RUC' },
  { accessorKey: 'contacto', header: 'Contacto' },
  { accessorKey: 'telefono', header: 'Teléfono' },
  {
    id: 'estado', header: 'Estado',
    cell: ({ row }) => h(UBadge, { color: row.original.estado ? 'success' : 'error', variant: 'subtle' }, () => row.original.estado ? 'Activo' : 'Inactivo')
  }
])

const isMovementModalOpen = ref(false)
const isProductModalOpen = ref(false)
const isCategoryModalOpen = ref(false)
const isSupplierModalOpen = ref(false)
const isSubmitting = ref(false)

async function handleCreateMovement(data: MovementInventoryRequest) {
  isSubmitting.value = true
  setTimeout(() => { isSubmitting.value = false; isMovementModalOpen.value = false; toast.add({ title: '¡Movimiento registrado!', color: 'success' }) }, 1000)
}
async function handleCreateProduct(data: ProductInventoryRequest) {
  isSubmitting.value = true
  setTimeout(() => { isSubmitting.value = false; isProductModalOpen.value = false; toast.add({ title: '¡Producto agregado!', color: 'success' }) }, 1000)
}
async function handleCreateCategory(data: CategoryInventoryRequest) {
  isSubmitting.value = true
  setTimeout(() => { isSubmitting.value = false; isCategoryModalOpen.value = false; toast.add({ title: '¡Categoría creada!', color: 'success' }) }, 1000)
}
async function handleCreateSupplier(data: SupplierRequest) {
  isSubmitting.value = true
  setTimeout(() => { isSubmitting.value = false; isSupplierModalOpen.value = false; toast.add({ title: '¡Proveedor agregado!', color: 'success' }) }, 1000)
}
</script>

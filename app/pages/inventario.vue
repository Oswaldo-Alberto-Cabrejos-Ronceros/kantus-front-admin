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
        <div class="flex justify-end">
          <UButton icon="i-lucide-plus" color="primary">
            Agregar Movimiento
          </UButton>
        </div>

        <UTabs :items="tabItems" class="w-full">
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

          <!-- Tabla de Movimientos -->
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
        </UTabs>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { h, resolveComponent, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { ProductInventory, MovementInventory, CategoryInventory } from '~/types'

const UBadge = resolveComponent('UBadge')

// Carga de datos de la API que creamos anteriormente
const { data: products, status: statusProducts } = await useFetch<ProductInventory[]>('/api/products-inventary')
const { data: movements, status: statusMovements } = await useFetch<MovementInventory[]>('/api/movements-inventory')
const { data: categories } = await useFetch<CategoryInventory[]>('/api/categories-inventary')

// Configuración de las pestañas
const tabItems = [
  { label: 'Stock Actual', slot: 'stock', icon: 'i-lucide-package' },
  { label: 'Movimientos', slot: 'movimientos', icon: 'i-lucide-arrow-left-right' }
]

// Columnas para ProductInventory
const stockColumns = computed<TableColumn<ProductInventory>[]>(() => [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Producto' },
  {
    id: 'category',
    header: 'Categoría',
    cell: ({ row }) => {
      const cat = categories.value?.find(c => c.id === row.original.categoryId)
      return cat ? cat.name : `Categoría ${row.original.categoryId}`
    }
  },
  { accessorKey: 'cantidad', header: 'Cantidad' },
  { accessorKey: 'unidad', header: 'Unidad' },
  {
    accessorKey: 'fechaVencimiento',
    header: 'Vencimiento',
    cell: ({ row }) => new Date(row.original.fechaVencimiento).toLocaleDateString()
  },
  {
    id: 'estado',
    header: 'Estado',
    cell: ({ row }) => {
      const isActive = row.original.estado
      return h(UBadge, { color: isActive ? 'success' : 'error', variant: 'subtle' }, () => isActive ? 'Activo' : 'Inactivo')
    }
  }
])

// Columnas para MovementInventory
const movementColumns = computed<TableColumn<MovementInventory>[]>(() => [
  { accessorKey: 'id', header: 'ID' },
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => new Date(row.original.fecha).toLocaleString()
  },
  { accessorKey: 'productName', header: 'Producto' },
  {
    id: 'tipo',
    header: 'Tipo',
    cell: ({ row }) => {
      const isEntrada = row.original.tipo === 'entrada'
      return h(UBadge, { color: isEntrada ? 'success' : 'error', variant: 'subtle', class: 'capitalize' }, () => row.original.tipo)
    }
  },
  { accessorKey: 'cantidad', header: 'Cantidad' },
  { accessorKey: 'razon', header: 'Razón' }
])
</script>

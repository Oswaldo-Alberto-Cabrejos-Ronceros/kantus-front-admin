<template>
  <UDashboardPanel id="ingresos">
    <template #header>
      <UDashboardNavbar title="Ingresos y Ventas" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>

      <!-- ── Stats dinámicas (últimas 50 ventas) ── -->
      <HomeStats :stats="summaryStats" :columns="4" />

      <!-- ── Desglose por método de pago ── -->
      <UPageGrid class="mt-6 gap-4 sm:gap-6 lg:gap-px grid-cols-2 lg:grid-cols-4">
        <UPageCard
          v-for="m in methodBreakdown"
          :key="m.key"
          variant="subtle"
          class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
          :icon="m.icon"
          :title="m.label"
          :description="m.amount"
        />
      </UPageGrid>

      <!-- ── Filtros ── -->
      <div class="mt-8 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-highlighted">Ventas</h2>
          <span class="text-xs text-muted">
            {{ searchResult?.totalElements ?? 0 }} resultado{{ (searchResult?.totalElements ?? 0) !== 1 ? 's' : '' }}
          </span>
        </div>

        <!-- Fila de filtros -->
        <div class="flex flex-wrap gap-3 items-end">
          <!-- Búsqueda por código -->
          <div class="flex-1 min-w-[200px]">
            <UInput
              v-model="filters.codigo"
              placeholder="Buscar por código de venta…"
              icon="i-lucide-search"
              :ui="{ base: 'w-full' }"
              @input="debouncedSearch"
            />
          </div>

          <!-- Filtro método de pago -->
          <USelect
            v-model="filters.metodo"
            :items="metodoOptions"
            placeholder="Todos los métodos"
            value-key="value"
            label-key="label"
            class="w-44"
            @change="resetPage"
          />

          <!-- Filtros rápidos de fecha -->
          <div class="flex gap-1">
            <UButton
              v-for="quick in quickDateFilters"
              :key="quick.key"
              size="sm"
              :variant="activeDateFilter === quick.key ? 'solid' : 'outline'"
              :color="activeDateFilter === quick.key ? 'primary' : 'neutral'"
              @click="applyDateFilter(quick.key)"
            >
              {{ quick.label }}
            </UButton>
          </div>

          <!-- Limpiar filtros -->
          <UButton
            v-if="hasActiveFilters"
            size="sm"
            variant="ghost"
            color="neutral"
            icon="i-lucide-x"
            @click="clearFilters"
          >
            Limpiar
          </UButton>
        </div>

        <!-- ── Tabla ── -->
        <UTable
          class="shrink-0"
          :data="searchResult?.content || []"
          :columns="columns"
          :loading="isSearching"
          :ui="{
            base: 'table-fixed border-separate border-spacing-0',
            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0',
            th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
            td: 'border-b border-default',
            separator: 'h-0'
          }"
        />

        <!-- ── Paginación ── -->
        <div v-if="(searchResult?.totalPages ?? 0) > 1" class="flex items-center justify-between pt-2">
          <span class="text-xs text-muted">
            Página {{ (searchResult?.page ?? 0) + 1 }} de {{ searchResult?.totalPages }}
          </span>
          <div class="flex gap-2">
            <UButton
              size="sm"
              variant="outline"
              color="neutral"
              icon="i-lucide-chevron-left"
              :disabled="filters.page === 0"
              @click="filters.page = Math.max(0, (filters.page ?? 0) - 1)"
            >
              Anterior
            </UButton>
            <UButton
              size="sm"
              variant="outline"
              color="neutral"
              trailing-icon="i-lucide-chevron-right"
              :disabled="(filters.page ?? 0) >= (searchResult?.totalPages ?? 1) - 1"
              @click="filters.page = (filters.page ?? 0) + 1"
            >
              Siguiente
            </UButton>
          </div>
        </div>
      </div>

    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { h, resolveComponent, withCtx, createTextVNode, computed, reactive, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Sale } from '~/types'
import type { SaleFilters } from '~/composables/useSales'

definePageMeta({ layout: 'admin' })

const UBadge = resolveComponent('UBadge')
const config = useRuntimeConfig()
const backendUrl = (config.public as any).apiBaseUrl ?? 'http://localhost:8080'

const { useSearchSales, useFindLatestSales } = useSales()

// ── Filtros reactivos ────────────────────────────────────────────
const filters = reactive<SaleFilters & { page: number }>({
  metodo: undefined,
  codigo: '',
  startDate: undefined,
  endDate: undefined,
  page: 0,
  size: 20
})
const activeDateFilter = ref<string | null>(null)

// ── Búsqueda paginada ────────────────────────────────────────────
const searchFilters = computed<SaleFilters>(() => ({
  metodo: filters.metodo || undefined,
  codigo: filters.codigo?.trim() || undefined,
  startDate: filters.startDate || undefined,
  endDate: filters.endDate || undefined,
  page: filters.page,
  size: filters.size
}))

const { data: searchResult, isPending: isSearching } = useSearchSales(searchFilters)

// ── Stats (últimas 50 ventas para resumen) ───────────────────────
const { data: latestSales } = useFindLatestSales(50)

const summaryStats = computed(() => {
  const sales = latestSales.value || []
  const total = sales.reduce((s, v) => s + v.monto, 0)
  const avg = sales.length ? total / sales.length : 0
  const digital = sales.filter(v => v.metodo !== 'EFECTIVO').length
  const pctDigital = sales.length ? Math.round((digital / sales.length) * 100) : 0
  return [
    { title: 'Total (últimas 50)', icon: 'i-lucide-circle-dollar-sign', value: `S/ ${fmt(total)}` },
    { title: 'Transacciones', icon: 'i-lucide-shopping-cart', value: String(sales.length) },
    { title: 'Ticket promedio', icon: 'i-lucide-wallet-minimal', value: `S/ ${fmt(avg)}` },
    { title: 'Digital vs Efectivo', icon: 'i-lucide-credit-card', value: `${pctDigital}% / ${100 - pctDigital}%` }
  ]
})

const methodBreakdown = computed(() => {
  const sales = latestSales.value || []
  const byMethod = (m: string) => sales.filter(v => v.metodo === m).reduce((s, v) => s + v.monto, 0)
  return [
    { key: 'EFECTIVO', label: 'Efectivo', icon: 'i-lucide-banknote', amount: `S/ ${fmt(byMethod('EFECTIVO'))}` },
    { key: 'YAPE', label: 'Yape', icon: 'i-lucide-smartphone', amount: `S/ ${fmt(byMethod('YAPE'))}` },
    { key: 'TARJETA', label: 'Tarjeta', icon: 'i-lucide-credit-card', amount: `S/ ${fmt(byMethod('TARJETA'))}` },
    { key: 'MERCADO_PAGO', label: 'Mercado Pago', icon: 'i-lucide-store', amount: `S/ ${fmt(byMethod('MERCADO_PAGO'))}` }
  ]
})

// ── Opciones de filtros ──────────────────────────────────────────
const metodoOptions = [
  { label: 'Todos los métodos', value: '' },
  { label: 'Efectivo', value: 'EFECTIVO' },
  { label: 'Yape', value: 'YAPE' },
  { label: 'Tarjeta', value: 'TARJETA' },
  { label: 'Mercado Pago', value: 'MERCADO_PAGO' }
]

const quickDateFilters = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Esta semana' },
  { key: 'month', label: 'Este mes' }
]

const hasActiveFilters = computed(() =>
  !!filters.metodo || !!filters.codigo?.trim() || !!filters.startDate
)

// ── Lógica de filtros ────────────────────────────────────────────
function applyDateFilter(key: string) {
  if (activeDateFilter.value === key) {
    activeDateFilter.value = null
    filters.startDate = undefined
    filters.endDate = undefined
    filters.page = 0
    return
  }
  activeDateFilter.value = key
  const now = new Date()
  const start = new Date()
  if (key === 'today') {
    start.setHours(0, 0, 0, 0)
  } else if (key === 'week') {
    start.setDate(now.getDate() - now.getDay())
    start.setHours(0, 0, 0, 0)
  } else if (key === 'month') {
    start.setDate(1)
    start.setHours(0, 0, 0, 0)
  }
  filters.startDate = start.toISOString()
  filters.endDate = now.toISOString()
  filters.page = 0
}

function clearFilters() {
  filters.metodo = undefined
  filters.codigo = ''
  filters.startDate = undefined
  filters.endDate = undefined
  filters.page = 0
  activeDateFilter.value = null
}

function resetPage() {
  filters.page = 0
}

let searchTimer: ReturnType<typeof setTimeout> | null = null
function debouncedSearch() {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { filters.page = 0 }, 400)
}

// ── Helpers de render ────────────────────────────────────────────
function fmt(value?: number) {
  return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value ?? 0)
}

const metodoBadgeColor: Record<string, string> = {
  EFECTIVO: 'success',
  YAPE: 'secondary',
  TARJETA: 'primary',
  MERCADO_PAGO: 'warning'
}
const metodoLabel: Record<string, string> = {
  EFECTIVO: 'Efectivo',
  YAPE: 'Yape',
  TARJETA: 'Tarjeta',
  MERCADO_PAGO: 'M.Pago'
}

// ── Columnas ─────────────────────────────────────────────────────
const columns = computed<TableColumn<Sale>[]>(() => [
  {
    accessorKey: 'codigo',
    header: 'Código de venta',
    cell: ({ row }) => h('span', { class: 'font-mono text-xs text-highlighted' }, row.original.codigo)
  },
  {
    accessorKey: 'fecha',
    header: 'Fecha · Hora',
    cell: ({ row }) => new Date(row.original.fecha).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })
  },
  {
    id: 'metodo',
    header: 'Método',
    cell: ({ row }) => h(UBadge,
      { color: metodoBadgeColor[row.original.metodo] ?? 'neutral', variant: 'subtle', size: 'xs' },
      { default: withCtx(() => [createTextVNode(metodoLabel[row.original.metodo] ?? row.original.metodo)]) }
    )
  },
  {
    accessorKey: 'orderCode',
    header: 'Pedido',
    cell: ({ row }) => row.original.orderCode
      ? h('span', { class: 'font-mono text-xs text-muted' }, row.original.orderCode)
      : h('span', { class: 'text-muted' }, '—')
  },
  {
    accessorKey: 'monto',
    header: 'Monto',
    cell: ({ row }) => h('span', { class: 'font-semibold text-highlighted' }, `S/ ${row.original.monto.toFixed(2)}`)
  },
  {
    id: 'comprobante',
    header: 'Comprobante',
    cell: ({ row }) => {
      if (row.original.comprobanteId) {
        // Comprobante emitido — link directo por ID
        const url = `${backendUrl}/api/comprobantes/${row.original.comprobanteId}/view`
        return h('a',
          { href: url, target: '_blank', class: 'inline-flex items-center gap-1 text-xs text-primary hover:underline' },
          [
            h(resolveComponent('UIcon'), { name: 'i-lucide-receipt', class: 'w-3.5 h-3.5' }),
            'Ver'
          ]
        )
      }
      if (row.original.orderCode) {
        // Sin comprobante emitido en el cobro — intenta buscar por pedido de todas formas
        const url = `${backendUrl}/api/comprobantes/by-order/${row.original.orderCode}/view`
        return h('a',
          { href: url, target: '_blank', class: 'inline-flex items-center gap-1 text-xs text-muted hover:text-primary hover:underline' },
          [
            h(resolveComponent('UIcon'), { name: 'i-lucide-receipt', class: 'w-3.5 h-3.5' }),
            'Buscar'
          ]
        )
      }
      return h('span', { class: 'text-xs text-muted italic' }, 'Sin comprobante')
    }
  }
])
</script>

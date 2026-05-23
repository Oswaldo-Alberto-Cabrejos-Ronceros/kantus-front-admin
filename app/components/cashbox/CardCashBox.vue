<template>
  <NuxtLink :to="`/cajas/${id}`">
    <UCard
      :ui="{ body: 'p-4', footer: 'px-4 py-3' }"
      class="hover:opacity-80 transition-opacity cursor-pointer"
      :class="status === 'CERRADA' ? 'opacity-85' : ''"
    >
      <template #header>
        <div class="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 class="text-sm font-semibold text-highlighted truncate max-w-[70%]">{{ name }}</h3>
          <UBadge :color="status === 'ABIERTA' ? 'success' : 'neutral'" variant="subtle" size="xs">
            {{ status === 'ABIERTA' ? 'Abierta' : 'Cerrada' }}
          </UBadge>
        </div>
      </template>

      <!-- ── CAJA ABIERTA ── -->
      <template v-if="status === 'ABIERTA'">
        <div class="flex flex-col gap-3 text-sm">

          <!-- Hero: efectivo físico en el cajón -->
          <div class="flex flex-col items-center py-3 rounded-lg bg-primary/5 border border-primary/10">
            <span class="text-2xl font-bold text-primary">S/ {{ fmt(currentBalance) }}</span>
            <span class="text-xs text-muted mt-0.5 flex items-center gap-1">
              <UIcon name="i-lucide-wallet-2" class="w-3 h-3" />
              efectivo en cajón
            </span>
          </div>

          <!-- Desglose de ventas del turno -->
          <div class="rounded-md border border-default px-3 py-2 flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="text-xs font-semibold text-muted uppercase tracking-wide">Ventas del turno</span>
              <span class="font-bold text-sm text-highlighted">S/ {{ fmt(collectedSales) }}</span>
            </div>
            <div class="border-t border-default pt-2 flex flex-col gap-1">
              <div class="flex justify-between text-xs text-muted">
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-banknote" class="w-3 h-3" />
                  Efectivo cobrado
                </span>
                <span class="font-medium text-default">S/ {{ fmt(efectivoCobrado) }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="flex items-center gap-1 text-info">
                  <UIcon name="i-lucide-smartphone" class="w-3 h-3" />
                  Digital (fuera de caja)
                </span>
                <span class="font-medium text-info">S/ {{ fmt(digitalBalance ?? 0) }}</span>
              </div>
            </div>
          </div>

          <!-- Monto de apertura (contexto) -->
          <div class="flex justify-between text-xs text-muted">
            <span>Abrió con</span>
            <span class="font-medium">S/ {{ fmt(openingAmount) }}</span>
          </div>
        </div>
      </template>

      <!-- ── CAJA CERRADA ── -->
      <template v-else>
        <div class="flex flex-col gap-3 text-sm">

          <!-- Total cobrado con desglose -->
          <div class="rounded-md border border-default px-3 py-2 flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="text-xs font-semibold text-muted uppercase tracking-wide">Total cobrado</span>
              <span class="font-bold text-sm text-highlighted">S/ {{ fmt(collectedSales) }}</span>
            </div>
            <div class="border-t border-default pt-2 flex flex-col gap-1">
              <div class="flex justify-between text-xs text-muted">
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-banknote" class="w-3 h-3" />
                  Efectivo
                </span>
                <span class="font-medium">S/ {{ fmt(efectivoCobrado) }}</span>
              </div>
              <div v-if="(digitalBalance ?? 0) > 0" class="flex justify-between text-xs text-info">
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-smartphone" class="w-3 h-3" />
                  Digital
                </span>
                <span class="font-medium">S/ {{ fmt(digitalBalance) }}</span>
              </div>
            </div>
          </div>

          <!-- Cierre: esperado vs contado -->
          <div class="flex flex-col gap-1.5 text-xs">
            <div class="flex justify-between text-muted">
              <span>Efectivo esperado en caja</span>
              <span class="font-medium text-default">S/ {{ fmt(currentBalance) }}</span>
            </div>
            <template v-if="closingAmount != null">
              <div class="flex justify-between text-muted">
                <span>Contado al cierre</span>
                <span class="font-semibold text-highlighted">S/ {{ fmt(closingAmount) }}</span>
              </div>
              <div
                class="flex justify-between items-center rounded px-2 py-1 font-semibold mt-0.5"
                :class="diferencia === 0
                  ? 'bg-success/10 text-success'
                  : diferencia > 0
                    ? 'bg-info/10 text-info'
                    : 'bg-error/10 text-error'"
              >
                <span>{{ diferencia === 0 ? 'Cuadre perfecto' : diferencia > 0 ? 'Sobrante' : 'Faltante' }}</span>
                <span>{{ diferencia > 0 ? '+' : diferencia < 0 ? '-' : '' }}S/ {{ fmt(Math.abs(diferencia)) }}</span>
              </div>
            </template>
            <p v-else class="italic text-muted">Sin conteo registrado al cierre</p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex items-center justify-between text-xs text-muted">
          <template v-if="status === 'ABIERTA'">
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-clock" class="w-3 h-3" />
              {{ fmtDate(openingTime) }}
            </span>
          </template>
          <template v-else>
            <span>{{ fmtDate(openingTime) }}</span>
            <span v-if="closingTime" class="flex items-center gap-1">
              <UIcon name="i-lucide-arrow-right" class="w-3 h-3" />
              {{ fmtDate(closingTime) }}
            </span>
          </template>
        </div>
      </template>
    </UCard>
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { CashBoxStatus } from '~/types'

const props = defineProps<{
  id: number | string
  name: string
  openingAmount: number
  currentBalance: number
  collectedSales: number
  closingAmount?: number
  digitalBalance?: number
  openingTime: string | Date
  closingTime?: string | Date
  status: CashBoxStatus
}>()

/** Ventas cobradas en efectivo (bruto, antes de vuelto). */
const efectivoCobrado = computed(() =>
  Math.max(0, props.collectedSales - (props.digitalBalance ?? 0))
)

/** Diferencia conteo físico vs esperado al cierre. */
const diferencia = computed(() => {
  if (props.closingAmount == null) return 0
  return props.closingAmount - props.currentBalance
})

function fmt(value?: number) {
  return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value ?? 0)
}

function fmtDate(dateValue: string | Date) {
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateValue))
}
</script>

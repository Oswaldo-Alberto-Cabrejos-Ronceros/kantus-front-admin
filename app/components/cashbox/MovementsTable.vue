<template>
  <div class="movements-table-wrapper">
    <!-- Loading skeleton -->
    <div v-if="loading" class="flex items-center justify-center py-12 text-muted text-sm gap-2">
      <UIcon name="i-lucide-loader-circle" class="w-4 h-4 animate-spin" />
      Cargando movimientos...
    </div>

    <!-- Empty state -->
    <div v-else-if="!movements?.length" class="text-center py-12 text-muted text-sm">
      No hay movimientos registrados
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto rounded-lg border border-default">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="bg-elevated/60 text-muted text-xs uppercase tracking-wider">
            <!-- expand toggle column (narrow) -->
            <th class="w-8 px-2 py-2 border-b border-default" />
            <th class="px-3 py-2 border-b border-default text-left font-semibold">Fecha · Hora</th>
            <th class="px-3 py-2 border-b border-default text-left font-semibold">Pedido</th>
            <th class="px-3 py-2 border-b border-default text-left font-semibold">Método</th>
            <th class="px-3 py-2 border-b border-default text-left font-semibold">Descripción</th>
            <th class="px-3 py-2 border-b border-default text-left font-semibold">Tipo</th>
            <th class="px-3 py-2 border-b border-default text-right font-semibold">Monto</th>
            <th class="w-8 px-2 py-2 border-b border-default" />
          </tr>
        </thead>
        <tbody>
          <template v-for="group in groupedMovements" :key="group.id">
            <!-- ── Main row ── -->
            <tr
              class="transition-colors"
              :class="[
                group.vuelto ? 'cursor-pointer hover:bg-elevated/30' : 'hover:bg-elevated/20',
                isExpanded(group.id) ? 'bg-elevated/20' : ''
              ]"
              @click="group.vuelto ? toggleExpand(group.id) : undefined"
            >
              <!-- Expand toggle -->
              <td class="w-8 px-2 py-2.5 border-b border-default text-center">
                <button
                  v-if="group.vuelto"
                  class="inline-flex items-center justify-center w-5 h-5 rounded text-warning hover:bg-warning/10 transition-colors"
                  :title="isExpanded(group.id) ? 'Ocultar vuelto' : 'Ver vuelto'"
                  type="button"
                  @click.stop="toggleExpand(group.id)"
                >
                  <UIcon
                    :name="isExpanded(group.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                    class="w-3.5 h-3.5"
                  />
                </button>
              </td>

              <!-- Fecha -->
              <td class="px-3 py-2.5 border-b border-default text-muted text-xs whitespace-nowrap">
                {{ formatDate(group.main) }}
              </td>

              <!-- Pedido -->
              <td class="px-3 py-2.5 border-b border-default">
                <span v-if="group.main.codigoPedidos" class="font-mono text-xs text-highlighted">
                  {{ group.main.codigoPedidos }}
                </span>
                <span v-else class="text-muted text-xs">—</span>
              </td>

              <!-- Método -->
              <td class="px-3 py-2.5 border-b border-default">
                <component :is="metodoBadge(group.main.metodoPago)" />
              </td>

              <!-- Descripción -->
              <td class="px-3 py-2.5 border-b border-default max-w-xs">
                <span :title="group.main.descripcion" class="text-xs text-muted line-clamp-1">
                  {{ group.main.descripcion }}
                </span>
              </td>

              <!-- Tipo -->
              <td class="px-3 py-2.5 border-b border-default">
                <div class="flex items-center gap-1.5">
                  <UBadge
                    :color="group.main.tipo === 'INGRESO' ? 'success' : 'error'"
                    variant="subtle"
                    size="xs"
                  >
                    {{ group.main.tipo }}
                  </UBadge>
                  <!-- Indicador de que tiene vuelto -->
                  <span
                    v-if="group.vuelto"
                    class="inline-flex items-center gap-0.5 text-warning text-xs font-medium"
                    title="Este ingreso tiene vuelto asociado"
                  >
                    <UIcon name="i-lucide-arrow-down-left" class="w-3 h-3" />
                    vuelto
                  </span>
                </div>
              </td>

              <!-- Monto -->
              <td class="px-3 py-2.5 border-b border-default text-right">
                <span :class="group.main.tipo === 'INGRESO' ? 'text-success font-semibold' : 'text-error font-semibold'">
                  {{ group.main.tipo === 'INGRESO' ? '+' : '−' }}S/ {{ group.main.monto.toFixed(2) }}
                </span>
              </td>

              <!-- Boleta -->
              <td class="w-8 px-2 py-2.5 border-b border-default text-center">
                <a
                  v-if="group.main.codigoPedidos"
                  :href="`${backendUrl}/api/comprobantes/by-order/${group.main.codigoPedidos}/view`"
                  target="_blank"
                  title="Ver comprobante"
                  class="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-elevated text-muted hover:text-primary transition-colors"
                  @click.stop
                >
                  <UIcon name="i-lucide-receipt" class="w-4 h-4" />
                </a>
              </td>
            </tr>

            <!-- ── Vuelto sub-row (collapsible) ── -->
            <Transition name="vuelto-row">
              <tr v-if="group.vuelto && isExpanded(group.id)" class="bg-warning/5">
                <!-- indent spacer -->
                <td class="border-b border-warning/20 border-dashed" />
                <!-- indent left border indicator -->
                <td colspan="6" class="px-3 py-2 border-b border-warning/20 border-dashed">
                  <div class="flex items-center gap-4 pl-3 border-l-2 border-warning/40">
                    <span class="text-xs text-muted whitespace-nowrap">{{ formatDate(group.vuelto) }}</span>
                    <UBadge color="warning" variant="subtle" size="xs" icon="i-lucide-arrow-down-left">
                      VUELTO
                    </UBadge>
                    <span class="text-xs text-muted flex-1 truncate" :title="group.vuelto.descripcion">
                      {{ group.vuelto.descripcion }}
                    </span>
                    <span class="text-error font-semibold text-sm whitespace-nowrap">
                      −S/ {{ group.vuelto.monto.toFixed(2) }}
                    </span>
                  </div>
                </td>
                <td class="border-b border-warning/20 border-dashed" />
              </tr>
            </Transition>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, resolveComponent, h } from 'vue'
import type { MovementCashbox } from '~/types'

const props = defineProps<{
  movements?: MovementCashbox[]
  loading?: boolean
  backendUrl?: string
}>()

const config = useRuntimeConfig()
const backendUrl = computed(() => props.backendUrl ?? (config.public as any).apiBaseUrl ?? 'http://localhost:8080')

// ── Expand state ─────────────────────────────────────────────────
const expandedIds = ref<Set<string>>(new Set())

function toggleExpand(id: string) {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
}

function isExpanded(id: string) {
  return expandedIds.value.has(id)
}

// ── Grouping logic ───────────────────────────────────────────────
interface MovementGroup {
  id: string
  main: MovementCashbox
  vuelto?: MovementCashbox
}

/**
 * Agrupa movimientos: empareja cada INGRESO con su EGRESO de vuelto (si existe).
 * Un vuelto se identifica por: mismo codigoPedidos + descripción empieza con "Vuelto".
 */
const groupedMovements = computed((): MovementGroup[] => {
  // Sort ascending by id so INGRESO always precedes its EGRESO vuelto before grouping
  const list = [...(props.movements ?? [])].sort((a, b) => Number(a.id) - Number(b.id))
  const groups: MovementGroup[] = []
  const usedIds = new Set<number | string>()

  for (const m of list) {
    if (usedIds.has(m.id)) continue

    if (m.tipo === 'INGRESO' && m.codigoPedidos) {
      // Buscar vuelto: EGRESO del mismo pedido cuya descripción empiece con "Vuelto"
      const vuelto = list.find(v =>
        !usedIds.has(v.id) &&
        v.tipo === 'EGRESO' &&
        v.codigoPedidos === m.codigoPedidos &&
        v.descripcion?.startsWith('Vuelto')
      )

      groups.push({ id: String(m.id), main: m, vuelto })
      usedIds.add(m.id)
      if (vuelto) usedIds.add(vuelto.id)
    } else {
      groups.push({ id: String(m.id), main: m })
      usedIds.add(m.id)
    }
  }

  // Re-sort groups so most recent appears first (groups were built ascending)
  return groups.reverse()
})

// ── Helpers ──────────────────────────────────────────────────────
function formatDate(m: MovementCashbox) {
  const dia = typeof m.dia === 'string' ? m.dia : new Date(m.dia).toLocaleDateString('es-PE')
  const hora = (m.hora || '').substring(0, 5)
  return `${dia} ${hora}`
}

const UBadge = resolveComponent('UBadge')

function metodoBadge(metodo?: string) {
  if (!metodo) return h('span', { class: 'text-muted text-xs' }, '—')
  const colors: Record<string, string> = {
    EFECTIVO: 'success', YAPE: 'secondary', TARJETA: 'primary', MERCADO_PAGO: 'warning'
  }
  const labels: Record<string, string> = {
    EFECTIVO: 'Efectivo', YAPE: 'Yape', TARJETA: 'Tarjeta', MERCADO_PAGO: 'M.Pago'
  }
  return h(UBadge, { color: colors[metodo] ?? 'neutral', variant: 'subtle', size: 'xs' }, {
    default: () => labels[metodo] ?? metodo
  })
}
</script>

<style scoped>
/* Animación de la sub-fila de vuelto */
.vuelto-row-enter-active,
.vuelto-row-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.vuelto-row-enter-from,
.vuelto-row-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

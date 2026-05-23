<template>
  <UDashboardPanel id="caja">
    <template #header>
      <UDashboardNavbar :title="cashBox?.name || 'Caja'">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <div class="flex items-center gap-3">
            <UBadge
              :color="isCashboxOpen ? 'success' : 'neutral'"
              variant="subtle"
              class="text-sm font-medium"
            >
              {{ isCashboxOpen ? 'Abierta' : 'Cerrada' }}
            </UBadge>

            <UModal v-model:open="isOpenModalOpen" title="Abrir Caja">
              <UButton v-if="!isCashboxOpen" icon="i-lucide-unlock" color="primary">
                Abrir Caja
              </UButton>
              <template #body>
                <CashboxFormOpenCashbox :loading="isSubmitting" @submit="handleOpenCashbox" @cancel="isOpenModalOpen = false" />
              </template>
            </UModal>

            <UModal v-model:open="isCloseModalOpen" title="Cerrar Caja">
              <UButton v-if="isCashboxOpen" icon="i-lucide-lock" color="error">
                Cerrar Caja
              </UButton>
              <template #body>
                <CashboxFormCloseCashbox
                  :loading="isSubmitting"
                  :opening-amount="cashBox?.openingAmount"
                  :collected-sales="cashBox?.collectedSales"
                  :current-balance="cashBox?.currentBalance"
                  :total-egresos="totalEgresos"
                  @submit="handleCloseCashbox"
                  @cancel="isCloseModalOpen = false"
                />
              </template>
            </UModal>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- ── 6 métricas financieras ── -->
      <HomeStats :stats="cashboxStats" :columns="3" />

      <!-- ── Reconciliación financiera ── -->
      <div class="mt-6 rounded-xl border border-default bg-elevated/40 px-5 py-4">
        <p class="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Cuadre de caja (efectivo)</p>
        <div class="flex flex-col gap-1.5 text-sm">
          <div class="flex justify-between text-muted">
            <span>Apertura</span>
            <span class="font-medium text-default">+ S/ {{ fmt(cashBox?.openingAmount) }}</span>
          </div>
          <div class="flex justify-between text-muted">
            <span>Cobros en efectivo</span>
            <span class="font-medium text-success">+ S/ {{ fmt(efectivoCobrado) }}</span>
          </div>
          <div v-if="totalEgresosEfectivo > 0" class="flex justify-between text-muted">
            <span>Egresos / vueltos</span>
            <span class="font-medium text-error">− S/ {{ fmt(totalEgresosEfectivo) }}</span>
          </div>
          <div class="border-t border-default mt-1 pt-2 flex justify-between font-semibold text-highlighted">
            <span>Efectivo esperado en caja</span>
            <span>S/ {{ fmt(cashBox?.currentBalance) }}</span>
          </div>
          <!-- Si hay conteo al cierre -->
          <template v-if="cashBox?.closingAmount != null">
            <div class="flex justify-between text-muted">
              <span>Contado al cierre</span>
              <span class="font-semibold text-highlighted">S/ {{ fmt(cashBox?.closingAmount) }}</span>
            </div>
            <div
              class="mt-1 flex justify-between items-center rounded-lg px-3 py-2 font-bold text-sm"
              :class="diferenciaCierre === 0
                ? 'bg-success/10 text-success'
                : diferenciaCierre > 0
                  ? 'bg-info/10 text-info'
                  : 'bg-error/10 text-error'"
            >
              <span class="flex items-center gap-1.5">
                <UIcon
                  :name="diferenciaCierre === 0 ? 'i-lucide-check-circle-2' : diferenciaCierre > 0 ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
                  class="w-4 h-4"
                />
                {{ diferenciaCierre === 0 ? 'Cuadre perfecto' : diferenciaCierre > 0 ? 'Sobrante' : 'Faltante' }}
              </span>
              <span>{{ diferenciaCierre > 0 ? '+' : diferenciaCierre < 0 ? '-' : '' }}S/ {{ fmt(Math.abs(diferenciaCierre)) }}</span>
            </div>
          </template>
          <!-- Digital (informativo, no entra a caja) -->
          <div v-if="(cashBox?.digitalBalance ?? 0) > 0" class="mt-2 flex justify-between items-center rounded-lg bg-info/5 border border-info/20 px-3 py-2 text-xs text-info">
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-smartphone" class="w-3.5 h-3.5" />
              Digital (Yape · Tarjeta · M.Pago — fuera del cajón)
            </span>
            <span class="font-semibold">S/ {{ fmt(cashBox?.digitalBalance) }}</span>
          </div>
        </div>
      </div>

      <!-- ── Tabla de movimientos ── -->
      <div class="mt-8 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold leading-none">Movimientos</h2>
          <div class="flex items-center gap-2 text-xs text-muted">
            <span class="flex items-center gap-1 text-success">
              <UIcon name="i-lucide-arrow-up-circle" class="w-3.5 h-3.5" /> Ingresos: S/ {{ fmt(totalIngresos) }}
            </span>
            <span class="text-default">·</span>
            <span class="flex items-center gap-1 text-error">
              <UIcon name="i-lucide-arrow-down-circle" class="w-3.5 h-3.5" /> Egresos: S/ {{ fmt(totalEgresos) }}
            </span>
          </div>
        </div>

        <CashboxMovementsTable :movements="movements || []" :loading="isPending" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { OpenCashboxRequest, CloseCashboxRequest } from '~/utils/validations'

const route = useRoute()
const cashBoxId = computed(() => Number(route.params.id))

definePageMeta({
  middleware: [
    (to) => {
      const { user } = useAuth()
      if (user.value?.role === 'CAJERO') {
        to.meta.layout = 'cashier'
      } else {
        to.meta.layout = 'admin'
      }
    }
  ]
})

const { user } = useAuth()
const userId = computed(() => Number(user.value?.id) || 0)

const toast = useToast()

const { useFindCashBoxMovements, useOpenCashBox, useCloseCashBox, useFindOneCashBox } = useCashBoxes()
const { useFindEmployeeByUserId } = useEmployees()

const { data: cashBox } = useFindOneCashBox(cashBoxId)
const { data: movements, isPending } = useFindCashBoxMovements(cashBoxId)
const { data: employee } = useFindEmployeeByUserId(userId)
const employeeId = computed(() => Number(employee.value?.id) || 0)

const openMutation = useOpenCashBox()
const closeMutation = useCloseCashBox()

const isCashboxOpen = computed(() => cashBox.value?.status === 'ABIERTA')

// ── Agregados financieros ────────────────────────────────────────
const totalIngresos = computed(() =>
  (movements.value || []).filter(m => m.tipo === 'INGRESO').reduce((sum, m) => sum + m.monto, 0)
)
const totalEgresos = computed(() =>
  (movements.value || []).filter(m => m.tipo === 'EGRESO').reduce((sum, m) => sum + m.monto, 0)
)
const totalEgresosEfectivo = computed(() => {
  // Aproximación: egresos = diferencia entre lo que debería ser y lo que es
  // openingAmount + efectivoCobrado - currentBalance
  const expected = (cashBox.value?.openingAmount ?? 0) + efectivoCobrado.value
  const actual = cashBox.value?.currentBalance ?? 0
  return Math.max(0, expected - actual)
})
const efectivoCobrado = computed(() =>
  Math.max(0, (cashBox.value?.collectedSales ?? 0) - (cashBox.value?.digitalBalance ?? 0))
)
const diferenciaCierre = computed(() => {
  if (cashBox.value?.closingAmount == null) return 0
  return cashBox.value.closingAmount - (cashBox.value?.currentBalance ?? 0)
})

// ── Stats ────────────────────────────────────────────────────────
const cashboxStats = computed(() => [
  {
    title: 'Efectivo en caja',
    icon: 'i-lucide-wallet-2',
    value: `S/ ${fmt(cashBox.value?.currentBalance)}`
  },
  {
    title: 'Total ventas',
    icon: 'i-lucide-trending-up',
    value: `S/ ${fmt(cashBox.value?.collectedSales)}`
  },
  {
    title: 'Pagos digitales',
    icon: 'i-lucide-smartphone',
    value: `S/ ${fmt(cashBox.value?.digitalBalance ?? 0)}`
  },
  {
    title: 'Cobros en efectivo',
    icon: 'i-lucide-banknote',
    value: `S/ ${fmt(efectivoCobrado.value)}`
  },
  {
    title: 'Apertura con',
    icon: 'i-lucide-unlock',
    value: `S/ ${fmt(cashBox.value?.openingAmount)}`
  },
  {
    title: 'Total movimientos',
    icon: 'i-lucide-list',
    value: String(movements.value?.length ?? 0)
  }
])

// ── Helpers ──────────────────────────────────────────────────────
function fmt(value?: number | null) {
  return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value ?? 0)
}

// ── Modal state ──────────────────────────────────────────────────
const isOpenModalOpen = ref(false)
const isCloseModalOpen = ref(false)
const isSubmitting = ref(false)

// ── Acciones ─────────────────────────────────────────────────────
async function handleOpenCashbox(data: OpenCashboxRequest) {
  isSubmitting.value = true
  try {
    await openMutation.mutateAsync({
      name: data.name,
      openingAmount: data.openingAmount,
      employeeId: employeeId.value
    })
    isOpenModalOpen.value = false
    toast.add({ title: 'Caja abierta correctamente', color: 'success' })
  } catch {
    toast.add({ title: 'Error al abrir caja', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

async function handleCloseCashbox(data: CloseCashboxRequest) {
  isSubmitting.value = true
  try {
    await closeMutation.mutateAsync({ id: cashBoxId.value, closingAmount: data.closingAmount })
    isCloseModalOpen.value = false
    toast.add({ title: 'Caja cerrada correctamente', color: 'success' })
  } catch {
    toast.add({ title: 'Error al cerrar caja', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UForm
    :schema="processDeliveryOrderSchema"
    :state="state"
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <!-- Header -->
    <div class="flex justify-between items-center pb-2 border-b border-default">
      <h2 class="text-xl font-bold text-highlighted">
        {{ order.customerName || 'Cliente' }}
      </h2>
      <UBadge :color="statusColor" variant="subtle">
        {{ statusDisplay }}
      </UBadge>
    </div>

    <!-- Alerta: pedido aún en preparación -->
    <div
      v-if="isBeingPrepared"
      class="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-3 text-sm text-warning"
    >
      <UIcon name="i-lucide-clock" class="w-4 h-4 mt-0.5 shrink-0" />
      <span>
        El pedido todavía <strong>está siendo preparado en cocina</strong>. Podrás marcarlo
        En Camino una vez que esté listo.
      </span>
    </div>

    <!-- Delivery Info -->
    <div class="flex flex-col gap-3">
      <h3 class="text-sm font-semibold text-muted uppercase tracking-wider">
        Detalles del pedido
      </h3>
      <div class="space-y-2 text-sm">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-muted shrink-0" />
          <span>{{ order.address }}</span>
        </div>
        <div v-if="order.customerPhone" class="flex items-center gap-2">
          <UIcon name="i-lucide-phone" class="w-4 h-4 text-muted shrink-0" />
          <span>{{ order.customerPhone }}</span>
        </div>
        <div v-if="order.customerEmail" class="flex items-center gap-2">
          <UIcon name="i-lucide-mail" class="w-4 h-4 text-muted shrink-0" />
          <span>{{ order.customerEmail }}</span>
        </div>
      </div>

      <!-- Products -->
      <div v-if="order.products?.length" class="mt-2 flex flex-col gap-2">
        <h4 class="text-xs font-semibold text-muted uppercase">Productos</h4>
        <UPageCard
          v-for="product in order.products"
          :key="product.id"
          :title="product.name"
          :description="`${formatPrice(product.priceUnitary)} x ${product.quantity}`"
          orientation="horizontal"
        >
          <div class="flex h-full items-center justify-end p-4 text-lg font-bold text-primary">
            {{ formatPrice(product.priceUnitary * product.quantity) }}
          </div>
        </UPageCard>
      </div>
    </div>

    <!-- Cobro — solo cuando se marca como Entregado -->
    <template v-if="canProcessPayment">
      <div class="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col gap-4">
        <h3 class="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <UIcon name="i-lucide-banknote" class="w-4 h-4" />
          Cobro al entregar
        </h3>

        <!-- Método elegido por el cliente (solo lectura) -->
        <div class="flex items-center gap-3">
          <span class="text-sm text-muted">Método de pago:</span>
          <UBadge :color="paymentMethodColor" variant="soft" :icon="paymentMethodIcon">
            {{ paymentMethodLabel }}
          </UBadge>
        </div>

        <!-- Monto recibido — solo para efectivo -->
        <template v-if="isEfectivo">
          <UFormField label="Monto Recibido (S/)" name="amountReceived">
            <UInput
              v-model.number="state.amountReceived"
              type="number"
              min="0"
              step="0.5"
              :placeholder="`Mín. ${formatPrice(order.totalPrice)}`"
              icon="i-lucide-banknote"
            />
          </UFormField>
          <div
            v-if="vuelto !== null && vuelto >= 0"
            class="flex justify-between items-center rounded-lg border border-success/30 bg-success/10 px-4 py-3"
          >
            <span class="font-semibold text-success">Vuelto:</span>
            <span class="text-xl font-bold text-success">{{ formatPrice(vuelto) }}</span>
          </div>
          <p v-else-if="state.amountReceived && state.amountReceived < order.totalPrice" class="text-center text-sm text-error">
            El monto recibido es menor al total
          </p>
        </template>
      </div>

      <!-- Comprobante -->
      <div class="rounded-xl border border-default bg-elevated/20 p-4">
        <div class="flex items-center gap-2 text-sm font-semibold text-highlighted mb-1">
          <UIcon name="i-lucide-receipt" class="w-4 h-4 text-primary" />
          Comprobante
        </div>
        <p class="text-xs text-muted mb-3">La boleta se genera automáticamente. Completa solo si el cliente necesita datos impresos.</p>
        <div class="flex flex-col gap-3">
          <UFormField label="Tipo" name="comprobante.tipo">
            <URadioGroup
              v-model="comprobanteState.tipo"
              orientation="horizontal"
              :items="comprobanteTypes"
              class="w-full"
            />
          </UFormField>
          <UFormField
            :label="comprobanteState.tipo === 'BOLETA' ? 'Nombre (opcional)' : 'Razón social'"
            name="comprobante.clienteNombre"
          >
            <UInput
              v-model="comprobanteState.clienteNombre"
              :placeholder="comprobanteState.tipo === 'BOLETA' ? 'Público General' : 'Ej. Empresa SAC'"
              icon="i-lucide-user"
            />
          </UFormField>
          <UFormField
            :label="comprobanteState.tipo === 'BOLETA' ? 'DNI (opcional)' : 'RUC'"
            name="comprobante.clienteDocumento"
          >
            <UInput
              v-model="comprobanteState.clienteDocumento"
              :placeholder="comprobanteState.tipo === 'BOLETA' ? '00000000' : '20123456789'"
              :maxlength="comprobanteState.tipo === 'BOLETA' ? 8 : 11"
              icon="i-lucide-id-card"
            />
          </UFormField>
        </div>
      </div>
    </template>

    <!-- Footer -->
    <div class="flex justify-between items-center border-t border-default pt-4 gap-3 flex-wrap">
      <div class="text-2xl font-bold text-highlighted">
        Total: <span class="text-primary">{{ formatPrice(order.totalPrice) }}</span>
      </div>
      <div class="flex items-center gap-3 ml-auto">
        <UButton
          v-if="order.customerPhone"
          color="success"
          variant="soft"
          icon="i-lucide-message-circle"
          size="sm"
          :href="`https://wa.me/51${order.customerPhone}`"
          target="_blank"
        >
          WhatsApp
        </UButton>
        <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
          Cancelar
        </UButton>
        <UButton
          v-if="nextStatus"
          type="submit"
          color="primary"
          :loading="loading"
          :icon="canProcessPayment ? 'i-lucide-banknote' : 'i-lucide-truck'"
        >
          {{ updateButtonText }}
        </UButton>
      </div>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive, watch, computed } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { OrderDelivery, OrderDeliveryStatus, ComprobanteType } from '~/types'
import { processDeliveryOrderSchema, type ProcessDeliveryOrderRequest } from '~/utils/validations'

const props = defineProps<{ loading?: boolean; order: OrderDelivery }>()
const emit = defineEmits<{ submit: [data: ProcessDeliveryOrderRequest]; cancel: [] }>()

const comprobanteTypes = [
  { label: 'Boleta', value: 'BOLETA' as ComprobanteType },
  { label: 'Factura', value: 'FACTURA' as ComprobanteType }
]

const comprobanteState = reactive({
  tipo: 'BOLETA' as ComprobanteType,
  clienteNombre: '',
  clienteDocumento: ''
})

// ─── Status logic ────────────────────────────────────────────────────
// Solo puede ir a Camino si el pedido ya está LISTO (preparado por cocina)
const isBeingPrepared = computed(() =>
  ['Pendiente', 'PENDIENTE', 'PREPARANDO', 'Preparando'].includes(props.order.status)
)

const nextStatus = computed<OrderDeliveryStatus | null>(() => {
  // Pendiente / Preparando → no puede moverse todavía
  if (isBeingPrepared.value) return null
  if (['Listo', 'LISTO'].includes(props.order.status)) return 'Camino'
  if (props.order.status === 'Camino') return 'Entregado'
  return null
})

const canProcessPayment = computed(() => nextStatus.value === 'Entregado')

const statusColor = computed(() => {
  const c: Record<string, 'warning' | 'info' | 'success'> = {
    Pendiente: 'warning', PENDIENTE: 'warning',
    PREPARANDO: 'warning', Preparando: 'warning',
    Listo: 'success', LISTO: 'success',
    Camino: 'info', CAMINO: 'info',
    Entregado: 'success', ENTREGADO: 'success'
  }
  return c[props.order.status] || 'neutral'
})

const statusDisplay = computed(() => {
  const d: Record<string, string> = {
    Pendiente: 'Pendiente', PENDIENTE: 'Pendiente',
    PREPARANDO: 'Preparando', Preparando: 'Preparando',
    Listo: 'Listo', LISTO: 'Listo',
    Camino: 'En Camino', CAMINO: 'En Camino',
    Entregado: 'Entregado', ENTREGADO: 'Entregado'
  }
  return d[props.order.status] || props.order.status
})

// ─── Payment method (pre-selected from client order) ─────────────────
/** Método que eligió el cliente al hacer el pedido (backend format: EFECTIVO, TARJETA, etc.) */
const orderPaymentMethod = computed(() =>
  (props.order.paymentMethod || 'EFECTIVO').toUpperCase()
)

const isEfectivo = computed(() => orderPaymentMethod.value === 'EFECTIVO')

const paymentMethodLabel = computed(() => {
  const labels: Record<string, string> = {
    EFECTIVO: 'Efectivo', TARJETA: 'Tarjeta',
    YAPE: 'Yape', MERCADO_PAGO: 'Mercado Pago'
  }
  return labels[orderPaymentMethod.value] ?? orderPaymentMethod.value
})

const paymentMethodIcon = computed(() => {
  const icons: Record<string, string> = {
    EFECTIVO: 'i-lucide-banknote', TARJETA: 'i-lucide-credit-card',
    YAPE: 'i-lucide-smartphone', MERCADO_PAGO: 'i-lucide-smartphone'
  }
  return icons[orderPaymentMethod.value] ?? 'i-lucide-banknote'
})

const paymentMethodColor = computed(() => {
  return orderPaymentMethod.value === 'EFECTIVO' ? 'success' : 'primary'
})

// ─── Form state ───────────────────────────────────────────────────────
const getNextStatusValue = (status: string): 'Pendiente' | 'Camino' | 'Entregado' => {
  if (['Listo', 'LISTO'].includes(status)) return 'Camino'
  if (status === 'Camino') return 'Entregado'
  return 'Pendiente'
}

const state = reactive<ProcessDeliveryOrderRequest>({
  orderId: props.order.id,
  status: getNextStatusValue(props.order.status),
  paymentMethod: (props.order.paymentMethod ?? 'EFECTIVO') as any,
  amountReceived: undefined
})

watch(() => props.order, (o) => {
  state.orderId = o.id
  state.status = getNextStatusValue(o.status)
  state.paymentMethod = (o.paymentMethod ?? 'EFECTIVO') as any
  state.amountReceived = undefined
})

const vuelto = computed(() => {
  if (!state.amountReceived || state.amountReceived < props.order.totalPrice) return null
  return state.amountReceived - props.order.totalPrice
})

const updateButtonText = computed(() => {
  if (['Listo', 'LISTO'].includes(props.order.status)) return 'Marcar como En Camino'
  if (props.order.status === 'Camino') return 'Cobrar y Entregar'
  return 'Actualizar'
})

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}

async function onSubmit(event: FormSubmitEvent<ProcessDeliveryOrderRequest>) {
  const data: ProcessDeliveryOrderRequest = { ...event.data }
  if (canProcessPayment.value) {
    data.comprobante = {
      tipo: comprobanteState.tipo,
      clienteNombre: comprobanteState.clienteNombre || undefined,
      clienteDocumento: comprobanteState.clienteDocumento || undefined
    }
  }
  emit('submit', data)
}
</script>

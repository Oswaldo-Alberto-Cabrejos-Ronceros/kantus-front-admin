<template>
  <UForm
    :schema="processOrderSchema"
    :state="state"
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <div class="flex justify-between items-center pb-2 border-b border-default">
      <h2 class="text-xl font-bold text-highlighted">
        {{ tableName || 'Sin mesa' }}
        <span v-if="order.customerName" class="text-muted font-normal text-lg">
          — {{ order.customerName }}
        </span>
      </h2>
      <UBadge :color="statusColor" variant="subtle">
        {{ statusDisplay }}
      </UBadge>
    </div>

    <!-- Customer Info -->
    <div v-if="order.customerName" class="flex items-center gap-2 text-sm text-muted bg-elevated/30 p-3 rounded-lg border border-default">
      <UIcon name="i-lucide-user" class="w-4 h-4 text-primary" />
      <span class="font-medium text-highlighted">Cliente:</span>
      <span>{{ order.customerName }}</span>
    </div>

    <!-- Status change (for Mozo/Chef) -->
     <!--     <div v-if="canChangeStatus && nextStatusInfo" class="space-y-2">
      <h3 class="text-sm font-semibold text-muted uppercase tracking-wider">
        Cambiar Estado
      </h3>
      <UButton
        size="sm"
        :color="nextStatusInfo.color"
        :icon="nextStatusInfo.icon"
        @click="emit('changeStatus', order.id, nextStatus!)"
      >
        {{ nextStatusInfo.label }}
      </UButton>
    </div> -->

    <div class="flex flex-col gap-3">
      <h3 class="text-sm font-semibold text-muted uppercase tracking-wider">
        Productos
      </h3>
      <UPageCard
        v-for="product in (order.products || [])"
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

    <!-- Payment section (only when order is Listo or Entregado) -->
    <template v-if="canProcessPayment">
      <UFormField label="Método de Pago" name="paymentMethod">
        <URadioGroup
          v-model="state.paymentMethod"
          orientation="horizontal"
          variant="list"
          :items="saleMethods"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Propina (Opcional)" name="tip" class="mt-4">
        <UInput
          v-model.number="state.tip"
          type="number"
          min="0"
          step="0.5"
          placeholder="0.00"
          icon="i-lucide-coins"
        />
      </UFormField>

      <!-- Vuelto — solo cuando el método es efectivo -->
      <template v-if="state.paymentMethod === 'EFECTIVO'">
        <UFormField label="Monto Recibido (S/)" class="mt-2">
          <UInput
            v-model.number="state.amountReceived"
            type="number"
            min="0"
            step="0.5"
            :placeholder="`Mín. ${formatPrice(total)}`"
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
        <p v-else-if="state.amountReceived && state.amountReceived < total" class="text-center text-sm text-error">
          El monto recibido es menor al total
        </p>
        <!-- Warning: vuelto supera el efectivo disponible en caja -->
        <div
          v-if="insufficientCash"
          class="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2.5 text-sm text-warning"
        >
          <UIcon name="i-lucide-triangle-alert" class="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            El vuelto <strong>({{ formatPrice(vuelto!) }})</strong> supera el efectivo disponible en caja
            <strong>({{ formatPrice(cashBalance ?? 0) }})</strong>. Verifica que haya billetes suficientes.
          </span>
        </div>
        <!-- Aviso de auditoría -->
        <p class="flex items-center gap-1.5 text-xs text-muted mt-1">
          <UIcon name="i-lucide-shield-check" class="w-3.5 h-3.5 text-primary shrink-0" />
          Tu nombre quedará registrado en este cobro para fines de auditoría.
        </p>
      </template>
    </template>

    <!-- Sección de comprobante (opcional) — visible solo cuando se puede cobrar -->
    <template v-if="canProcessPayment">
      <div class="rounded-xl border border-default bg-elevated/20 p-4 mt-2">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2 text-sm font-semibold text-highlighted">
            <UIcon name="i-lucide-receipt" class="w-4 h-4 text-primary" />
            Comprobante
          </div>
          <UButton
            size="xs"
            :color="wantsComprobante ? 'primary' : 'neutral'"
            :variant="wantsComprobante ? 'soft' : 'ghost'"
            :icon="wantsComprobante ? 'i-lucide-check-circle' : 'i-lucide-plus-circle'"
            @click="wantsComprobante = !wantsComprobante"
          >
            {{ wantsComprobante ? 'Solicitado' : 'Solicitar' }}
          </UButton>
        </div>

        <p class="text-xs text-muted mb-3">La boleta se genera automáticamente. Completa los datos solo si el cliente los necesita impresos.</p>
        <div class="flex flex-col gap-3">
          <UFormField label="Tipo" name="comprobante.tipo">
            <URadioGroup
              v-model="comprobanteState.tipo"
              orientation="horizontal"
              :items="comprobanteTypes"
              class="w-full"
            />
          </UFormField>
          <UFormField :label="comprobanteState.tipo === 'BOLETA' ? 'Nombre (opcional)' : 'Razón social'" name="comprobante.clienteNombre">
            <UInput
              v-model="comprobanteState.clienteNombre"
              :placeholder="comprobanteState.tipo === 'BOLETA' ? 'Público General' : 'Ej. Empresa SAC'"
              icon="i-lucide-user"
            />
          </UFormField>
          <UFormField :label="comprobanteState.tipo === 'BOLETA' ? 'DNI (opcional)' : 'RUC'" name="comprobante.clienteDocumento">
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

    <div class="flex justify-between items-center mt-2 border-t border-default pt-4">
      <div class="flex flex-col">
        <div v-if="state.tip" class="text-sm text-muted mb-1">
          Subtotal: {{ formatPrice(subtotal) }} <br>
          Propina: {{ formatPrice(state.tip) }}
        </div>
        <div class="text-2xl font-bold text-highlighted">
          Total: <span class="text-primary">{{ formatPrice(total) }}</span>
        </div>
      </div>
      <div class="flex gap-3">
        <UButton color="neutral" variant="ghost" @click="$emit('cancel')">
          Cancelar
        </UButton>
        <UButton
          v-if="canProcessPayment"
          type="submit"
          color="primary"
          :loading="loading"
          icon="i-lucide-banknote"
        >
          Cobrar
        </UButton>
      </div>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, computed } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Order, OrderStatus, SaleMethod, ComprobanteType } from '~/types'
import { processOrderSchema, type ProcessOrderRequest } from '~/utils/validations'

const props = defineProps<{
  loading?: boolean
  tableName?: string
  order: Order
  /** Saldo en efectivo físico de la caja activa — usado para detectar vuelto insuficiente */
  cashBalance?: number
}>()

const emit = defineEmits<{
  submit: [data: ProcessOrderRequest]
  cancel: []
  changeStatus: [orderId: number, status: OrderStatus]
}>()

const saleMethods = [
  { label: 'Efectivo', value: 'EFECTIVO' as SaleMethod },
  { label: 'Tarjeta', value: 'TARJETA' as SaleMethod },
  { label: 'Yape', value: 'YAPE' as SaleMethod },
  { label: 'Mercado Pago', value: 'MERCADO_PAGO' as SaleMethod }
]

const comprobanteTypes = [
  { label: 'Boleta', value: 'BOLETA' as ComprobanteType },
  { label: 'Factura', value: 'FACTURA' as ComprobanteType }
]

// Datos opcionales del cliente para la boleta (siempre se genera una)
const comprobanteState = reactive({
  tipo: 'BOLETA' as ComprobanteType,
  clienteNombre: '',
  clienteDocumento: ''
})

const statusColor = computed(() => {
  const colors: Record<string, 'warning' | 'info' | 'success' | 'primary' | 'error'> = {
    PENDIENTE: 'warning',
    PREPARANDO: 'info',
    LISTO: 'success',
    ENTREGADO: 'primary',
    CANCELADO: 'error'
  }
  return colors[props.order.status] || 'neutral'
})

const statusDisplay = computed(() => {
  const displays: Record<string, string> = {
    PENDIENTE: 'Pendiente',
    PREPARANDO: 'Preparando',
    LISTO: 'Listo',
    ENTREGADO: 'Entregado',
    CANCELADO: 'Cancelado'
  }
  return displays[props.order.status] || props.order.status
})

const nextStatus = computed<OrderStatus | null>(() => {
  if (props.order.status === 'LISTO') return 'ENTREGADO'
  return null
})

const nextStatusInfo = computed(() => {
  const info: Record<string, { label: string; color: 'info' | 'success' | 'primary'; icon: string }> = {
    ENTREGADO: { label: 'Marcar como Entregado', color: 'primary', icon: 'i-lucide-package-check' }
  }
  return nextStatus.value ? info[nextStatus.value] : null
})

const canChangeStatus = computed(() => {
  return props.order.status !== 'CANCELADO'
})

const canProcessPayment = computed(() => {
  return ['LISTO', 'ENTREGADO'].includes(props.order.status)
})

const state = reactive<ProcessOrderRequest>({
  orderId: props.order.id,
  paymentMethod: 'EFECTIVO',
  tip: undefined,
  amountReceived: undefined
})

watch(() => props.order, (o) => {
  state.orderId = o.id
})

const subtotal = computed(() => {
  return (props.order.products || []).reduce((acc, product) => acc + (product.priceUnitary * product.quantity), 0)
})

const total = computed(() => {
  return subtotal.value + (state.tip || 0)
})

// Vuelto calculado desde el monto recibido (va al backend en amountReceived)
const vuelto = computed(() => {
  if (!state.amountReceived || state.amountReceived < total.value) return null
  return state.amountReceived - total.value
})

// Advertencia: vuelto mayor al efectivo disponible en caja
const insufficientCash = computed(() => {
  if (vuelto.value === null || vuelto.value <= 0) return false
  if (props.cashBalance == null) return false
  return vuelto.value > props.cashBalance
})

// Resetear monto recibido al cambiar método de pago
watch(() => state.paymentMethod, () => { state.amountReceived = undefined })

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}

async function onSubmit(event: FormSubmitEvent<ProcessOrderRequest>) {
  const data: ProcessOrderRequest = { ...event.data }
  // Siempre se incluye el objeto comprobante (backend usa defaults si los campos están vacíos)
  data.comprobante = {
    tipo: comprobanteState.tipo,
    clienteNombre: comprobanteState.clienteNombre || undefined,
    clienteDocumento: comprobanteState.clienteDocumento || undefined
  }
  emit('submit', data)
}
</script>

<style scoped>
.slide-down-enter-active { transition: all 0.25s ease; }
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from { opacity: 0; transform: translateY(-8px); }
.slide-down-leave-to   { opacity: 0; transform: translateY(-8px); }
</style>

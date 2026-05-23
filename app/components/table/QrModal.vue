<template>
  <UModal v-model:open="open" :title="`QR — ${table?.name}`" @update:open="onOpenChange">
    <slot />

    <template #body>
      <div class="flex flex-col items-center gap-5 py-2">
        <!-- QR canvas -->
        <div class="rounded-xl border border-default p-4 bg-white shadow-sm">
          <canvas ref="canvasRef" class="block" />
        </div>

        <!-- URL que codifica -->
        <div class="w-full rounded-lg bg-elevated/60 border border-default px-4 py-2.5 text-center">
          <p class="text-xs text-muted mb-0.5 uppercase tracking-wide font-medium">URL del QR</p>
          <p class="font-mono text-xs text-highlighted break-all">{{ tableUrl }}</p>
        </div>

        <!-- Acciones -->
        <div class="flex gap-3 w-full">
          <UButton
            class="flex-1"
            color="primary"
            icon="i-lucide-download"
            :disabled="!ready"
            @click="downloadQr"
          >
            Descargar PNG
          </UButton>
          <UButton
            class="flex-1"
            color="neutral"
            variant="outline"
            icon="i-lucide-copy"
            @click="copyUrl"
          >
            Copiar URL
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import type { Table } from '~/types'

const props = defineProps<{
  table: Table | null
}>()

const open = defineModel<boolean>('open', { default: false })

const config = useRuntimeConfig()
const clientBaseUrl = (config.public as any).clientBaseUrl ?? 'http://localhost:3001'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ready = ref(false)
const toast = useToast()

const tableUrl = computed(() =>
  props.table ? `${clientBaseUrl}/mesa/${props.table.id}` : ''
)

// Genera el QR cada vez que cambia la mesa o se abre el modal
watch([() => props.table, open], async ([table, isOpen]) => {
  if (!isOpen || !table) return
  ready.value = false
  await nextTick()
  await generateQr()
})

async function generateQr() {
  if (!canvasRef.value || !tableUrl.value) return
  try {
    const QRCode = (await import('qrcode')).default
    await QRCode.toCanvas(canvasRef.value, tableUrl.value, {
      width: 240,
      margin: 2,
      color: { dark: '#1a1a1a', light: '#ffffff' }
    })
    ready.value = true
  } catch (e) {
    console.error('Error generando QR:', e)
  }
}

function downloadQr() {
  if (!canvasRef.value || !props.table) return
  const link = document.createElement('a')
  link.download = `qr-mesa-${props.table.id}-${props.table.name.replace(/\s+/g, '-')}.png`
  link.href = canvasRef.value.toDataURL('image/png')
  link.click()
}

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(tableUrl.value)
    toast.add({ title: 'URL copiada al portapapeles', color: 'success', icon: 'i-lucide-check' })
  } catch {
    toast.add({ title: 'No se pudo copiar', color: 'error' })
  }
}

function onOpenChange(val: boolean) {
  if (!val) ready.value = false
}
</script>

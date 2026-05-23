<template>
  <UDashboardPanel id="admin-mesas">
    <template #header>
      <UDashboardNavbar title="Gestión de Mesas">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UModal v-model:open="isModalOpen" :title="editingTable ? 'Editar Mesa' : 'Agregar Mesa'" @update:open="onModalOpenChange">
            <UButton icon="i-lucide-plus" color="primary">
              Agregar Mesa
            </UButton>
            <template #body>
              <TableFormAddTable
                :loading="isSubmitting"
                :initial-data="editingTable"
                @submit="handleSubmit"
                @cancel="closeModal"
              />
            </template>
          </UModal>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-6 pb-6">

        <!-- Resumen rápido -->
        <div class="grid grid-cols-3 gap-3">
          <div class="rounded-xl border border-default bg-elevated/40 px-4 py-3 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <UIcon name="i-lucide-layout-grid" class="w-4 h-4 text-primary" />
            </div>
            <div>
              <p class="text-xs text-muted">Total</p>
              <p class="text-lg font-bold text-highlighted">{{ tables?.length ?? 0 }}</p>
            </div>
          </div>
          <div class="rounded-xl border border-default bg-elevated/40 px-4 py-3 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-error/10 flex items-center justify-center">
              <UIcon name="i-lucide-users" class="w-4 h-4 text-error" />
            </div>
            <div>
              <p class="text-xs text-muted">Ocupadas</p>
              <p class="text-lg font-bold text-highlighted">{{ occupied }}</p>
            </div>
          </div>
          <div class="rounded-xl border border-default bg-elevated/40 px-4 py-3 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center">
              <UIcon name="i-lucide-circle-check" class="w-4 h-4 text-success" />
            </div>
            <div>
              <p class="text-xs text-muted">Libres</p>
              <p class="text-lg font-bold text-highlighted">{{ free }}</p>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isPending" class="flex items-center justify-center gap-2 text-muted text-sm py-16">
          <UIcon name="i-lucide-loader-circle" class="w-4 h-4 animate-spin" />
          Cargando mesas…
        </div>

        <!-- Grid de mesas -->
        <div v-else-if="tables?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          <div
            v-for="table in tables"
            :key="table.id"
            class="flex flex-col items-center gap-2.5"
          >
            <!-- Círculo de mesa -->
            <div
              class="relative w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-sm"
              :class="tableCircleClass(table)"
            >
              <!-- Sillas decorativas (4 puntos alrededor) -->
              <span
                v-for="pos in chairPositions"
                :key="pos.key"
                class="absolute w-4 h-4 rounded-full border-2 transition-colors"
                :class="[pos.class, table.occupied ? 'bg-error/30 border-error/40' : 'bg-success/20 border-success/30']"
              />

              <!-- Icono central -->
              <UIcon
                name="i-lucide-utensils-crossed"
                class="w-6 h-6 mb-0.5 transition-colors"
                :class="table.occupied ? 'text-error/70' : 'text-success/70'"
              />
              <span class="text-xs font-bold" :class="table.occupied ? 'text-error' : 'text-success'">
                Mesa {{ table.id }}
              </span>

              <!-- Dot de estado activa/inactiva -->
              <span
                class="absolute top-1 right-1 w-2.5 h-2.5 rounded-full ring-2 ring-background"
                :class="table.status !== false ? 'bg-success' : 'bg-neutral-400'"
              />
            </div>

            <!-- Menú de acciones (siempre visible, funciona en móvil y desktop) -->
            <UDropdownMenu
              :items="tableMenuItems(table)"
              :ui="{ content: 'min-w-[10rem]' }"
            >
              <button class="flex items-center gap-1 text-xs text-muted hover:text-default px-2 py-1 rounded-lg hover:bg-elevated transition-colors">
                <UIcon name="i-lucide-ellipsis" class="w-3.5 h-3.5" />
                Opciones
              </button>
            </UDropdownMenu>

            <!-- Nombre + estado bajo el círculo -->
            <div class="text-center">
              <p class="text-sm font-semibold text-highlighted leading-tight">{{ table.name }}</p>
              <div class="flex items-center justify-center gap-1 mt-0.5">
                <UBadge
                  :color="table.occupied ? 'error' : 'success'"
                  variant="subtle"
                  size="xs"
                >
                  {{ table.occupied ? 'Ocupada' : 'Libre' }}
                </UBadge>
              </div>
            </div>

          </div>
        </div>

        <div v-else class="text-center py-16 text-muted text-sm">
          <UIcon name="i-lucide-layout-grid" class="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No hay mesas registradas</p>
        </div>
      </div>

      <!-- Modal QR -->
      <TableQrModal v-model:open="isQrModalOpen" :table="qrTable" />

      <!-- Modal confirmar eliminación -->
      <UModal v-model:open="isDeleteModalOpen" title="Eliminar Mesa">
        <template #body>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3 p-3 rounded-lg bg-error/10 border border-error/20">
              <UIcon name="i-lucide-triangle-alert" class="w-5 h-5 text-error flex-shrink-0" />
              <p class="text-sm text-error">
                ¿Eliminar <strong>{{ tableToDelete?.name }}</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
            <div class="flex justify-end gap-3">
              <UButton color="neutral" variant="ghost" @click="isDeleteModalOpen = false">Cancelar</UButton>
              <UButton color="error" :loading="isDeleting" icon="i-lucide-trash-2" @click="handleDelete">
                Eliminar
              </UButton>
            </div>
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Table } from '~/types'
import type { TableRequest } from '~/utils/validations'

const toast = useToast()

const { useFindAllTables, useCreateTable, useUpdateTable, useActivateTable, useDeactivateTable, useDeleteTable } = useTables()

const { data: tables, isPending } = useFindAllTables()
const createMutation = useCreateTable()
const updateMutation = useUpdateTable()
const activateMutation = useActivateTable()
const deactivateMutation = useDeactivateTable()
const deleteMutation = useDeleteTable()

// ── Estadísticas ─────────────────────────────────────────────────
const occupied = computed(() => (tables.value ?? []).filter(t => t.occupied).length)
const free = computed(() => (tables.value ?? []).filter(t => !t.occupied && t.status !== false).length)

// ── Visual de círculo ────────────────────────────────────────────
function tableCircleClass(table: Table) {
  if (table.status === false) {
    return 'bg-neutral-800/60 border-2 border-neutral-600/40 opacity-60'
  }
  if (table.occupied) {
    return 'bg-error/10 border-2 border-error/30 hover:border-error/60 hover:shadow-error/20 hover:shadow-md'
  }
  return 'bg-success/10 border-2 border-success/30 hover:border-success/60 hover:shadow-success/20 hover:shadow-md'
}

// Sillas decorativas alrededor del círculo
const chairPositions = [
  { key: 'top',    class: '-top-2 left-1/2 -translate-x-1/2' },
  { key: 'bottom', class: '-bottom-2 left-1/2 -translate-x-1/2' },
  { key: 'left',   class: 'top-1/2 -left-2 -translate-y-1/2' },
  { key: 'right',  class: 'top-1/2 -right-2 -translate-y-1/2' }
]

// ── Menú contextual por mesa ─────────────────────────────────────
function tableMenuItems(table: Table) {
  return [
    [{
      label: 'Ver QR',
      icon: 'i-lucide-qr-code',
      onSelect: () => openQr(table)
    },
    {
      label: 'Editar',
      icon: 'i-lucide-pencil',
      onSelect: () => editTable(table)
    }],
    [{
      label: table.status !== false ? 'Desactivar' : 'Activar',
      icon: table.status !== false ? 'i-lucide-power-off' : 'i-lucide-power',
      onSelect: () => toggleStatus(table)
    }],
    [{
      label: 'Eliminar',
      icon: 'i-lucide-trash-2',
      color: 'error' as const,
      onSelect: () => confirmDelete(table)
    }]
  ]
}

// ── Modales ──────────────────────────────────────────────────────
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const editingTable = ref<Table | null>(null)
const isTogglingId = ref<number | string | null>(null)

// QR
const isQrModalOpen = ref(false)
const qrTable = ref<Table | null>(null)
function openQr(table: Table) {
  qrTable.value = table
  isQrModalOpen.value = true
}

// Delete
const isDeleteModalOpen = ref(false)
const tableToDelete = ref<Table | null>(null)
const isDeleting = ref(false)

function onModalOpenChange(open: boolean) {
  if (!open) editingTable.value = null
}
function closeModal() {
  isModalOpen.value = false
  editingTable.value = null
}
function editTable(table: Table) {
  editingTable.value = table
  isModalOpen.value = true
}
function confirmDelete(table: Table) {
  tableToDelete.value = table
  isDeleteModalOpen.value = true
}

async function handleDelete() {
  if (!tableToDelete.value) return
  isDeleting.value = true
  try {
    await deleteMutation.mutateAsync(Number(tableToDelete.value.id))
    isDeleteModalOpen.value = false
    toast.add({ title: `Mesa "${tableToDelete.value.name}" eliminada`, color: 'success' })
  } catch (e: any) {
    const msg = e?.body?.message || e?.message || 'Error al eliminar la mesa'
    toast.add({ title: msg, color: 'error' })
  } finally {
    isDeleting.value = false
    tableToDelete.value = null
  }
}

async function handleSubmit(data: TableRequest) {
  isSubmitting.value = true
  try {
    if (editingTable.value) {
      await updateMutation.mutateAsync({ id: Number(editingTable.value.id), data })
      toast.add({ title: 'Mesa actualizada', color: 'success' })
    } else {
      await createMutation.mutateAsync(data)
      toast.add({ title: 'Mesa creada', color: 'success' })
    }
    closeModal()
  } catch {
    toast.add({ title: 'Ocurrió un error', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

async function toggleStatus(table: Table) {
  isTogglingId.value = table.id
  try {
    if (table.status !== false) {
      await deactivateMutation.mutateAsync(Number(table.id))
    } else {
      await activateMutation.mutateAsync(Number(table.id))
    }
    toast.add({ title: 'Estado cambiado', color: 'success' })
  } catch {
    toast.add({ title: 'Ocurrió un error', color: 'error' })
  } finally {
    isTogglingId.value = null
  }
}
</script>

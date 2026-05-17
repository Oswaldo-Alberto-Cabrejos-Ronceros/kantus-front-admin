<template>
  <UDashboardPanel id="admin-mesas">
    <template #header>
      <UDashboardNavbar title="Gestión de Mesas">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="flex flex-col gap-4 pb-4">
        <div class="flex justify-end gap-2">
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
        </div>
        <UTable
          class="mt-2 shrink-0"
          :data="tables || []"
          :columns="columns"
          :loading="isPending"
          :ui="{ base: 'table-fixed border-separate border-spacing-0', thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none', tbody: '[&>tr]:last:[&>td]:border-b-0', th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r', td: 'border-b border-default', separator: 'h-0' }"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { h, resolveComponent, computed, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Table } from '~/types'
import type { TableRequest } from '~/utils/validations'

const UBadge = resolveComponent('UBadge')
const UBtn = resolveComponent('UButton')
const toast = useToast()

const { useFindAllTables, useCreateTable, useUpdateTable, useActivateTable, useDeactivateTable } = useTables()

const { data: tables, isPending } = useFindAllTables()
const createMutation = useCreateTable()
const updateMutation = useUpdateTable()
const activateMutation = useActivateTable()
const deactivateMutation = useDeactivateTable()

const columns = computed<TableColumn<Table>[]>(() => [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Nombre de Mesa' },
  {
    id: 'occupied',
    header: 'Ocupación',
    cell: ({ row }) => h(UBadge, {
      color: row.original.occupied ? 'warning' : 'success',
      variant: 'subtle'
    }, () => row.original.occupied ? 'Ocupada' : 'Libre')
  },
  {
    id: 'status',
    header: 'Estado',
    cell: ({ row }) => h(UBadge, {
      color: row.original.status !== false ? 'success' : 'error',
      variant: 'subtle'
    }, () => row.original.status !== false ? 'Activa' : 'Inactiva')
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => h('div', { class: 'flex gap-2' }, [
      h(UBtn, {
        size: 'xs',
        color: 'neutral',
        variant: 'soft',
        icon: 'i-lucide-pencil',
        onClick: () => editTable(row.original)
      }, () => 'Editar'),
      h(UBtn, {
        size: 'xs',
        color: row.original.status !== false ? 'error' : 'success',
        variant: 'soft',
        icon: row.original.status !== false ? 'i-lucide-power-off' : 'i-lucide-power',
        loading: isTogglingId.value === row.original.id,
        onClick: () => toggleStatus(row.original)
      }, () => row.original.status !== false ? 'Desactivar' : 'Activar')
    ])
  }
])

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const editingTable = ref<Table | null>(null)
const isTogglingId = ref<number | null>(null)

function onModalOpenChange(open: boolean) {
  if (!open) {
    editingTable.value = null
  }
}

function closeModal() {
  isModalOpen.value = false
  editingTable.value = null
}

function editTable(table: Table) {
  editingTable.value = table
  isModalOpen.value = true
}

async function handleSubmit(data: TableRequest) {
  isSubmitting.value = true
  try {
    if (editingTable.value) {
      await updateMutation.mutateAsync({ id: editingTable.value.id, data })
      toast.add({ title: 'Mesa actualizada correctamente', color: 'success' })
    } else {
      await createMutation.mutateAsync(data)
      toast.add({ title: 'Mesa creada correctamente', color: 'success' })
    }
    closeModal()
  } catch (e) {
    toast.add({ title: 'Ocurrió un error', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

async function toggleStatus(table: Table) {
  isTogglingId.value = table.id
  try {
    if (table.status !== false) {
      await deactivateMutation.mutateAsync(table.id)
    } else {
      await activateMutation.mutateAsync(table.id)
    }
    toast.add({ title: 'Estado cambiado', color: 'success' })
  } catch (e) {
    toast.add({ title: 'Ocurrió un error', color: 'error' })
  } finally {
    isTogglingId.value = null
  }
}
</script>

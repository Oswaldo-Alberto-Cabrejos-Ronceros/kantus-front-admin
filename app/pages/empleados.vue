<template>
  <UDashboardPanel id="empleados">
    <template #header>
      <UDashboardNavbar title="Empleados">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="flex flex-col gap-4 pb-4">
        <div class="flex justify-end gap-2">
          <UModal v-model:open="isModalOpen" title="Agregar Empleado">
            <UButton icon="i-lucide-user-plus" color="primary">
              Agregar Empleado
            </UButton>
            <template #body>
              <EmployeeFormAddEmployee :loading="isSubmitting" @submit="handleCreate" @cancel="isModalOpen = false" />
            </template>
          </UModal>
        </div>
        <UTable
          class="mt-2 shrink-0"
          :data="employees || []"
          :columns="columns"
          :loading="status === 'pending'"
          :ui="{ base: 'table-fixed border-separate border-spacing-0', thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none', tbody: '[&>tr]:last:[&>td]:border-b-0', th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r', td: 'border-b border-default', separator: 'h-0' }"
        />
      </div>
      <UModal v-model:open="isAssignModalOpen" title="Asignar Usuario">
        <template #body>
          <EmployeeFormAssignUser
            v-if="selectedEmployee"
            :employee-id="selectedEmployee.id"
            :employee-name="`${selectedEmployee.name} ${selectedEmployee.lastname}`"
            :loading="isSubmitting"
            @submit="handleAssignUser"
            @cancel="isAssignModalOpen = false"
          />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { h, resolveComponent, computed, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Employee } from '~/types'
import type { EmployeeRequest, AssignUserRequest } from '~/utils/validations'

const UBadge = resolveComponent('UBadge')
const UBtn = resolveComponent('UButton')
const toast = useToast()
const { data: employees, status } = await useFetch<Employee[]>('/api/employees')

const columns = computed<TableColumn<Employee>[]>(() => [
  { accessorKey: 'id', header: 'ID' },
  { id: 'fullname', header: 'Empleado', cell: ({ row }) => `${row.original.name} ${row.original.lastname}` },
  { id: 'document', header: 'Documento', cell: ({ row }) => `${row.original.documentType}: ${row.original.documentNumber}` },
  {
    accessorKey: 'position',
    header: 'Puesto',
    cell: ({ row }) => {
      const labels: Record<string, string> = {
        Administrative: 'Administrativo',
        Chef: 'Cocinero',
        Waiter: 'Mozo',
        Cashier: 'Cajero',
        Delivery: 'Repartidor'
      }
      return labels[row.original.position] || row.original.position
    }
  },
  { id: 'systemUser', header: 'Usuario', cell: ({ row }) => {
    if (row.original.hasSystemUser) return h('div', { class: 'flex items-center gap-1' }, [h(UBadge, { color: 'info', variant: 'subtle', size: 'xs' }, () => row.original.userRole), h('span', { class: 'text-xs text-muted' }, row.original.email)])
    return h(UBtn, { size: 'xs', color: 'primary', variant: 'soft', onClick: () => { selectedEmployee.value = row.original; isAssignModalOpen.value = true } }, () => 'Asignar')
  } },
  { id: 'status', header: 'Estado', cell: ({ row }) => h(UBadge, { color: row.original.status ? 'success' : 'error', variant: 'subtle' }, () => row.original.status ? 'Activo' : 'Baja') }
])

const isModalOpen = ref(false)
const isAssignModalOpen = ref(false)
const selectedEmployee = ref<Employee | null>(null)
const isSubmitting = ref(false)

async function handleCreate(data: EmployeeRequest) {
  isSubmitting.value = true
  setTimeout(() => { isSubmitting.value = false; isModalOpen.value = false; toast.add({ title: '¡Empleado registrado!', color: 'success' }) }, 1000)
}
async function handleAssignUser(data: AssignUserRequest) {
  isSubmitting.value = true
  setTimeout(() => { isSubmitting.value = false; isAssignModalOpen.value = false; toast.add({ title: '¡Usuario asignado!', color: 'success' }) }, 1000)
}
</script>

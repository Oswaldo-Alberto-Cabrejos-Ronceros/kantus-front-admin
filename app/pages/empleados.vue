<template>
  <UDashboardPanel id="empleados">
    <template #header>
      <UDashboardNavbar title="Empleados" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 pb-4">
        <div class="flex justify-end">
          <UModal
            v-model:open="isModalOpen"
            title="Agregar Empleado"
          >
            <UButton icon="i-lucide-plus" color="primary">
              Agregar Empleado
            </UButton>
            <template #body>
              <EmployeeFormAddEmployee
                :loading="isSubmitting"
                @submit="handleCreate"
                @cancel="isModalOpen = false"
              />
            </template>
          </UModal>
        </div>

        <UTable
          class="mt-4 shrink-0"
          :data="employees || []"
          :columns="columns"
          :loading="status === 'pending'"
          :ui="{
            base: 'table-fixed border-separate border-spacing-0',
            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0',
            th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
            td: 'border-b border-default',
            separator: 'h-0'
          }"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { h, resolveComponent, computed, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Employee } from '~/types'
import type { EmployeeRequest } from '~/utils/validations'

const UBadge = resolveComponent('UBadge')

const { data: employees, status } = await useFetch<Employee[]>('/api/employees')

const columns = computed<TableColumn<Employee>[]>(() => [
  { accessorKey: 'id', header: 'ID' },
  { id: 'fullname', header: 'Empleado', cell: ({ row }) => `${row.original.name} ${row.original.lastname}` },
  { id: 'document', header: 'Documento', cell: ({ row }) => `${row.original.documentType}: ${row.original.documentNumber}` },
  {
    accessorKey: 'birthdate',
    header: 'F. Nacimiento',
    cell: ({ row }) => new Date(row.original.birthdate).toLocaleDateString()
  },
  { accessorKey: 'position', header: 'Puesto' },
  { accessorKey: 'hoursWeek', header: 'Horas/Sem' },
  { accessorKey: 'hourlyWage', header: 'Salario/Hr', cell: ({ row }) => `$${row.original.hourlyWage.toFixed(2)}` },
  {
    id: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const isActive = row.original.status
      return h(UBadge, { color: isActive ? 'success' : 'error', variant: 'subtle' }, () => isActive ? 'Activo' : 'Inactivo')
    }
  }
])

const isModalOpen = ref(false)
const isSubmitting = ref(false)

async function handleCreate(data: EmployeeRequest) {
  isSubmitting.value = true
  console.log('Simulando creación de empleado...', data)

  setTimeout(() => {
    isSubmitting.value = false
    isModalOpen.value = false
    console.log('¡Empleado agregado exitosamente!')
  }, 1000)
}
</script>

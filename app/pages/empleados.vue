<template>
  <UDashboardPanel id="empleados">
    <template #header>
      <UDashboardNavbar title="Empleados">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UModal v-model:open="isModalOpen" title="Agregar Empleado">
            <UButton icon="i-lucide-user-plus" color="primary">
              Agregar Empleado
            </UButton>
            <template #body>
              <EmployeeFormAddEmployee :loading="isSubmitting" @submit="handleCreate" @cancel="isModalOpen = false" />
            </template>
          </UModal>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-5 pb-6">

        <!-- Barra de búsqueda -->
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Buscar por nombre o DNI…"
          class="max-w-sm"
          :ui="{ base: 'rounded-lg' }"
          @input="activeTab = 'todos'"
        />

        <!-- Tabs por rol -->
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border"
            :class="activeTab === tab.key
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-elevated/50 text-muted border-default hover:border-primary/40 hover:text-default'"
            @click="activeTab = tab.key"
          >
            <UIcon :name="tab.icon" class="w-3.5 h-3.5" />
            {{ tab.label }}
            <span
              class="ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-semibold"
              :class="activeTab === tab.key ? 'bg-white/20' : 'bg-elevated text-muted'"
            >
              {{ countByRole(tab.key) }}
            </span>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isPending" class="flex items-center gap-2 text-muted text-sm py-8 justify-center">
          <UIcon name="i-lucide-loader-circle" class="w-4 h-4 animate-spin" />
          Cargando empleados…
        </div>

        <!-- Sin resultados -->
        <div v-else-if="!filtered.length" class="text-center py-16 text-muted text-sm">
          <UIcon name="i-lucide-users" class="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p class="font-medium">No se encontraron empleados</p>
          <p v-if="search" class="text-xs mt-1">Intenta con otro nombre o DNI</p>
        </div>

        <!-- Grid de cards -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="emp in filtered"
            :key="emp.id"
            class="relative rounded-xl border border-default bg-elevated/30 hover:bg-elevated/60 transition-colors p-4 flex flex-col gap-3"
          >
            <!-- Status indicator (top-right dot) -->
            <span
              class="absolute top-3 right-3 w-2.5 h-2.5 rounded-full ring-2 ring-background"
              :class="emp.status ? 'bg-success' : 'bg-error'"
              :title="emp.status ? 'Activo' : 'Baja'"
            />

            <!-- Avatar + nombre -->
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white"
                :class="roleColor(emp.position)"
              >
                {{ initials(emp) }}
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-sm text-highlighted truncate leading-tight">
                  {{ emp.name }} {{ emp.lastname }}
                </p>
                <p class="text-xs text-muted truncate">{{ emp.documentType }}: {{ emp.documentNumber }}</p>
              </div>
            </div>

            <!-- Badges rol + estado -->
            <div class="flex items-center gap-2 flex-wrap">
              <UBadge :color="roleBadgeColor(emp.position)" variant="subtle" size="xs" :icon="roleIcon(emp.position)">
                {{ roleLabel(emp.position) }}
              </UBadge>
              <UBadge :color="emp.status ? 'success' : 'neutral'" variant="subtle" size="xs">
                {{ emp.status ? 'Activo' : 'Baja' }}
              </UBadge>
            </div>

            <!-- Email / contrato -->
            <div class="flex flex-col gap-0.5 border-t border-default pt-2.5">
              <div v-if="emp.email" class="flex items-center gap-1.5 text-xs text-muted truncate">
                <UIcon name="i-lucide-mail" class="w-3 h-3 flex-shrink-0" />
                <span class="truncate">{{ emp.email }}</span>
              </div>
              <div class="flex items-center gap-1.5 text-xs text-muted">
                <UIcon name="i-lucide-clock" class="w-3 h-3 flex-shrink-0" />
                {{ contractLabel(emp.contractType) }} · {{ emp.weeklyHours }}h/sem
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal asignar usuario -->
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
import { ref, computed } from 'vue'
import type { Employee, EmployeePosition, ContractType } from '~/types'
import type { EmployeeWithUserRequest, AssignUserRequest } from '~/utils/validations'

const toast = useToast()

const { useFindAllEmployees, useCreateEmployee } = useEmployees()
const { useCreateUser, useCreateEmployeeWithUser } = useUsers()

const { data: employees, isPending } = useFindAllEmployees()
const createEmployeeMutation = useCreateEmployee()
const createUserMutation = useCreateUser()
const createEmployeeWithUserMutation = useCreateEmployeeWithUser()

// ── Búsqueda y tabs ──────────────────────────────────────────────
const search = ref('')
const activeTab = ref('todos')

const tabs = [
  { key: 'todos',          label: 'Todos',          icon: 'i-lucide-users' },
  { key: 'Administrative', label: 'Administrativo', icon: 'i-lucide-briefcase' },
  { key: 'Chef',           label: 'Cocina',         icon: 'i-lucide-chef-hat' },
  { key: 'Waiter',         label: 'Mozos',          icon: 'i-lucide-utensils' },
  { key: 'Cashier',        label: 'Cajeros',        icon: 'i-lucide-wallet' },
  { key: 'Delivery',       label: 'Repartidores',   icon: 'i-lucide-bike' }
]

function countByRole(key: string) {
  const list = employees.value ?? []
  if (key === 'todos') return list.length
  return list.filter(e => e.position === key).length
}

const filtered = computed(() => {
  let list = employees.value ?? []
  if (activeTab.value !== 'todos') {
    list = list.filter(e => e.position === activeTab.value)
  }
  const q = search.value.trim().toLowerCase()
  if (!q) return list
  return list.filter(e =>
    `${e.name} ${e.lastname}`.toLowerCase().includes(q) ||
    e.documentNumber.toLowerCase().includes(q)
  )
})

// ── Helpers visuales ─────────────────────────────────────────────
function initials(emp: Employee) {
  return `${emp.name[0] ?? ''}${emp.lastname[0] ?? ''}`.toUpperCase()
}

const ROLE_COLORS: Record<EmployeePosition, string> = {
  Administrative: 'bg-violet-500',
  Chef:           'bg-orange-500',
  Waiter:         'bg-sky-500',
  Cashier:        'bg-emerald-500',
  Delivery:       'bg-yellow-500'
}
function roleColor(pos: EmployeePosition) {
  return ROLE_COLORS[pos] ?? 'bg-neutral-500'
}

const BADGE_COLORS: Record<EmployeePosition, string> = {
  Administrative: 'violet',
  Chef:           'warning',
  Waiter:         'info',
  Cashier:        'success',
  Delivery:       'warning'
}
function roleBadgeColor(pos: EmployeePosition): any {
  return BADGE_COLORS[pos] ?? 'neutral'
}

const ROLE_LABELS: Record<EmployeePosition, string> = {
  Administrative: 'Administrativo',
  Chef:           'Cocinero',
  Waiter:         'Mozo',
  Cashier:        'Cajero',
  Delivery:       'Repartidor'
}
function roleLabel(pos: EmployeePosition) {
  return ROLE_LABELS[pos] ?? pos
}

const ROLE_ICONS: Record<EmployeePosition, string> = {
  Administrative: 'i-lucide-briefcase',
  Chef:           'i-lucide-chef-hat',
  Waiter:         'i-lucide-utensils',
  Cashier:        'i-lucide-wallet',
  Delivery:       'i-lucide-bike'
}
function roleIcon(pos: EmployeePosition) {
  return ROLE_ICONS[pos] ?? 'i-lucide-user'
}

const CONTRACT_LABELS: Record<ContractType, string> = {
  FULL_TIME: 'Tiempo completo',
  PART_TIME: 'Medio tiempo',
  CONTRACT:  'Contrato'
}
function contractLabel(ct: ContractType) {
  return CONTRACT_LABELS[ct] ?? ct
}

// ── Modales ──────────────────────────────────────────────────────
const isModalOpen = ref(false)
const isAssignModalOpen = ref(false)
const selectedEmployee = ref<Employee | null>(null)
const isSubmitting = ref(false)

async function handleCreate(data: EmployeeWithUserRequest) {
  isSubmitting.value = true
  try {
    await createEmployeeWithUserMutation.mutateAsync(data)
    isModalOpen.value = false
    toast.add({ title: '¡Empleado registrado!', color: 'success' })
  } catch {
    toast.add({ title: 'Error al crear empleado', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

async function handleAssignUser(data: AssignUserRequest) {
  isSubmitting.value = true
  try {
    await createUserMutation.mutateAsync({
      username: data.username.split('@')[0] || data.username,
      password: data.password,
      status: true
    })
    isAssignModalOpen.value = false
    toast.add({ title: '¡Usuario asignado!', color: 'success' })
  } catch {
    toast.add({ title: 'Error al asignar usuario', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

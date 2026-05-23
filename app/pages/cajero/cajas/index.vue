<template>
  <UDashboardPanel id="cajas">
    <template #header>
      <UDashboardNavbar title="Cajas" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UTooltip v-if="hasOpenCashbox" text="Debes cerrar la caja actual antes de abrir una nueva">
            <UButton icon="i-lucide-unlock" color="primary" disabled>Abrir Caja</UButton>
          </UTooltip>
          <UModal v-else v-model:open="isModalOpen" title="Abrir Caja">
            <UButton icon="i-lucide-unlock" color="primary">Abrir Caja</UButton>
            <template #body>
              <CashboxFormOpenCashbox
                :loading="isSubmitting"
                :cashbox-name="generatedCashboxName"
                @submit="handleOpenCashbox"
                @cancel="isModalOpen = false"
              />
            </template>
          </UModal>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="isLoading" class="flex justify-center items-center h-full">
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
      </div>
      <template v-else>
        <UAlert
          v-if="hasOpenCashbox"
          icon="i-lucide-info"
          color="warning"
          variant="subtle"
          :title="`Caja activa: ${activeCashbox?.name}`"
          description="Ya hay una caja abierta en el sistema. Debes cerrarla antes de abrir una nueva."
          class="m-4"
        />

        <div v-if="boxes.length" class="flex flex-col gap-6 p-4">
          <div v-for="group in boxesByDate" :key="group.date">
            <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted capitalize">
              {{ group.date }}
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <CashboxCardCashBox v-for="box in group.items" :key="box.id" v-bind="box" />
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col justify-center items-center h-full text-gray-500 gap-4">
          <UIcon name="i-lucide-wallet-cards" class="w-16 h-16 text-gray-300" />
          <p class="text-lg">No tienes cajas registradas.</p>
          <UButton icon="i-lucide-unlock" label="Abrir Caja Ahora" color="primary" @click="isModalOpen = true" />
        </div>
      </template>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '~/composables/auth'
import { useEmployees } from '~/composables/useEmployees'
import { useCashBoxManager } from '~/composables/useCashBoxManager'

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

const { useFindEmployeeByUserId } = useEmployees()
const { data: employee } = useFindEmployeeByUserId(userId)
const employeeId = computed(() => Number(employee.value?.id) || undefined)

const generatedCashboxName = computed(() => {
  if (employee.value) return `Caja ${employee.value.name} ${employee.value.documentNumber}`
  if (user.value) return `Caja ${user.value.name} ${user.value.lastname}`
  return 'Caja'
})

const {
  boxes,
  activeCashbox,
  hasOpenCashbox,
  boxesByDate,
  isLoading,
  isModalOpen,
  isSubmitting,
  handleOpenCashbox
} = useCashBoxManager({
  cashboxName: () => generatedCashboxName.value,
  employeeId: () => employeeId.value
})
</script>

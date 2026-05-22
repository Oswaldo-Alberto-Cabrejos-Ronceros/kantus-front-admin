<template>
  <UDashboardPanel id="cajas">
    <template #header>
      <UDashboardNavbar title="Cajas" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UModal v-model:open="isModalOpen" title="Abrir Caja">
            <UButton v-if="employee" icon="i-lucide-plus" color="primary">
              Abrir Caja
            </UButton>
            <template #body>
              <CashboxFormOpenCashbox :loading="isSubmitting" @submit="handleOpenCashbox" @cancel="isModalOpen = false" />
            </template>
          </UModal>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="isLoading" class="flex justify-center items-center h-full">
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
      </div>
      <div v-else-if="boxes && boxes.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        <CashboxCardCashBox
          v-for="box in boxes"
          :key="box.id"
          v-bind="box"
        />
      </div>
      <div v-else class="flex flex-col justify-center items-center h-full text-gray-500 gap-4">
        <UIcon name="i-lucide-wallet-cards" class="w-16 h-16 text-gray-300" />
        <p class="text-lg">No hay cajas abiertas o registradas.</p>
        <UButton
          v-if="employee"
          icon="i-lucide-plus"
          label="Abrir Caja Ahora"
          color="primary"
          @click="isModalOpen = true"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/auth'
import { useEmployees } from '~/composables/useEmployees'
import { useCashBoxes } from '~/composables/useCashBoxes'
import type { OpenCashboxRequest } from '~/utils/validations'

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

const toast = useToast()
const { user } = useAuth()
const userId = computed(() => Number(user.value?.id) || 0)

const { useFindEmployeeByUserId } = useEmployees()
const { data: employee } = useFindEmployeeByUserId(userId)

const employeeId = computed(() => Number(employee.value?.id) || 0)

const { useFindCashBoxesByEmployee, useOpenCashBox } = useCashBoxes()
const page = ref(0)
const size = ref(10)
const { data: cashboxesData, isLoading } = useFindCashBoxesByEmployee(employeeId, page, size)
const openMutation = useOpenCashBox()

const boxes = computed(() => cashboxesData.value?.content || [])

const isModalOpen = ref(false)
const isSubmitting = ref(false)

async function handleOpenCashbox(data: OpenCashboxRequest) {
  if (!employeeId.value) {
    toast.add({ title: 'Error: No se encontró perfil de empleado', color: 'error' })
    return
  }
  isSubmitting.value = true
  try {
    await openMutation.mutateAsync({
      name: data.name,
      openingAmount: data.openingAmount,
      employeeId: employeeId.value
    })
    isModalOpen.value = false
    toast.add({ title: 'Caja abierta correctamente', color: 'success' })
  } catch {
    toast.add({ title: 'Error al abrir caja', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

/**
 * Lógica compartida entre pages/cajas/index.vue (admin)
 * y pages/cajero/cajas/index.vue (cajero).
 *
 * Extrae: listado de cajas, caja activa, apertura, agrupación por fecha.
 * Cada página sólo añade lo que la diferencia (advertencia de admin, nombre generado, etc.).
 */
import { ref, computed } from 'vue'
import { useToast } from '#imports'
import { useCashBoxes } from '~/composables/useCashBoxes'
import type { OpenCashboxAmountRequest } from '~/utils/validations'
import type { CashBox } from '~/types'

export const useCashBoxManager = (options: {
  /** Nombre que se usará al crear la caja */
  cashboxName: () => string
  /** employeeId opcional para asociar la caja al empleado */
  employeeId?: () => number | undefined
}) => {
  const toast = useToast()
  const { useFindAllCashBoxes, useOpenCashBox } = useCashBoxes()

  const { data: allBoxesData, isLoading } = useFindAllCashBoxes()
  const openMutation = useOpenCashBox()

  const boxes = computed<CashBox[]>(() => allBoxesData.value ?? [])

  const activeCashbox = computed(() =>
    boxes.value.find((b) => b.status === 'ABIERTA') ?? null
  )

  const hasOpenCashbox = computed(() => !!activeCashbox.value)

  /** Cajas agrupadas por día de apertura, más reciente primero */
  const boxesByDate = computed(() => {
    const groups = new Map<string, CashBox[]>()
    const sorted = [...boxes.value].sort(
      (a, b) => new Date(b.openingTime).getTime() - new Date(a.openingTime).getTime()
    )
    for (const box of sorted) {
      const date = new Date(box.openingTime).toLocaleDateString('es-PE', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
      if (!groups.has(date)) groups.set(date, [])
      groups.get(date)!.push(box)
    }
    return Array.from(groups.entries()).map(([date, items]) => ({ date, items }))
  })

  const isModalOpen = ref(false)
  const isSubmitting = ref(false)

  async function handleOpenCashbox(data: OpenCashboxAmountRequest) {
    if (hasOpenCashbox.value) {
      toast.add({
        title: 'Ya hay una caja abierta',
        description: 'Ciérrala antes de abrir una nueva.',
        color: 'warning'
      })
      return
    }
    isSubmitting.value = true
    const name = options.cashboxName()
    try {
      await openMutation.mutateAsync({
        name,
        openingAmount: data.openingAmount,
        employeeId: options.employeeId?.()
      })
      isModalOpen.value = false
      toast.add({ title: `${name} abierta correctamente`, color: 'success' })
    } catch (err: unknown) {
      const msg =
        (err as any)?.body?.message ??
        (err as Error)?.message ??
        'Error al abrir caja'
      toast.add({ title: msg, color: 'error' })
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    boxes,
    activeCashbox,
    hasOpenCashbox,
    boxesByDate,
    isLoading,
    isModalOpen,
    isSubmitting,
    handleOpenCashbox
  }
}

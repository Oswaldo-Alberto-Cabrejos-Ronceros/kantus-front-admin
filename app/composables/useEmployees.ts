import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import {
  getAllEmployees,
  createEmployee,
  createEmployeeWithUser,
  updateEmployee,
  activateEmployee,
  deactivateEmployee,
  getEmployeeById,
  getEmployeeByUserId
} from '~/api/sdk.gen'
import type { EmployeeResponse } from '~/api/types.gen'
import { mapEmployeeResponseToUI, mapEmployeeRequestFromUI } from '~/adapters/employee'
import { mapEmployeeUserRequestFromUI } from '~/adapters/user'
import type { Employee } from '~/types'

export const useEmployees = () => {
  const queryClient = useQueryClient()

  const useFindAllEmployees = () => {
    return useQuery({
      queryKey: ['employees'],
      queryFn: async () => {
        const res = await getAllEmployees()
        const data = res.data || []
        return Array.isArray(data) 
          ? data.map((item) => mapEmployeeResponseToUI(item as EmployeeResponse)) 
          : (data as any)?.content?.map((item: any) => mapEmployeeResponseToUI(item as EmployeeResponse)) || []
      }
    })
  }

  const useFindOneEmployee = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['employees', id],
      queryFn: async () => {
        const res = await getEmployeeById({ path: { id: toValue(id) } })
        if (res.error) throw res.error
        return res.data ? mapEmployeeResponseToUI(res.data as EmployeeResponse) : null
      },
      enabled: computed(() => !!toValue(id))
    })
  }

  const useFindEmployeeByUserId = (userId: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['employees', 'user', userId],
      queryFn: async () => {
        const res = await getEmployeeByUserId({ path: { userId: toValue(userId) } })
        if (res.error) throw res.error
        return res.data ? mapEmployeeResponseToUI(res.data as EmployeeResponse) : null
      },
      enabled: computed(() => !!toValue(userId))
    })
  }

  const useCreateEmployee = () => {
    return useMutation({
      mutationFn: async (employee: Partial<Employee>) => {
        const body = mapEmployeeRequestFromUI(employee)
        const res = await createEmployee({ body })
        if (res.error) throw res.error
        return res.data ? mapEmployeeResponseToUI(res.data as EmployeeResponse) : null
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
      }
    })
  }

  const useCreateEmployeeWithUser = () => {
    return useMutation({
      mutationFn: async ({ employee, user }: { employee: Partial<Employee>; user: any }) => {
        const body = mapEmployeeUserRequestFromUI(employee, user)
        const res = await createEmployeeWithUser({ body })
        if (res.error) throw res.error
        return res.data ? mapEmployeeResponseToUI(res.data as EmployeeResponse) : null
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
      }
    })
  }

  const useUpdateEmployee = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Partial<Employee> }) => {
        const body = mapEmployeeRequestFromUI(data)
        const res = await updateEmployee({ path: { id }, body })
        if (res.error) throw res.error
        return res.data ? mapEmployeeResponseToUI(res.data as EmployeeResponse) : null
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        queryClient.invalidateQueries({ queryKey: ['employees', variables.id] })
      }
    })
  }

  const useActivateEmployee = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await activateEmployee({ path: { id } })
        if (res.error) throw res.error
        return res.data ? mapEmployeeResponseToUI(res.data as EmployeeResponse) : null
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        queryClient.invalidateQueries({ queryKey: ['employees', id] })
      }
    })
  }

  const useDeactivateEmployee = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await deactivateEmployee({ path: { id } })
        if (res.error) throw res.error
        return res.data ? mapEmployeeResponseToUI(res.data as EmployeeResponse) : null
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        queryClient.invalidateQueries({ queryKey: ['employees', id] })
      }
    })
  }

  return {
    useFindAllEmployees,
    useFindOneEmployee,
    useFindEmployeeByUserId,
    useCreateEmployee,
    useCreateEmployeeWithUser,
    useUpdateEmployee,
    useActivateEmployee,
    useDeactivateEmployee
  }
}

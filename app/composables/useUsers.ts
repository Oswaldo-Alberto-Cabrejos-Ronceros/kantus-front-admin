import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import {
  getAllUsers,
  getUserById,
  createUser,
  createEmployeeWithUser
} from '~/api/sdk.gen'
import type { UserResponse, EmployeeResponse } from '~/api/types.gen'
import { mapUserResponseToUI, mapEmployeeUserRequestFromUI } from '~/adapters/user'
import { mapEmployeeResponseToUI } from '~/adapters/employee'
import type { EmployeeWithUserRequest } from '~/utils/validations'

export const useUsers = () => {
  const queryClient = useQueryClient()

  const useFindAllUsers = () => {
    return useQuery({
      queryKey: ['users'],
      queryFn: async () => {
        const res = await getAllUsers()
        const data = res.data || []
        return Array.isArray(data) 
          ? data.map((item) => mapUserResponseToUI(item as UserResponse)) 
          : (data as any)?.content?.map((item: any) => mapUserResponseToUI(item as UserResponse)) || []
      }
    })
  }

  const useFindOneUser = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['users', id],
      queryFn: async () => {
        const res = await getUserById({ path: { id: toValue(id) } })
        if (res.error) throw res.error
        return res.data ? mapUserResponseToUI(res.data as UserResponse) : null
      },
      enabled: computed(() => !!toValue(id))
    })
  }

  const useCreateUser = () => {
    return useMutation({
      mutationFn: async (data: { username: string; password: string; roleId?: number; status?: boolean }) => {
        const res = await createUser({ body: data as any })
        if (res.error) throw res.error
        return res.data ? mapUserResponseToUI(res.data as UserResponse) : null
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        queryClient.invalidateQueries({ queryKey: ['employees'] })
      }
    })
  }

  const useCreateEmployeeWithUser = () => {
    return useMutation({
      mutationFn: async (data: EmployeeWithUserRequest) => {
        const body = mapEmployeeUserRequestFromUI(data, data.user)
        const res = await createEmployeeWithUser({ body })
        if (res.error) throw res.error
        return res.data ? mapEmployeeResponseToUI(res.data as EmployeeResponse) : null
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        queryClient.invalidateQueries({ queryKey: ['employees'] })
      }
    })
  }

  return {
    useFindAllUsers,
    useFindOneUser,
    useCreateUser,
    useCreateEmployeeWithUser
  }
}

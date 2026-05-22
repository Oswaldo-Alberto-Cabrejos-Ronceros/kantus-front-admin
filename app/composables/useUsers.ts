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
import { extractItems, STALE } from '~/utils/query'
import type { EmployeeWithUserRequest } from '~/utils/validations'

export const useUsers = () => {
  const queryClient = useQueryClient()

  const useFindAllUsers = () => {
    return useQuery({
      queryKey: ['users'],
      staleTime: STALE.STATIC,
      queryFn: async () => {
        const res = await getAllUsers()
        return extractItems<UserResponse>(res.data as any).map(mapUserResponseToUI)
      }
    })
  }

  const useFindOneUser = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['users', id],
      staleTime: STALE.STATIC,
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
        queryClient.invalidateQueries({ queryKey: ['users'], exact: true })
        queryClient.invalidateQueries({ queryKey: ['employees'], exact: true })
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
        queryClient.invalidateQueries({ queryKey: ['users'], exact: true })
        queryClient.invalidateQueries({ queryKey: ['employees'], exact: true })
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

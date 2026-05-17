import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import {
  getAllUsers,
  getUserById,
  searchUsers
} from '~/api/sdk.gen'
import type { UserResponse } from '~/api/types.gen'
import { mapUserResponseToUI } from '~/adapters/user'

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
      mutationFn: async (data: any) => {
        // MOCK: simulando la creación de usuario ya que el backend no tiene un método explícito para crear usuario desde el admin
        await new Promise(resolve => setTimeout(resolve, 800))
        return { id: Math.floor(Math.random() * 1000), ...data }
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
    useCreateUser
  }
}

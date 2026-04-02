import type { Category } from '~/types'

export default defineEventHandler(async () => {
  const categories: Category[] = [
    {
      id: 1,
      name: 'Pollo a la Brasa'
    },
    {
      id: 2,
      name: 'Parrillas'
    },
    {
      id: 3,
      name: 'Bebidas'
    }
  ]

  return categories
})

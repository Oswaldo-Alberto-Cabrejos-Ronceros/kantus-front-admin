export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

export interface Category {
  id: number
  name: string
}

export interface Product {
  id: number
  categoryId: number
  imageUrl: string
  name: string
  description: string
  price: number
}

export type OrderStatus = 'Pendiente' | 'Preparando' | 'Listo'
export type OrderType = 'salon' | 'delivery'

export interface OrderProduct {
  name: string
  quantity: number
}

export interface Order {
  id: number | string
  code: string
  status: OrderStatus
  type: OrderType
  products: OrderProduct[]
  time: string | number | Date
  totalPrice: number
  location?: string
  customerName?: string
  customerPhone?: string
}

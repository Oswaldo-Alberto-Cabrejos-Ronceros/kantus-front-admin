export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

// ===== CARTA (MENU) =====

export interface Category {
  id: number
  name: string
  status: boolean
}

export interface Product {
  id: number
  categoryId: number
  imageUrl: string
  name: string
  description: string
  price: number
  status: boolean
  promotion?: Promotion
}

export interface Promotion {
  id: number
  productId: number
  tipo: 'porcentaje' | 'precio'
  valor: number
  fechaInicio: string | Date
  fechaFin: string | Date
  status: boolean
}

// ===== ORDERS =====

export type OrderStatus = 'Pendiente' | 'Preparando' | 'Listo' | 'Entregado' | 'Pagado' | 'Cancelado'
export type OrderType = 'salon' | 'delivery'

export interface OrderProduct {
  id: number
  name: string
  priceUnitary: number
  quantity: number
}

export interface Order {
  id: number
  code: string
  status: OrderStatus
  type: OrderType
  products: OrderProduct[]
  time: string | number | Date
  totalPrice: number
  location?: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  customerDni?: string
  tableId?: number
  tableName?: string
  paymentMethod?: SaleMethod
  tip?: number
}

export type OrderDeliveryStatus = 'Pendiente' | 'Camino' | 'Entregado'

export interface OrderDelivery {
  id: number
  code?: string
  status: OrderDeliveryStatus
  customerName: string
  customerPhone?: string
  customerEmail?: string
  customerDni?: string
  address: string
  totalPrice: number
  products?: OrderProduct[]
  time?: string | number | Date
  paymentMethod?: string
}

// ===== INVENTORY =====

export interface CategoryInventory {
  id: number
  name: string
  status?: boolean
}

export type InventoryUnit = 'Unidad' | 'Kilogramo' | 'Litro' | 'Gramo' | 'Mililitro'

export interface ProductInventory {
  id: number
  name: string
  categoryId: number
  cantidad: number
  stockMinimo?: number
  unidad: InventoryUnit
  fechaVencimiento: string | Date
  estado: boolean
  supplierId?: number
}

export type MovementType = 'entrada' | 'salida'

export interface MovementInventory {
  id: number
  fecha: string | Date
  productId: number
  productName: string
  tipo: MovementType
  cantidad: number
  razon: string
}

export interface Supplier {
  id: number
  nombre: string
  ruc: string
  contacto: string
  email: string
  telefono: string
  estado: boolean
}

// ===== SALES & REVENUE =====

export interface ProductTop {
  id: number
  productId: number
  productName: string
  quantity: number
  totalCollected: number
}

export type SaleMethod = 'efectivo' | 'transferencia' | 'tarjeta' | 'yape/plin'

export interface Sale {
  id: number | string
  fecha: string | Date
  codigo: string
  metodo: SaleMethod
  monto: number
  tipo?: OrderType
}

// ===== EMPLOYEES =====

export type DocumentType = 'DNI' | 'CE'
export type EmployeePosition = 'Administrative' | 'Chef' | 'Waiter' | 'Cashier' | 'Delivery'

export interface Employee {
  id: number | string
  name: string
  lastname: string
  documentType: DocumentType
  documentNumber: string
  birthdate: string | Date
  hoursWeek: number
  hourlyWage: number
  position: EmployeePosition
  status: boolean
  // System user fields
  email?: string
  userRole?: UserRole
  hasSystemUser?: boolean
}

// ===== CASHBOX =====

export type CashBoxStatus = 'Abierta' | 'Cerrada'

export interface CashBox {
  id: number | string
  name: string
  openingAmount: number
  currentBalance: number
  collectedSales: number
  openingTime: string | Date
  closingTime?: string | Date
  status: CashBoxStatus
}

export type ComprobanteType = 'Boleta' | 'Factura'
export type MovementCashboxType = 'Egreso' | 'Ingreso'

export interface MovementCashbox {
  id: number | string
  dia: string | Date
  hora: string
  codigoPedidos?: string
  tipoComprobante?: ComprobanteType
  descripcion?: string
  tipo: MovementCashboxType
  monto: number
}

export interface OrderDetailProduct {
  id: number | string
  name: string
  price: number
  quantity: number
}

// ===== TABLES =====

export interface Table {
  id: number
  name: string
  occupied: boolean
  status?: boolean
  order?: Order
  qrUrl?: string
}

// ===== AUTH =====

export type UserRole = 'Admin' | 'Mozo' | 'Cajero' | 'Cocinero' | 'Delivery' | 'Cliente'

export interface AuthRequest {
  email: string
  password: string
}

export interface AuthResponse {
  id: number | string
  name: string
  lastname: string
  role: UserRole
  token?: string
}

// ===== DELIVERY CLIENT ORDER =====

export interface DeliveryOrderRequest {
  nombre: string
  celular: string
  email: string
  dni: string
  direccion: string
  productos: Array<{ productId: number, quantity: number }>
  metodoPago?: string
}

// ===== CHARTS =====

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface SalesComparison {
  period: string
  efectivo: number
  digital: number
  total: number
}

export interface InventoryStockLevel {
  categoryName: string
  totalStock: number
  lowStockCount: number
}

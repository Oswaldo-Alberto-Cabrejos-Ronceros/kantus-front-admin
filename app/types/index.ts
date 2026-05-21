export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

// ===== CARTA (MENU) =====

export interface Category {
  id: number
  name: string
  description?: string
  status: boolean
}

export interface Product {
  id: number
  categoryId: number
  imageUrl?: string        // No es parte del ProductRequest del backend, se gestiona aparte
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

// Backend devuelve status en MAYÚSCULAS
export type OrderStatus = 'PENDIENTE' | 'PREPARANDO' | 'LISTO' | 'CAMINO' | 'ENTREGADO' | 'CANCELADO'
// Alias legibles para la UI
export type OrderStatusDisplay = 'Pendiente' | 'Preparando' | 'Listo' | 'Camino' | 'Entregado' | 'Cancelado'

// Backend devuelve type en MAYÚSCULAS
export type OrderType = 'SALON' | 'DELIVERY'

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
  paymentMethod?: string
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
  description?: string
  status?: boolean
}

export interface ProductInventory {
  id: number
  name: string
  description?: string
  categoryId: number
  unitary: string          // Backend usa "unitary" (no "unidad")
  status?: boolean
}

export type MovementType = 'ENTRADA' | 'SALIDA'

export interface MovementInventory {
  id: number
  fecha: string | Date
  productInventoryId: number    // Backend usa "productInventoryId" (no "productId")
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
  id?: number
  productName: string
  quantity: number
  totalCollected: number
}

// Backend usa valores en MAYÚSCULAS
export type SaleMethod = 'EFECTIVO' | 'TARJETA' | 'YAPE' | 'MERCADO_PAGO'

export interface Sale {
  id: number | string
  fecha: string | Date
  codigo: string
  metodo: SaleMethod
  monto: number
  orderId?: number
}

// ===== EMPLOYEES =====

export type DocumentType = 'DNI' | 'CE'
export type EmployeePosition = 'Administrative' | 'Chef' | 'Waiter' | 'Cashier' | 'Delivery'
export type ContractType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT'

export interface Employee {
  id: number | string
  name: string
  lastname: string
  documentType: DocumentType
  documentNumber: string
  position: EmployeePosition
  contractType: ContractType
  weeklyHours: number       // Backend: weeklyHours (no hoursWeek)
  hourlyWage: number
  status: boolean
  // System user fields
  userRole?: UserRole
  hasSystemUser?: boolean
  email?: string
}

// ===== CASHBOX =====

// Backend usa MAYÚSCULAS
export type CashBoxStatus = 'ABIERTA' | 'CERRADA'

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
// Backend usa MAYÚSCULAS
export type MovementCashboxType = 'INGRESO' | 'EGRESO'

export interface MovementCashbox {
  id: number | string
  cashBoxId: number         // Backend requiere cashBoxId
  dia: string | Date
  hora: string
  codigoPedidos?: string
  tipoComprobante?: string
  descripcion: string       // Backend: requerido (no opcional)
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
  capacity?: number         // Backend requiere capacity en request
  occupied: boolean
  status?: boolean
  order?: Order
  qrUrl?: string
}

// ===== AUTH =====

// Backend usa MAYÚSCULAS internamente, pero el login devuelve el role mapeado
export type UserRole = 'Admin' | 'Mozo' | 'Cajero' | 'Cocinero' | 'Delivery' | 'Cliente'
// Roles internos del backend (para CreateUserDto)
export type BackendUserRole = 'ADMIN' | 'MOZO' | 'CAJERO' | 'COCINERO' | 'DELIVERY'

export interface AuthRequest {
  email: string
  password: string
}

export interface AuthResponse {
  id: number | string
  name: string
  lastname: string
  role: BackendUserRole
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

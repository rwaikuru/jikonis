export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  available: boolean
  preparationTime: number // in minutes
}

export interface Table {
  id: string
  number: number
  capacity: number
  status: "available" | "occupied" | "reserved" | "cleaning"
  currentOrder?: string
}

export interface Order {
  id: string
  tableId: string
  items: OrderItem[]
  status: "pending" | "preparing" | "ready" | "served" | "paid"
  total: number
  createdAt: Date
  updatedAt: Date
  customerName?: string
  notes?: string
}

export interface OrderItem {
  menuItemId: string
  quantity: number
  notes?: string
  price: number
}

export interface Staff {
  id: string
  name: string
  role: "waiter" | "chef" | "manager" | "host"
  email: string
  phone: string
  active: boolean
}

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  activeOrders: number
  availableTables: number
  occupiedTables: number
}

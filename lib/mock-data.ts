import type { MenuItem, Table, Order, Staff, DashboardStats } from "./types"

export const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Ugali",
    description: "Traditional Kenyan staple made from maize flour",
    price: 150,
    category: "Main Course",
    available: true,
    preparationTime: 15,
  },
  {
    id: "2",
    name: "Nyama Choma",
    description: "Grilled beef served with kachumbari",
    price: 800,
    category: "Main Course",
    available: true,
    preparationTime: 30,
  },
  {
    id: "3",
    name: "Sukuma Wiki",
    description: "Sautéed collard greens with onions and tomatoes",
    price: 200,
    category: "Vegetable",
    available: true,
    preparationTime: 10,
  },
  {
    id: "4",
    name: "Chapati",
    description: "Soft flatbread perfect with stews",
    price: 50,
    category: "Bread",
    available: true,
    preparationTime: 5,
  },
  {
    id: "5",
    name: "Mandazi",
    description: "Sweet fried dough, perfect for breakfast or snack",
    price: 30,
    category: "Snack",
    available: true,
    preparationTime: 8,
  },
  {
    id: "6",
    name: "Chai",
    description: "Kenyan spiced tea with milk and sugar",
    price: 80,
    category: "Beverage",
    available: true,
    preparationTime: 5,
  },
  {
    id: "7",
    name: "Pilau",
    description: "Spiced rice with meat and aromatic spices",
    price: 400,
    category: "Main Course",
    available: true,
    preparationTime: 25,
  },
  {
    id: "8",
    name: "Githeri",
    description: "Mixed beans and maize with vegetables",
    price: 250,
    category: "Main Course",
    available: true,
    preparationTime: 20,
  },
]

export const mockTables: Table[] = [
  { id: "1", number: 1, capacity: 2, status: "available" },
  { id: "2", number: 2, capacity: 4, status: "occupied", currentOrder: "order-1" },
  { id: "3", number: 3, capacity: 6, status: "available" },
  { id: "4", number: 4, capacity: 2, status: "reserved" },
  { id: "5", number: 5, capacity: 4, status: "cleaning" },
  { id: "6", number: 6, capacity: 8, status: "available" },
]

export const mockOrders: Order[] = [
  {
    id: "order-1",
    tableId: "2",
    items: [
      { menuItemId: "1", quantity: 2, price: 150 },
      { menuItemId: "2", quantity: 1, price: 800 },
    ],
    status: "preparing",
    total: 1750,
    createdAt: new Date(),
    updatedAt: new Date(),
    customerName: "John Smith",
  },
  {
    id: "order-2",
    tableId: "4",
    items: [
      { menuItemId: "3", quantity: 1, price: 200 },
      { menuItemId: "4", quantity: 2, price: 50 },
    ],
    status: "pending",
    total: 300,
    createdAt: new Date(),
    updatedAt: new Date(),
    customerName: "Sarah Johnson",
  },
]

export const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Alice Johnson",
    role: "manager",
    email: "alice@jikonis.com",
    phone: "555-0101",
    active: true,
  },
  {
    id: "2",
    name: "Bob Wilson",
    role: "chef",
    email: "bob@jikonis.com",
    phone: "555-0102",
    active: true,
  },
  {
    id: "3",
    name: "Carol Davis",
    role: "waiter",
    email: "carol@jikonis.com",
    phone: "555-0103",
    active: true,
  },
]

export const mockDashboardStats: DashboardStats = {
  totalOrders: 47,
  totalRevenue: 1247.83,
  activeOrders: 8,
  availableTables: 4,
  occupiedTables: 2,
}

export const mockAnalytics = {
  dailySales: [
    { date: "2024-01-15", revenue: 15420, orders: 45 },
    { date: "2024-01-16", revenue: 18230, orders: 52 },
    { date: "2024-01-17", revenue: 16890, orders: 48 },
    { date: "2024-01-18", revenue: 21340, orders: 61 },
    { date: "2024-01-19", revenue: 19560, orders: 55 },
  ],
  topSellingDishes: [
    { name: "Nyama Choma", orders: 156, revenue: 124800 },
    { name: "Ugali", orders: 203, revenue: 30450 },
    { name: "Pilau", orders: 89, revenue: 35600 },
    { name: "Chai", orders: 245, revenue: 19600 },
    { name: "Sukuma Wiki", orders: 134, revenue: 26800 },
  ],
  paymentMix: {
    cash: 45,
    card: 30,
    mpesa: 25,
  },
  tableMetrics: {
    averageTicketSize: 1250,
    turnoverRate: 3.2,
    averageServiceTime: 45,
  },
}

import { OrderManagement } from "@/components/order-management"
import { Sidebar } from "@/components/sidebar"

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground font-sans">Order Management</h1>
            <p className="text-muted-foreground mt-2 font-serif">Track and manage all restaurant orders</p>
          </div>
          <OrderManagement />
        </div>
      </main>
    </div>
  )
}

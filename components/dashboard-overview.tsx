import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockDashboardStats, mockOrders, mockTables } from "@/lib/mock-data"
import { DollarSign, ShoppingCart, Clock, Users } from "lucide-react"

export function DashboardOverview() {
  const stats = mockDashboardStats
  const recentOrders = mockOrders.slice(0, 3)
  const tables = mockTables

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-primary text-primary-foreground"
      case "occupied":
        return "bg-secondary text-secondary-foreground"
      case "reserved":
        return "bg-accent text-accent-foreground"
      case "cleaning":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-accent text-accent-foreground"
      case "preparing":
        return "bg-secondary text-secondary-foreground"
      case "ready":
        return "bg-primary text-primary-foreground"
      case "served":
        return "bg-chart-1 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-serif">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-primary-foreground/80 font-serif">Today's earnings</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary to-red-600 text-secondary-foreground border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-serif">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-secondary-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">{stats.totalOrders}</div>
            <p className="text-xs text-secondary-foreground/80 font-serif">Orders processed today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent to-yellow-500 text-accent-foreground border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-serif">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-accent-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">{stats.activeOrders}</div>
            <p className="text-xs text-accent-foreground/80 font-serif">Currently being prepared</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-700 to-slate-800 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-serif">Available Tables</CardTitle>
            <Users className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">
              {stats.availableTables}/{tables.length}
            </div>
            <p className="text-xs text-white/80 font-serif">Tables ready for guests</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Table Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardTitle className="font-sans text-primary">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-accent/5 rounded-lg border border-primary/10"
                >
                  <div>
                    <p className="font-medium font-serif text-primary">
                      Table {mockTables.find((t) => t.id === order.tableId)?.number}
                    </p>
                    <p className="text-sm text-muted-foreground font-serif">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getOrderStatusColor(order.status)}>{order.status}</Badge>
                    <p className="text-sm font-medium font-sans mt-1 text-accent">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table Status */}
        <Card className="border-secondary/20">
          <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10">
            <CardTitle className="font-sans text-secondary">Table Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-3">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className="text-center p-3 bg-gradient-to-br from-muted/30 to-primary/5 rounded-lg border border-primary/10"
                >
                  <div className="text-lg font-bold font-sans mb-1 text-primary">Table {table.number}</div>
                  <Badge className={getTableStatusColor(table.status)}>{table.status}</Badge>
                  <p className="text-xs text-muted-foreground mt-1 font-serif">Seats {table.capacity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

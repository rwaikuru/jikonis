"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp, DollarSign, Users, Clock } from "lucide-react"
import { mockAnalytics } from "@/lib/mock-data"

export function AnalyticsDashboard() {
  const handleExport = (format: "csv" | "xlsx") => {
    // Mock export functionality
    console.log(`[v0] Exporting data as ${format.toUpperCase()}`)
    alert(`Exporting data as ${format.toUpperCase()}...`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your restaurant's performance and insights</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport("xlsx")}>
            <Download className="mr-2 h-4 w-4" />
            Export XLSX
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="dishes">Top Dishes</TabsTrigger>
          <TabsTrigger value="payments">Payment Mix</TabsTrigger>
          <TabsTrigger value="tables">Table Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockAnalytics.dailySales.map((day, index) => (
              <Card key={day.date}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {new Date(day.date).toLocaleDateString("en-KE", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KSh {day.revenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{day.orders} orders</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dishes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Top Selling Dishes
              </CardTitle>
              <CardDescription>Most popular items by order count and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.topSellingDishes.map((dish, index) => (
                  <div key={dish.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{dish.name}</p>
                        <p className="text-sm text-muted-foreground">{dish.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">KSh {dish.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash Payments</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.paymentMix.cash}%</div>
                <p className="text-xs text-muted-foreground">of total transactions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Card Payments</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.paymentMix.card}%</div>
                <p className="text-xs text-muted-foreground">of total transactions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">M-Pesa Payments</CardTitle>
                <DollarSign className="h-4 w-4 text-green-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.paymentMix.mpesa}%</div>
                <p className="text-xs text-muted-foreground">of total transactions</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Ticket Size</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  KSh {mockAnalytics.tableMetrics.averageTicketSize.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">per table visit</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.tableMetrics.turnoverRate}x</div>
                <p className="text-xs text-muted-foreground">tables per day</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Service Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.tableMetrics.averageServiceTime} min</div>
                <p className="text-xs text-muted-foreground">per table</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

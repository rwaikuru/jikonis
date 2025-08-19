"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { mockOrders, mockTables, mockMenuItems } from "@/lib/mock-data"
import type { Order, OrderItem } from "@/lib/types"
import { Plus, Clock, DollarSign, User, MapPin, Eye } from "lucide-react"

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false)

  const statusOptions = ["all", "pending", "preparing", "ready", "served", "paid"]

  // Filter orders based on status
  const filteredOrders = orders.filter((order) => statusFilter === "all" || order.status === statusFilter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-chart-3 text-white"
      case "preparing":
        return "bg-chart-4 text-white"
      case "ready":
        return "bg-chart-2 text-white"
      case "served":
        return "bg-chart-1 text-white"
      case "paid":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getNextStatus = (currentStatus: string): string | null => {
    const statusFlow = ["pending", "preparing", "ready", "served", "paid"]
    const currentIndex = statusFlow.indexOf(currentStatus)
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus as Order["status"], updatedAt: new Date() } : order,
      ),
    )
  }

  const handleNewOrder = (newOrder: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    const order: Order = {
      ...newOrder,
      id: `order-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setOrders([order, ...orders])
    setIsNewOrderDialogOpen(false)
  }

  const getTableNumber = (tableId: string) => {
    return mockTables.find((table) => table.id === tableId)?.number || "Unknown"
  }

  const getMenuItemName = (menuItemId: string) => {
    return mockMenuItems.find((item) => item.id === menuItemId)?.name || "Unknown Item"
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 font-serif">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status} className="font-serif">
                  {status === "all" ? "All Orders" : status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* New Order Button */}
        <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-serif">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-sans">Create New Order</DialogTitle>
            </DialogHeader>
            <NewOrderForm onSubmit={handleNewOrder} onCancel={() => setIsNewOrderDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-sans">Order #{order.id.split("-")[1]}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-serif">
                      Table {getTableNumber(order.tableId)}
                    </span>
                  </div>
                </div>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              {order.customerName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-serif">{order.customerName}</span>
                </div>
              )}

              {/* Order Items Preview */}
              <div className="space-y-1">
                <p className="text-sm font-medium font-serif">Items ({order.items.length}):</p>
                {order.items.slice(0, 2).map((item, index) => (
                  <p key={index} className="text-sm text-muted-foreground font-serif">
                    {item.quantity}x {getMenuItemName(item.menuItemId)}
                  </p>
                ))}
                {order.items.length > 2 && (
                  <p className="text-sm text-muted-foreground font-serif">+{order.items.length - 2} more items</p>
                )}
              </div>

              {/* Total and Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold font-sans">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-serif">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="p-2 bg-muted rounded text-sm font-serif">
                  <strong>Notes:</strong> {order.notes}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 font-serif bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-sans">Order Details</DialogTitle>
                    </DialogHeader>
                    <OrderDetails order={order} />
                  </DialogContent>
                </Dialog>

                {getNextStatus(order.status) && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                    className="flex-1 font-serif"
                  >
                    Mark {getNextStatus(order.status)}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground font-serif">No orders found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

interface OrderDetailsProps {
  order: Order
}

function OrderDetails({ order }: OrderDetailsProps) {
  const getTableNumber = (tableId: string) => {
    return mockTables.find((table) => table.id === tableId)?.number || "Unknown"
  }

  const getMenuItemName = (menuItemId: string) => {
    return mockMenuItems.find((item) => item.id === menuItemId)?.name || "Unknown Item"
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium font-serif">Order ID:</p>
          <p className="text-muted-foreground font-serif">#{order.id.split("-")[1]}</p>
        </div>
        <div>
          <p className="font-medium font-serif">Table:</p>
          <p className="text-muted-foreground font-serif">{getTableNumber(order.tableId)}</p>
        </div>
        <div>
          <p className="font-medium font-serif">Customer:</p>
          <p className="text-muted-foreground font-serif">{order.customerName || "Walk-in"}</p>
        </div>
        <div>
          <p className="font-medium font-serif">Status:</p>
          <Badge className="text-xs">{order.status}</Badge>
        </div>
      </div>

      <div>
        <p className="font-medium font-serif mb-2">Order Items:</p>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
              <div>
                <p className="font-medium font-serif">{getMenuItemName(item.menuItemId)}</p>
                <p className="text-sm text-muted-foreground font-serif">Qty: {item.quantity}</p>
                {item.notes && <p className="text-sm text-muted-foreground font-serif">Note: {item.notes}</p>}
              </div>
              <p className="font-bold font-sans">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <p className="font-bold font-serif">Total:</p>
          <p className="font-bold text-lg font-sans">${order.total.toFixed(2)}</p>
        </div>
      </div>

      {order.notes && (
        <div>
          <p className="font-medium font-serif mb-2">Special Notes:</p>
          <p className="text-sm text-muted-foreground p-2 bg-muted rounded font-serif">{order.notes}</p>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1 font-serif">
        <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
        <p>Updated: {new Date(order.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  )
}

interface NewOrderFormProps {
  onSubmit: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

function NewOrderForm({ onSubmit, onCancel }: NewOrderFormProps) {
  const [formData, setFormData] = useState({
    tableId: "",
    customerName: "",
    notes: "",
    items: [] as OrderItem[],
  })

  const [selectedMenuItem, setSelectedMenuItem] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [itemNotes, setItemNotes] = useState("")

  const availableTables = mockTables.filter((table) => table.status === "available")
  const availableMenuItems = mockMenuItems.filter((item) => item.available)

  const addItem = () => {
    if (!selectedMenuItem) return

    const menuItem = mockMenuItems.find((item) => item.id === selectedMenuItem)
    if (!menuItem) return

    const newItem: OrderItem = {
      menuItemId: selectedMenuItem,
      quantity,
      price: menuItem.price,
      notes: itemNotes || undefined,
    }

    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    })

    // Reset item form
    setSelectedMenuItem("")
    setQuantity(1)
    setItemNotes("")
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.tableId || formData.items.length === 0) return

    onSubmit({
      tableId: formData.tableId,
      customerName: formData.customerName || undefined,
      notes: formData.notes || undefined,
      items: formData.items,
      status: "pending",
      total: calculateTotal(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium font-serif">Table</label>
          <Select value={formData.tableId} onValueChange={(value) => setFormData({ ...formData, tableId: value })}>
            <SelectTrigger className="font-serif">
              <SelectValue placeholder="Select table" />
            </SelectTrigger>
            <SelectContent>
              {availableTables.map((table) => (
                <SelectItem key={table.id} value={table.id} className="font-serif">
                  Table {table.number} (Seats {table.capacity})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium font-serif">Customer Name</label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md font-serif"
            placeholder="Optional"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium font-serif">Special Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-input rounded-md font-serif"
          rows={2}
          placeholder="Any special requests..."
        />
      </div>

      {/* Add Items Section */}
      <div className="border-t pt-4">
        <h4 className="font-medium font-sans mb-3">Add Items</h4>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Select value={selectedMenuItem} onValueChange={setSelectedMenuItem}>
            <SelectTrigger className="font-serif">
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {availableMenuItems.map((item) => (
                <SelectItem key={item.id} value={item.id} className="font-serif">
                  {item.name} - ${item.price.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
            className="px-3 py-2 border border-input rounded-md font-serif"
            placeholder="Qty"
          />
        </div>

        <input
          type="text"
          value={itemNotes}
          onChange={(e) => setItemNotes(e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md mb-2 font-serif"
          placeholder="Item notes (optional)"
        />

        <Button type="button" onClick={addItem} disabled={!selectedMenuItem} className="w-full font-serif">
          Add Item
        </Button>
      </div>

      {/* Order Items List */}
      {formData.items.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-medium font-sans mb-3">Order Items</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {formData.items.map((item, index) => {
              const menuItem = mockMenuItems.find((mi) => mi.id === item.menuItemId)
              return (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium font-serif">{menuItem?.name}</p>
                    <p className="text-sm text-muted-foreground font-serif">
                      {item.quantity}x ${item.price.toFixed(2)}
                      {item.notes && ` - ${item.notes}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-sans">${(item.price * item.quantity).toFixed(2)}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t">
            <span className="font-bold font-serif">Total:</span>
            <span className="font-bold text-lg font-sans">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 font-serif" disabled={!formData.tableId || formData.items.length === 0}>
          Create Order
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 font-serif bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}

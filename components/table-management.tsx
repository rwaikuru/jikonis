"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockTables, mockOrders } from "@/lib/mock-data"
import type { Table } from "@/lib/types"
import { Users, Clock, Settings, Plus, Eye } from "lucide-react"

export function TableManagement() {
  const [tables, setTables] = useState<Table[]>(mockTables)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [isAddTableDialogOpen, setIsAddTableDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "floor">("floor")

  const statusOptions = ["all", "available", "occupied", "reserved", "cleaning"]

  // Filter tables based on status
  const filteredTables = tables.filter((table) => statusFilter === "all" || table.status === statusFilter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-chart-2 text-white"
      case "occupied":
        return "bg-chart-3 text-white"
      case "reserved":
        return "bg-chart-4 text-white"
      case "cleaning":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const updateTableStatus = (tableId: string, newStatus: Table["status"]) => {
    setTables(tables.map((table) => (table.id === tableId ? { ...table, status: newStatus } : table)))
  }

  const handleAddTable = (newTable: Omit<Table, "id">) => {
    const table: Table = {
      ...newTable,
      id: Date.now().toString(),
    }
    setTables([...tables, table])
    setIsAddTableDialogOpen(false)
  }

  const getTableOrder = (tableId: string) => {
    return mockOrders.find((order) => order.tableId === tableId)
  }

  const statusCounts = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    cleaning: tables.filter((t) => t.status === "cleaning").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-serif">Available</p>
                <p className="text-2xl font-bold text-chart-2 font-sans">{statusCounts.available}</p>
              </div>
              <div className="h-8 w-8 bg-chart-2 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-serif">Occupied</p>
                <p className="text-2xl font-bold text-chart-3 font-sans">{statusCounts.occupied}</p>
              </div>
              <div className="h-8 w-8 bg-chart-3 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-serif">Reserved</p>
                <p className="text-2xl font-bold text-chart-4 font-sans">{statusCounts.reserved}</p>
              </div>
              <div className="h-8 w-8 bg-chart-4 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-serif">Cleaning</p>
                <p className="text-2xl font-bold text-muted-foreground font-sans">{statusCounts.cleaning}</p>
              </div>
              <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4">
          {/* View Mode Toggle */}
          <Select value={viewMode} onValueChange={(value: "grid" | "floor") => setViewMode(value)}>
            <SelectTrigger className="w-32 font-serif">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="floor" className="font-serif">
                Floor Plan
              </SelectItem>
              <SelectItem value="grid" className="font-serif">
                Grid View
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 font-serif">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status} className="font-serif">
                  {status === "all" ? "All Tables" : status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Table Button */}
        <Dialog open={isAddTableDialogOpen} onOpenChange={setIsAddTableDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-serif">
              <Plus className="h-4 w-4 mr-2" />
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-sans">Add New Table</DialogTitle>
            </DialogHeader>
            <AddTableForm onSubmit={handleAddTable} onCancel={() => setIsAddTableDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tables Display */}
      {viewMode === "floor" ? (
        <FloorPlanView tables={filteredTables} onTableClick={setSelectedTable} onStatusChange={updateTableStatus} />
      ) : (
        <GridView tables={filteredTables} onTableClick={setSelectedTable} onStatusChange={updateTableStatus} />
      )}

      {/* Table Details Dialog */}
      <Dialog open={!!selectedTable} onOpenChange={(open) => !open && setSelectedTable(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-sans">Table {selectedTable?.number} Details</DialogTitle>
          </DialogHeader>
          {selectedTable && (
            <TableDetails
              table={selectedTable}
              onStatusChange={updateTableStatus}
              onClose={() => setSelectedTable(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface FloorPlanViewProps {
  tables: Table[]
  onTableClick: (table: Table) => void
  onStatusChange: (tableId: string, status: Table["status"]) => void
}

function FloorPlanView({ tables, onTableClick, onStatusChange }: FloorPlanViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-chart-2 hover:bg-chart-2/80 border-chart-2"
      case "occupied":
        return "bg-chart-3 hover:bg-chart-3/80 border-chart-3"
      case "reserved":
        return "bg-chart-4 hover:bg-chart-4/80 border-chart-4"
      case "cleaning":
        return "bg-muted hover:bg-muted/80 border-muted"
      default:
        return "bg-muted hover:bg-muted/80 border-muted"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans">Restaurant Floor Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-muted/20 rounded-lg p-8 min-h-96">
          {/* Simulated floor plan layout */}
          <div className="grid grid-cols-6 gap-6 h-full">
            {tables.map((table, index) => {
              const sizeClass =
                table.capacity <= 2
                  ? "w-16 h-16"
                  : table.capacity <= 4
                    ? "w-20 h-20"
                    : table.capacity <= 6
                      ? "w-24 h-24"
                      : "w-28 h-28"

              return (
                <div
                  key={table.id}
                  className={`
                    ${sizeClass} ${getStatusColor(table.status)}
                    rounded-lg border-2 cursor-pointer transition-all duration-200
                    flex flex-col items-center justify-center text-white font-bold
                    hover:scale-105 shadow-md
                  `}
                  onClick={() => onTableClick(table)}
                  style={{
                    gridColumn: `${(index % 3) + 1} / span 1`,
                    gridRow: `${Math.floor(index / 3) + 1} / span 1`,
                  }}
                >
                  <span className="text-lg font-sans">{table.number}</span>
                  <span className="text-xs font-serif">{table.capacity} seats</span>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-background border rounded-lg p-3 shadow-md">
            <p className="text-sm font-medium font-serif mb-2">Status Legend</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-chart-2 rounded"></div>
                <span className="font-serif">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-chart-3 rounded"></div>
                <span className="font-serif">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-chart-4 rounded"></div>
                <span className="font-serif">Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-muted rounded"></div>
                <span className="font-serif">Cleaning</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface GridViewProps {
  tables: Table[]
  onTableClick: (table: Table) => void
  onStatusChange: (tableId: string, status: Table["status"]) => void
}

function GridView({ tables, onTableClick, onStatusChange }: GridViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-chart-2 text-white"
      case "occupied":
        return "bg-chart-3 text-white"
      case "reserved":
        return "bg-chart-4 text-white"
      case "cleaning":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTableOrder = (tableId: string) => {
    return mockOrders.find((order) => order.tableId === tableId)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tables.map((table) => {
        const order = getTableOrder(table.id)
        return (
          <Card key={table.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-sans">Table {table.number}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-serif">{table.capacity} seats</span>
                  </div>
                </div>
                <Badge className={getStatusColor(table.status)}>{table.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Order Info */}
              {order && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium font-serif">Current Order</p>
                  <p className="text-sm text-muted-foreground font-serif">
                    {order.customerName || "Walk-in"} - ${order.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground font-serif">Status: {order.status}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onTableClick(table)} className="flex-1 font-serif">
                  <Eye className="h-4 w-4 mr-2" />
                  Details
                </Button>

                <Select
                  value={table.status}
                  onValueChange={(value: Table["status"]) => onStatusChange(table.id, value)}
                >
                  <SelectTrigger className="flex-1 font-serif">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available" className="font-serif">
                      Available
                    </SelectItem>
                    <SelectItem value="occupied" className="font-serif">
                      Occupied
                    </SelectItem>
                    <SelectItem value="reserved" className="font-serif">
                      Reserved
                    </SelectItem>
                    <SelectItem value="cleaning" className="font-serif">
                      Cleaning
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

interface TableDetailsProps {
  table: Table
  onStatusChange: (tableId: string, status: Table["status"]) => void
  onClose: () => void
}

function TableDetails({ table, onStatusChange, onClose }: TableDetailsProps) {
  const order = mockOrders.find((o) => o.tableId === table.id)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium font-serif">Table Number:</p>
          <p className="text-muted-foreground font-sans">{table.number}</p>
        </div>
        <div>
          <p className="font-medium font-serif">Capacity:</p>
          <p className="text-muted-foreground font-sans">{table.capacity} seats</p>
        </div>
        <div>
          <p className="font-medium font-serif">Current Status:</p>
          <Badge className="text-xs">{table.status}</Badge>
        </div>
        <div>
          <p className="font-medium font-serif">Location:</p>
          <p className="text-muted-foreground font-serif">Main dining area</p>
        </div>
      </div>

      {order && (
        <div className="border-t pt-4">
          <p className="font-medium font-serif mb-2">Current Order:</p>
          <div className="p-3 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-serif">Customer:</span>
              <span className="font-serif">{order.customerName || "Walk-in"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-serif">Order Total:</span>
              <span className="font-sans font-bold">${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-serif">Status:</span>
              <Badge className="text-xs">{order.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-serif">Items:</span>
              <span className="font-serif">{order.items.length} items</span>
            </div>
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <Label className="font-serif">Change Status:</Label>
        <Select value={table.status} onValueChange={(value: Table["status"]) => onStatusChange(table.id, value)}>
          <SelectTrigger className="w-full mt-2 font-serif">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available" className="font-serif">
              Available
            </SelectItem>
            <SelectItem value="occupied" className="font-serif">
              Occupied
            </SelectItem>
            <SelectItem value="reserved" className="font-serif">
              Reserved
            </SelectItem>
            <SelectItem value="cleaning" className="font-serif">
              Cleaning
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={onClose} className="flex-1 font-serif">
          Close
        </Button>
      </div>
    </div>
  )
}

interface AddTableFormProps {
  onSubmit: (table: Omit<Table, "id">) => void
  onCancel: () => void
}

function AddTableForm({ onSubmit, onCancel }: AddTableFormProps) {
  const [formData, setFormData] = useState({
    number: 0,
    capacity: 2,
    status: "available" as Table["status"],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="number" className="font-serif">
          Table Number
        </Label>
        <Input
          id="number"
          type="number"
          min="1"
          value={formData.number || ""}
          onChange={(e) => setFormData({ ...formData, number: Number.parseInt(e.target.value) || 0 })}
          required
          className="font-serif"
        />
      </div>

      <div>
        <Label htmlFor="capacity" className="font-serif">
          Seating Capacity
        </Label>
        <Select
          value={formData.capacity.toString()}
          onValueChange={(value) => setFormData({ ...formData, capacity: Number.parseInt(value) })}
        >
          <SelectTrigger className="font-serif">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2" className="font-serif">
              2 seats
            </SelectItem>
            <SelectItem value="4" className="font-serif">
              4 seats
            </SelectItem>
            <SelectItem value="6" className="font-serif">
              6 seats
            </SelectItem>
            <SelectItem value="8" className="font-serif">
              8 seats
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status" className="font-serif">
          Initial Status
        </Label>
        <Select
          value={formData.status}
          onValueChange={(value: Table["status"]) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger className="font-serif">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available" className="font-serif">
              Available
            </SelectItem>
            <SelectItem value="cleaning" className="font-serif">
              Cleaning
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 font-serif">
          Add Table
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 font-serif bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}

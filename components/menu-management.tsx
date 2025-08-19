"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { mockMenuItems } from "@/lib/mock-data"
import type { MenuItem } from "@/lib/types"
import { Plus, Search, Edit, Trash2, Clock, DollarSign } from "lucide-react"

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(menuItems.map((item) => item.category)))]

  // Filter items based on search and category
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddItem = (newItem: Omit<MenuItem, "id">) => {
    const item: MenuItem = {
      ...newItem,
      id: Date.now().toString(),
    }
    setMenuItems([...menuItems, item])
    setIsAddDialogOpen(false)
  }

  const handleEditItem = (updatedItem: MenuItem) => {
    setMenuItems(menuItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    setEditingItem(null)
  }

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id))
  }

  const toggleAvailability = (id: string) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 font-serif"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 font-serif">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="font-serif">
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Item Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-serif">
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-sans">Add New Menu Item</DialogTitle>
            </DialogHeader>
            <MenuItemForm onSubmit={handleAddItem} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className={`${!item.available ? "opacity-60" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-sans">{item.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1 font-serif">
                    {item.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.available}
                    onCheckedChange={() => toggleAvailability(item.id)}
                    aria-label="Toggle availability"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground font-serif">{item.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold font-sans">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-serif">{item.preparationTime}min</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog open={editingItem?.id === item.id} onOpenChange={(open) => !open && setEditingItem(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingItem(item)}
                      className="flex-1 font-serif"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-sans">Edit Menu Item</DialogTitle>
                    </DialogHeader>
                    {editingItem && (
                      <MenuItemForm
                        initialData={editingItem}
                        onSubmit={handleEditItem}
                        onCancel={() => setEditingItem(null)}
                      />
                    )}
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-destructive hover:text-destructive font-serif"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground font-serif">No menu items found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

interface MenuItemFormProps {
  initialData?: MenuItem
  onSubmit: (item: MenuItem | Omit<MenuItem, "id">) => void
  onCancel: () => void
}

function MenuItemForm({ initialData, onSubmit, onCancel }: MenuItemFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || "",
    preparationTime: initialData?.preparationTime || 0,
    available: initialData?.available ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialData) {
      onSubmit({ ...initialData, ...formData })
    } else {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="font-serif">
          Name
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="font-serif"
        />
      </div>

      <div>
        <Label htmlFor="description" className="font-serif">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="font-serif"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="font-serif">
            Price ($)
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
            required
            className="font-serif"
          />
        </div>

        <div>
          <Label htmlFor="preparationTime" className="font-serif">
            Prep Time (min)
          </Label>
          <Input
            id="preparationTime"
            type="number"
            min="1"
            value={formData.preparationTime}
            onChange={(e) => setFormData({ ...formData, preparationTime: Number.parseInt(e.target.value) || 0 })}
            required
            className="font-serif"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category" className="font-serif">
          Category
        </Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          className="font-serif"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="available"
          checked={formData.available}
          onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
        />
        <Label htmlFor="available" className="font-serif">
          Available
        </Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 font-serif">
          {initialData ? "Update Item" : "Add Item"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 font-serif bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}

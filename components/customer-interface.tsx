"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { mockMenuItems, mockTables } from "@/lib/mock-data"
import type { MenuItem, OrderItem } from "@/lib/types"
import { Plus, Minus, ShoppingCart, Clock, DollarSign, ChefHat, Search, Bell, CheckCircle } from "lucide-react"

interface CartItem extends OrderItem {
  menuItem: MenuItem
}

export function CustomerInterface() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [customerName, setCustomerName] = useState("")
  const [orderNotes, setOrderNotes] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const [currentView, setCurrentView] = useState<"menu" | "order-status">("menu")

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(mockMenuItems.map((item) => item.category)))]

  // Filter menu items
  const filteredItems = mockMenuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory && item.available
  })

  const addToCart = (menuItem: MenuItem, quantity = 1, notes?: string) => {
    const existingItem = cart.find((item) => item.menuItemId === menuItem.id && item.notes === notes)

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.menuItemId === menuItem.id && item.notes === notes
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      )
    } else {
      const cartItem: CartItem = {
        menuItemId: menuItem.id,
        quantity,
        price: menuItem.price,
        notes,
        menuItem,
      }
      setCart([...cart, cartItem])
    }
  }

  const updateCartItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter((_, i) => i !== index))
    } else {
      setCart(cart.map((item, i) => (i === index ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handlePlaceOrder = () => {
    if (cart.length === 0 || !selectedTable) return

    // Simulate order placement
    setIsOrderPlaced(true)
    setCurrentView("order-status")
    setIsCartOpen(false)

    // Clear cart after order
    setTimeout(() => {
      setCart([])
    }, 1000)
  }

  const availableTables = mockTables.filter((table) => table.status === "available")

  if (currentView === "order-status") {
    return <OrderStatusView onBackToMenu={() => setCurrentView("menu")} customerName={customerName} />
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <ChefHat className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-foreground font-sans">Jikonis</h1>
        </div>
        <p className="text-muted-foreground font-serif">
          Welcome to our restaurant! Browse our menu and place your order.
        </p>
      </div>

      {/* Table Selection */}
      {!selectedTable && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-sans">Select Your Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableTables.map((table) => (
                <Button
                  key={table.id}
                  variant="outline"
                  onClick={() => setSelectedTable(table.id)}
                  className="h-16 font-serif"
                >
                  <div className="text-center">
                    <div className="font-bold font-sans">Table {table.number}</div>
                    <div className="text-sm text-muted-foreground">{table.capacity} seats</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTable && (
        <>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-serif"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 font-serif">
                  <SelectValue placeholder="All Categories" />
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

            {/* Cart Button */}
            <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
              <DialogTrigger asChild>
                <Button className="relative font-serif">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {getCartItemCount() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {getCartItemCount()}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-sans">Your Order</DialogTitle>
                </DialogHeader>
                <CartView
                  cart={cart}
                  onUpdateQuantity={updateCartItemQuantity}
                  onPlaceOrder={handlePlaceOrder}
                  selectedTable={selectedTable}
                  customerName={customerName}
                  setCustomerName={setCustomerName}
                  orderNotes={orderNotes}
                  setOrderNotes={setOrderNotes}
                  availableTables={availableTables}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Selected Table Info */}
          <div className="mb-6">
            <Badge variant="outline" className="font-serif">
              Table {mockTables.find((t) => t.id === selectedTable)?.number} Selected
            </Badge>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-serif">No menu items found matching your search.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem, quantity: number, notes?: string) => void
}

function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)

  const handleQuickAdd = () => {
    onAddToCart(item, 1)
  }

  const handleCustomAdd = () => {
    onAddToCart(item, quantity, notes || undefined)
    setQuantity(1)
    setNotes("")
    setIsCustomizeOpen(false)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-sans">{item.name}</CardTitle>
            <Badge variant="secondary" className="mt-1 font-serif">
              {item.category}
            </Badge>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-bold text-lg font-sans">${item.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground font-serif">{item.description}</p>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-serif">{item.preparationTime} min prep time</span>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleQuickAdd} className="flex-1 font-serif">
            <Plus className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>

          <Dialog open={isCustomizeOpen} onOpenChange={setIsCustomizeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="font-serif bg-transparent">
                Customize
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-sans">Customize {item.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="font-serif">Quantity</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-bold font-sans w-8 text-center">{quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="font-serif">
                    Special Instructions
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests..."
                    className="font-serif"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="font-medium font-serif">Total:</span>
                  <span className="font-bold text-lg font-sans">${(item.price * quantity).toFixed(2)}</span>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCustomAdd} className="flex-1 font-serif">
                    Add to Cart
                  </Button>
                  <Button variant="outline" onClick={() => setIsCustomizeOpen(false)} className="flex-1 font-serif">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

interface CartViewProps {
  cart: CartItem[]
  onUpdateQuantity: (index: number, quantity: number) => void
  onPlaceOrder: () => void
  selectedTable: string
  customerName: string
  setCustomerName: (name: string) => void
  orderNotes: string
  setOrderNotes: (notes: string) => void
  availableTables: any[]
}

function CartView({
  cart,
  onUpdateQuantity,
  onPlaceOrder,
  selectedTable,
  customerName,
  setCustomerName,
  orderNotes,
  setOrderNotes,
  availableTables,
}: CartViewProps) {
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground font-serif">Your cart is empty</p>
        <p className="text-sm text-muted-foreground font-serif">Add some delicious items from our menu!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {/* Cart Items */}
      <div className="space-y-3">
        {cart.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex-1">
              <p className="font-medium font-serif">{item.menuItem.name}</p>
              <p className="text-sm text-muted-foreground font-serif">${item.price.toFixed(2)} each</p>
              {item.notes && <p className="text-sm text-muted-foreground font-serif">Note: {item.notes}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-bold font-sans w-8 text-center">{item.quantity}</span>
              <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(index, item.quantity + 1)}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Info */}
      <div className="space-y-3 border-t pt-4">
        <div>
          <Label htmlFor="customerName" className="font-serif">
            Your Name (Optional)
          </Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your name"
            className="font-serif"
          />
        </div>

        <div>
          <Label htmlFor="orderNotes" className="font-serif">
            Order Notes (Optional)
          </Label>
          <Textarea
            id="orderNotes"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Any special requests for your order..."
            className="font-serif"
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium font-serif">Table:</span>
          <span className="font-serif">{availableTables.find((t) => t.id === selectedTable)?.number}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold font-serif">Total:</span>
          <span className="font-bold text-xl font-sans">${getCartTotal().toFixed(2)}</span>
        </div>

        <Button onClick={onPlaceOrder} className="w-full font-serif" disabled={cart.length === 0}>
          Place Order
        </Button>
      </div>
    </div>
  )
}

interface OrderStatusViewProps {
  onBackToMenu: () => void
  customerName: string
}

function OrderStatusView({ onBackToMenu, customerName }: OrderStatusViewProps) {
  const [orderStatus] = useState("preparing") // Simulated status

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-chart-2 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-foreground font-sans mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground font-serif">
          Thank you{customerName ? `, ${customerName}` : ""}! Your order has been received.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-sans">Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium font-serif">Current Status:</span>
              <Badge className="bg-chart-4 text-white">{orderStatus}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium font-serif">Estimated Time:</span>
              <span className="font-serif">15-20 minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium font-serif">Order Number:</span>
              <span className="font-mono">#12345</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button onClick={onBackToMenu} variant="outline" className="w-full font-serif bg-transparent">
          Back to Menu
        </Button>

        <Button className="w-full font-serif">
          <Bell className="h-4 w-4 mr-2" />
          Call for Service
        </Button>
      </div>
    </div>
  )
}

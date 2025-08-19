"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockStaff } from "@/lib/mock-data"
import type { Staff } from "@/lib/types"
import { Plus, Search, Edit, Trash2, Phone, Mail, Users, ChefHat, UserCheck, Crown } from "lucide-react"

export function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>(mockStaff)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)

  const roles = ["all", "manager", "chef", "waiter", "host"]
  const statusOptions = ["all", "active", "inactive"]

  // Filter staff based on search, role, and status
  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || member.role === roleFilter
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? member.active : !member.active)
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAddStaff = (newStaff: Omit<Staff, "id">) => {
    const staffMember: Staff = {
      ...newStaff,
      id: Date.now().toString(),
    }
    setStaff([...staff, staffMember])
    setIsAddDialogOpen(false)
  }

  const handleEditStaff = (updatedStaff: Staff) => {
    setStaff(staff.map((member) => (member.id === updatedStaff.id ? updatedStaff : member)))
    setEditingStaff(null)
  }

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((member) => member.id !== id))
  }

  const toggleStaffStatus = (id: string) => {
    setStaff(staff.map((member) => (member.id === id ? { ...member, active: !member.active } : member)))
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "manager":
        return <Crown className="h-4 w-4" />
      case "chef":
        return <ChefHat className="h-4 w-4" />
      case "waiter":
        return <UserCheck className="h-4 w-4" />
      case "host":
        return <Users className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "manager":
        return "bg-chart-4 text-white"
      case "chef":
        return "bg-chart-3 text-white"
      case "waiter":
        return "bg-chart-2 text-white"
      case "host":
        return "bg-chart-1 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const roleCounts = {
    manager: staff.filter((s) => s.role === "manager" && s.active).length,
    chef: staff.filter((s) => s.role === "chef" && s.active).length,
    waiter: staff.filter((s) => s.role === "waiter" && s.active).length,
    host: staff.filter((s) => s.role === "host" && s.active).length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-serif">Managers</p>
                <p className="text-2xl font-bold text-chart-4 font-sans">{roleCounts.manager}</p>
              </div>
              <div className="h-8 w-8 bg-chart-4 rounded-full flex items-center justify-center">
                <Crown className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-serif">Chefs</p>
                <p className="text-2xl font-bold text-chart-3 font-sans">{roleCounts.chef}</p>
              </div>
              <div className="h-8 w-8 bg-chart-3 rounded-full flex items-center justify-center">
                <ChefHat className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-serif">Waiters</p>
                <p className="text-2xl font-bold text-chart-2 font-sans">{roleCounts.waiter}</p>
              </div>
              <div className="h-8 w-8 bg-chart-2 rounded-full flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-serif">Hosts</p>
                <p className="text-2xl font-bold text-chart-1 font-sans">{roleCounts.host}</p>
              </div>
              <div className="h-8 w-8 bg-chart-1 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 font-serif"
            />
          </div>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48 font-serif">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role} className="font-serif">
                  {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 font-serif">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status} className="font-serif">
                  {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Staff Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-serif">
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-sans">Add New Staff Member</DialogTitle>
            </DialogHeader>
            <StaffForm onSubmit={handleAddStaff} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <Card key={member.id} className={`${!member.active ? "opacity-60" : ""} hover:shadow-md transition-shadow`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-sans">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-sans">{member.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleIcon(member.role)}
                      <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                    </div>
                  </div>
                </div>
                <Switch
                  checked={member.active}
                  onCheckedChange={() => toggleStaffStatus(member.id)}
                  aria-label="Toggle active status"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-serif">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-serif">{member.phone}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium font-serif">Status:</span>
                <Badge variant={member.active ? "default" : "secondary"}>{member.active ? "Active" : "Inactive"}</Badge>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Dialog open={editingStaff?.id === member.id} onOpenChange={(open) => !open && setEditingStaff(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingStaff(member)}
                      className="flex-1 font-serif"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-sans">Edit Staff Member</DialogTitle>
                    </DialogHeader>
                    {editingStaff && (
                      <StaffForm
                        initialData={editingStaff}
                        onSubmit={handleEditStaff}
                        onCancel={() => setEditingStaff(null)}
                      />
                    )}
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteStaff(member.id)}
                  className="text-destructive hover:text-destructive font-serif"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground font-serif">No staff members found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

interface StaffFormProps {
  initialData?: Staff
  onSubmit: (staff: Staff | Omit<Staff, "id">) => void
  onCancel: () => void
}

function StaffForm({ initialData, onSubmit, onCancel }: StaffFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    role: initialData?.role || ("waiter" as Staff["role"]),
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    active: initialData?.active ?? true,
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
          Full Name
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
        <Label htmlFor="role" className="font-serif">
          Role
        </Label>
        <Select
          value={formData.role}
          onValueChange={(value: Staff["role"]) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger className="font-serif">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manager" className="font-serif">
              Manager
            </SelectItem>
            <SelectItem value="chef" className="font-serif">
              Chef
            </SelectItem>
            <SelectItem value="waiter" className="font-serif">
              Waiter
            </SelectItem>
            <SelectItem value="host" className="font-serif">
              Host
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="email" className="font-serif">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="font-serif"
        />
      </div>

      <div>
        <Label htmlFor="phone" className="font-serif">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="font-serif"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
        />
        <Label htmlFor="active" className="font-serif">
          Active Employee
        </Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 font-serif">
          {initialData ? "Update Staff Member" : "Add Staff Member"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 font-serif bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}

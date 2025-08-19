import { StaffManagement } from "@/components/staff-management"
import { Sidebar } from "@/components/sidebar"

export default function StaffPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground font-sans">Staff Management</h1>
            <p className="text-muted-foreground mt-2 font-serif">Manage restaurant staff, roles, and schedules</p>
          </div>
          <StaffManagement />
        </div>
      </main>
    </div>
  )
}

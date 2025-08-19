import { MenuManagement } from "@/components/menu-management"
import { Sidebar } from "@/components/sidebar"

export default function MenuPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground font-sans">Menu Management</h1>
            <p className="text-muted-foreground mt-2 font-serif">Manage your restaurant's menu items and categories</p>
          </div>
          <MenuManagement />
        </div>
      </main>
    </div>
  )
}

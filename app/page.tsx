import { DashboardOverview } from "@/components/dashboard-overview"
import { Sidebar } from "@/components/sidebar"

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground font-sans">Jikonis Dashboard</h1>
            <p className="text-muted-foreground mt-2 font-serif">Welcome to your restaurant management system</p>
          </div>
          <DashboardOverview />
        </div>
      </main>
    </div>
  )
}

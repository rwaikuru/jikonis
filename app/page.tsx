import { DashboardOverview } from "@/components/dashboard-overview"
import { Sidebar } from "@/components/sidebar"

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <DashboardOverview />
        </div>
      </main>
    </div>
  )
}

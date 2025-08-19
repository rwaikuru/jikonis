import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Sidebar } from "@/components/sidebar"

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <AnalyticsDashboard />
      </main>
    </div>
  )
}

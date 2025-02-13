import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { Overview } from "@/components/dashboard/overview";
import { RecentVisitors } from "@/components/dashboard/recent-visitors";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Analytics overview and key metrics</p>
      </div>

      <MetricsCards />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Visitors</CardTitle>
            <CardDescription>
              Real-time visitor activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentVisitors />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
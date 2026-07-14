import { useGetAnalyticsSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, Target, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Analytics() {
  const { data: summary, isLoading } = useGetAnalyticsSummary();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Deep insights into your CRM performance</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Activity className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* MRR Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue (MRR)</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <div className="text-3xl font-bold text-primary">
                ${summary?.mrr?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <span className="text-green-500 font-medium">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        {/* Pipeline Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <div className="text-3xl font-bold">
                ${summary?.pipelineValue?.toLocaleString()}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Based on active leads
            </p>
          </CardContent>
        </Card>

        {/* Win Rate Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <div className="text-3xl font-bold">
                {summary?.winRate}%
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Leads converted to won
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="min-h-[300px] flex items-center justify-center bg-muted/20">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-10 w-10 mx-auto mb-4 opacity-20" />
            <p>MRR Growth Chart (Coming Soon)</p>
          </div>
        </Card>
        <Card className="min-h-[300px] flex items-center justify-center bg-muted/20">
          <div className="text-center text-muted-foreground">
            <Target className="h-10 w-10 mx-auto mb-4 opacity-20" />
            <p>Pipeline Stage Funnel (Coming Soon)</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

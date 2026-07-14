import { 
  useGetDashboardSummary, 
  useGetRecentOrders, 
  useGetOrderStatusBreakdown,
  useGenerateLeadScore,
  useGenerateEmailDraft
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, ShoppingCart, DollarSign, UserPlus, Package, Bot, Mail, Target, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: recentOrdersData, isLoading: loadingOrders } = useGetRecentOrders();
  const recentOrders = Array.isArray(recentOrdersData) ? recentOrdersData : (recentOrdersData as any)?.orders ?? (recentOrdersData as any)?.data ?? [];
  const { data: statusBreakdown, isLoading: loadingBreakdown } = useGetOrderStatusBreakdown();

  const { toast } = useToast();
  const generateEmailDraft = useGenerateEmailDraft();
  const [emailPurpose, setEmailPurpose] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleGenerateEmail = () => {
    generateEmailDraft.mutate(
      { data: { recipientName: "Valued Customer", purpose: emailPurpose } },
      {
        onSuccess: (data) => {
          setGeneratedEmail(data.draft || "");
          toast({ title: "Email Drafted", description: "AI has generated your email." });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Failed to generate email." });
        }
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Paid</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">Shipped</Badge>;
      case "pending":
      default:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingSummary ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">${summary?.total_revenue?.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingSummary ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{summary?.total_orders}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingSummary ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{summary?.total_customers}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingSummary ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{summary?.new_customers_this_month}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* AI Action Panel */}
        <Card className="md:col-span-7 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Assistant Workspace
            </CardTitle>
            <CardDescription>
              Leverage enterprise AI to automate your workflow.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Draft Email
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AI Email Drafter</DialogTitle>
                  <DialogDescription>
                    Tell the AI what you want to say, and it will draft a professional email.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Textarea
                    placeholder="E.g. Follow up with John about the Q3 contract renewal..."
                    value={emailPurpose}
                    onChange={(e) => setEmailPurpose(e.target.value)}
                  />
                  <Button 
                    onClick={handleGenerateEmail} 
                    disabled={generateEmailDraft.isPending || !emailPurpose}
                    className="w-full"
                  >
                    {generateEmailDraft.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                    Generate Draft
                  </Button>
                  
                  {generatedEmail && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Generated Draft:</p>
                      <Textarea 
                        readOnly 
                        value={generatedEmail} 
                        className="h-48 font-mono text-sm"
                      />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Link href="/leads">
              <Button variant="outline" className="gap-2">
                <Target className="h-4 w-4" />
                Score Leads
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="md:col-span-4 lg:col-span-5">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingOrders ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentOrders?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                <Package className="h-8 w-8 mb-2 opacity-50" />
                <p>No recent orders found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders?.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{order.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        <Link href={`/customers/${order.customer_id}`} className="hover:underline">
                          {order.customer_name || 'Unknown Customer'}
                        </Link>
                        {" • "}{format(new Date(order.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-medium">${order.amount.toLocaleString()}</div>
                      <div className="w-20 text-right">{getStatusBadge(order.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="md:col-span-3 lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingBreakdown ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="font-medium">Pending</span>
                  </div>
                  <span className="font-bold">{statusBreakdown?.pending || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-medium">Paid</span>
                  </div>
                  <span className="font-bold">{statusBreakdown?.paid || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="font-medium">Shipped</span>
                  </div>
                  <span className="font-bold">{statusBreakdown?.shipped || 0}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

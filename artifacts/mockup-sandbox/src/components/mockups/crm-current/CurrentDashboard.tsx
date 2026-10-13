import "./_group.css";
import { useState, type ReactNode } from "react";
import { format } from "date-fns";
import {
  BarChart3,
  Bot,
  Building2,
  Contact,
  DollarSign,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Mail,
  Menu,
  Package,
  ShoppingCart,
  Target,
  UserPlus,
  Users,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

const summary = {
  total_revenue: 48290,
  total_orders: 284,
  total_customers: 1248,
  new_customers_this_month: 86,
};

const recentOrders = [
  { id: "ord-101", product_name: "Wireless Headphones", customer_id: "cus-201", customer_name: "Olivia Chen", amount: 129, status: "paid", created_at: "2025-03-18T14:22:00.000Z" },
  { id: "ord-102", product_name: "Smart Watch Pro", customer_id: "cus-202", customer_name: "Marcus Johnson", amount: 249, status: "shipped", created_at: "2025-03-18T11:05:00.000Z" },
  { id: "ord-103", product_name: "Portable Speaker", customer_id: "cus-203", customer_name: "Sophia Patel", amount: 89, status: "pending", created_at: "2025-03-17T16:40:00.000Z" },
  { id: "ord-104", product_name: "USB-C Hub", customer_id: "cus-204", customer_name: "Ethan Williams", amount: 59, status: "paid", created_at: "2025-03-17T09:15:00.000Z" },
  { id: "ord-105", product_name: "Laptop Stand", customer_id: "cus-205", customer_name: "Ava Thompson", amount: 79, status: "shipped", created_at: "2025-03-16T18:30:00.000Z" },
];

const statusBreakdown = { pending: 18, paid: 172, shipped: 94 };

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Leads", href: "/leads", icon: Contact },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Tasks", href: "/tasks", icon: ListTodo },
  { name: "Workflows", href: "/workflows", icon: Workflow },
];

function AppLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive = item.href === "/dashboard";
        return (
          <a key={item.name} href="#" onClick={() => setMobileMenuOpen(false)}>
            <span
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </span>
          </a>
        );
      })}
    </>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-2 text-lg font-medium">
              <div className="flex h-14 items-center border-b px-2 font-semibold tracking-tight">
                CRM Dashboard
              </div>
              <div className="py-4 grid gap-1">
                <NavLinks />
              </div>
            </nav>
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
              <div className="text-sm font-medium truncate px-2">alex.morgan@example.com</div>
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="font-semibold">Dashboard</div>
      </header>

      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 font-semibold tracking-tight">
          CRM Dashboard
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
            <NavLinks />
          </nav>
        </div>
        <div className="mt-auto border-t p-4 flex flex-col gap-3">
          <div className="text-sm font-medium truncate text-muted-foreground">
            alex.morgan@example.com
          </div>
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-[1200px] mx-auto">
        <div className="hidden md:flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        {children}
      </main>
    </div>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Paid</Badge>;
    case "shipped":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">Shipped</Badge>;
    case "pending":
    default:
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">Pending</Badge>;
  }
}

export default function CurrentDashboard() {
  const [emailPurpose, setEmailPurpose] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateEmail = () => {
    setIsGenerating(true);
    setGeneratedEmail(
      `Hello Valued Customer,\n\n${emailPurpose.trim()}\n\nPlease let us know if we can help with anything else.\n\nBest,\nThe CRM Team`,
    );
    setIsGenerating(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summary.total_revenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_orders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_customers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Customers</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.new_customers_this_month}</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
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
                      onChange={(event) => setEmailPurpose(event.target.value)}
                    />
                    <Button
                      onClick={handleGenerateEmail}
                      disabled={isGenerating || !emailPurpose}
                      className="w-full"
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      Generate Draft
                    </Button>
                    {generatedEmail && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Generated Draft:</p>
                        <Textarea readOnly value={generatedEmail} className="h-48 font-mono text-sm" />
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <a href="#">
                <Button variant="outline" className="gap-2">
                  <Target className="h-4 w-4" />
                  Score Leads
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card className="md:col-span-4 lg:col-span-5">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                  <Package className="h-8 w-8 mb-2 opacity-50" />
                  <p>No recent orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{order.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          <a href="#" className="hover:underline">{order.customer_name || "Unknown Customer"}</a>
                          {" • "}{format(new Date(order.created_at), "MMM d, yyyy")}
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

          <Card className="md:col-span-3 lg:col-span-2">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="font-medium">Pending</span>
                  </div>
                  <span className="font-bold">{statusBreakdown.pending || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-medium">Paid</span>
                  </div>
                  <span className="font-bold">{statusBreakdown.paid || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="font-medium">Shipped</span>
                  </div>
                  <span className="font-bold">{statusBreakdown.shipped || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

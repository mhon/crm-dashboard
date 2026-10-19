import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, ShoppingCart, LogOut, Menu, Building2, Contact, ListTodo, BarChart3, Workflow, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TrendingUp } from "lucide-react";
import { CommandPalette } from "@/components/CommandPalette";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Leads", href: "/leads", icon: Contact },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Tasks", href: "/tasks", icon: ListTodo },
    { name: "Workflows", href: "/workflows", icon: Workflow },
  ];

  const getPageTitle = () => {
    if (location === "/dashboard") return "Dashboard";
    if (location === "/analytics") return "Analytics";
    if (location === "/orders" || location.startsWith("/orders/")) return "Orders";
    if (location === "/companies" || location.startsWith("/companies/")) return "Companies";
    if (location === "/leads" || location.startsWith("/leads/")) return "Leads";
    if (location === "/customers" || location.startsWith("/customers/")) return "Customers";
    if (location === "/tasks" || location.startsWith("/tasks/")) return "Tasks";
    if (location === "/workflows" || location.startsWith("/workflows/")) return "Workflows";
    return "";
  };

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive =
          location === item.href ||
          (item.href !== "/dashboard" && location.startsWith(item.href));
        return (
          <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
            <span
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </span>
          </Link>
        );
      })}
    </>
  );

  // Helper to emit Ctrl+K so CommandPalette opens
  const triggerCommandPalette = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true })
    );
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-background md:flex-row">
      {/* Global Command Palette */}
      <CommandPalette />

      {/* Mobile Header */}
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
              <div className="flex h-14 items-center gap-3 border-b px-2 font-semibold tracking-tight">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground"><TrendingUp className="h-4 w-4" /></span>
                <span>Orbit <span className="text-muted-foreground">CRM</span></span>
              </div>
              <div className="py-4 grid gap-1">
                <NavLinks />
              </div>
            </nav>
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
              <ThemeToggle />
              <div className="text-sm font-medium truncate px-2">{user?.email}</div>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={signOut}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="font-semibold tracking-tight">{getPageTitle()}</div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={triggerCommandPalette}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          <ThemeToggle compact />
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden w-[258px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-[76px] items-center gap-3 border-b border-sidebar-border px-5 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"><TrendingUp className="h-4 w-4" /></span>
          <span className="text-base">Orbit <span className="text-sidebar-foreground/55">CRM</span></span>
        </div>
        {/* Search trigger button */}
        <div className="px-3 pt-4 pb-1">
          <button
            onClick={triggerCommandPalette}
            className="flex w-full items-center gap-2.5 rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2 text-sm text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground/80"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left text-xs">Search…</span>
            <kbd className="ml-auto flex h-5 items-center gap-0.5 rounded border border-sidebar-border bg-sidebar px-1.5 text-[0.6rem] font-semibold text-sidebar-foreground/40">
              Ctrl K
            </kbd>
          </button>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <p className="px-6 pb-3 text-[10px] font-bold uppercase tracking-[.18em] text-sidebar-foreground/40">Workspace</p>
          <nav className="grid items-start px-3 text-sm font-medium gap-1">
            <NavLinks />
          </nav>
        </div>
        <div className="mt-auto border-t border-sidebar-border p-4 flex flex-col gap-3">
          <ThemeToggle />
          <div className="truncate rounded-xl bg-sidebar-accent px-3 py-2 text-xs font-medium text-sidebar-foreground/75">
            {user?.email}
          </div>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-9 w-full max-w-[1500px] mx-auto">
        <div className="hidden md:flex items-center justify-between mb-8 border-b border-border/70 pb-5">
          <div>
            <p className="page-eyebrow mb-1">Seller workspace</p>
            <h1 className="text-2xl font-bold tracking-tight">{getPageTitle()}</h1>
          </div>
          <div className="text-xs font-medium text-muted-foreground">Today, {new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date())}</div>
        </div>
        {children}
      </main>
    </div>
  );
}


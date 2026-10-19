import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, ShoppingCart, LogOut, Menu, Building2, Contact, ListTodo, BarChart3, Workflow, Search, Sparkles, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TrendingUp } from "lucide-react";
import { CommandPalette } from "@/components/CommandPalette";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("orbit_dismiss_quick_switcher") === "true";
  });

  const dismissBanner = () => {
    localStorage.setItem("orbit_dismiss_quick_switcher", "true");
    setBannerDismissed(true);
  };

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

  const NavLinks = ({ isMobile }: { isMobile?: boolean } = {}) => (
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
                  ? isMobile
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                  : isMobile
                  ? "text-foreground/80 hover:bg-muted hover:text-foreground font-medium"
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
          <SheetContent side="left" className="sm:max-w-xs flex flex-col p-6">
            <nav className="grid gap-2 text-lg font-medium">
              <div className="flex h-14 items-center gap-3 border-b border-border pb-3 px-1 font-semibold tracking-tight text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <span className="text-base font-bold">Orbit <span className="text-muted-foreground font-normal">CRM</span></span>
              </div>
              <div className="py-4 grid gap-1">
                <NavLinks isMobile />
              </div>
            </nav>
            <div className="mt-auto pt-4 border-t border-border flex flex-col gap-3">
              <ThemeToggle />
              <div className="text-xs font-medium truncate px-2 text-muted-foreground">
                {user?.email}
              </div>
              <Button variant="outline" className="w-full justify-start gap-2 text-foreground" onClick={signOut}>
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
        {/* Eye-catching NEW FEATURE Announcement Banner */}
        {!bannerDismissed && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-3.5 sm:px-4 sm:py-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
                <Sparkles className="h-3 w-3" />
                NEW FEATURE
              </span>
              <span className="text-foreground">
                <strong className="font-semibold">Global Quick Switcher</strong> — Press{" "}
                <kbd className="inline-flex items-center rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[11px] font-bold shadow-xs">
                  Ctrl + K
                </kbd>{" "}
                to instantly find customers, orders, leads, jump to pages, or run quick actions!
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={triggerCommandPalette}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
                Try Search
              </button>
              <button
                onClick={dismissBanner}
                className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                aria-label="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

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


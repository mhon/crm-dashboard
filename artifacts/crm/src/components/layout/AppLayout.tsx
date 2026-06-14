import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, ShoppingCart, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
  ];

  const getPageTitle = () => {
    if (location === "/dashboard") return "Dashboard";
    if (location === "/customers" || location.startsWith("/customers/")) return "Customers";
    if (location === "/orders") return "Orders";
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
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
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

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
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
              <div className="flex h-14 items-center border-b px-2 font-semibold tracking-tight">
                CRM Dashboard
              </div>
              <div className="py-4 grid gap-1">
                <NavLinks />
              </div>
            </nav>
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
              <div className="text-sm font-medium truncate px-2">{user?.email}</div>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={signOut}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="font-semibold">{getPageTitle()}</div>
      </header>

      {/* Desktop Sidebar */}
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
            {user?.email}
          </div>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-[1200px] mx-auto">
        <div className="hidden md:flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{getPageTitle()}</h1>
        </div>
        {children}
      </main>
    </div>
  );
}

import { Link, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Package,
  TrendingUp,
  Bell,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const { session, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  if (!loading && session) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <style>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* 1. Navbar */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">
                CRM Dashboard
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              <Link href="/login">
                <Button data-testid="button-nav-login" variant="default">
                  Login
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b bg-background px-4 py-4 shadow-lg absolute w-full">
            <div className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-sm font-medium text-foreground"
                onClick={closeMobileMenu}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-foreground"
                onClick={closeMobileMenu}
              >
                Pricing
              </a>
              <div className="pt-2">
                <Link href="/login" onClick={closeMobileMenu}>
                  <Button className="w-full" data-testid="button-mobile-login">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden text-white" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Track Customers, Orders, and Profits in One Dashboard
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Stop using spreadsheets and Messenger chats to manage your
              business. Organize customers, monitor orders, and track revenue
              from a single dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                  data-testid="button-hero-start"
                >
                  Start Free
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-12 px-8 text-base font-semibold bg-transparent border-slate-700 text-white hover:bg-slate-800 hover:text-white"
                  data-testid="button-hero-demo"
                >
                  View Demo
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything You Need To Manage Your Business
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful tools designed specifically for online sellers to simplify
              daily operations and accelerate growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Customer Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Store customer info, search effortlessly, and manage your entire
                  customer database in one secure, accessible place.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Order Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor order status in real-time. Keep a close eye on pending,
                  paid, and shipped orders without missing a beat.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Profit Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  View clear revenue summaries and monitor your business
                  performance with intuitive, easy-to-read analytics.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Never forget unpaid balances or follow-ups. Track pending
                  tasks and stay on top of your daily to-do list.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Benefits Section */}
      <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Why Small Businesses Choose Our CRM
              </h2>
              <p className="text-lg text-muted-foreground">
                We built this platform with the unique challenges of local
                sellers in mind. Focus on growing your business while we handle
                the organization.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Save time on manual data entry",
                  "Stay organized across all sales channels",
                  "Track profits easily with automated reporting",
                  "Manage customers in one centralized place",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              {/* Abstract decorative element representing dashboard UI */}
              <div className="aspect-square md:aspect-[4/3] rounded-2xl bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 flex flex-col gap-4 shadow-inner">
                <div className="w-full h-8 bg-background rounded-md border shadow-sm opacity-70" />
                <div className="flex gap-4">
                  <div className="w-1/3 h-24 bg-background rounded-md border shadow-sm opacity-70" />
                  <div className="w-1/3 h-24 bg-background rounded-md border shadow-sm opacity-70" />
                  <div className="w-1/3 h-24 bg-background rounded-md border shadow-sm opacity-70" />
                </div>
                <div className="w-full flex-1 bg-background rounded-md border shadow-sm opacity-70" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your business needs. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Free Tier */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Free</CardTitle>
                <CardDescription>Perfect for new sellers</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">₱0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm">Up to 50 customers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm">Up to 100 orders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm">Basic dashboard</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/login" className="w-full">
                  <Button className="w-full" variant="outline" data-testid="button-pricing-free">
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Pro Tier (Most Popular) */}
            <Card className="border-primary shadow-lg relative transform md:-translate-y-4 bg-primary text-primary-foreground">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-amber-600 text-amber-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                <CardDescription className="text-primary-foreground/80">For growing businesses</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">₱199</span>
                  <span className="text-primary-foreground/80">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground shrink-0" />
                    <span className="text-sm">Unlimited customers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground shrink-0" />
                    <span className="text-sm">Unlimited orders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground shrink-0" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground shrink-0" />
                    <span className="text-sm">Priority support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/login" className="w-full">
                  <Button className="w-full bg-background text-foreground hover:bg-background/90" data-testid="button-pricing-pro">
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Business Tier */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Business</CardTitle>
                <CardDescription>For established teams</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">₱499</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm">Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm">Multi-user support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm">Team collaboration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm">Export reports</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/login" className="w-full">
                  <Button className="w-full" variant="outline" data-testid="button-pricing-business">
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Call to Action Section */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Start Organizing Your Business Today
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of sellers who have streamlined their operations and increased their profits.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-10 text-lg font-bold shadow-lg"
              data-testid="button-cta-create"
            >
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-slate-950 text-slate-300 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-white tracking-tight">
                  CRM Dashboard
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                The all-in-one platform built for online sellers to track customers, monitor orders, and grow revenue effortlessly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} CRM Dashboard. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Help Center
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

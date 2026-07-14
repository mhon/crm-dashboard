import { Link, Redirect } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import {
  Users, Package, TrendingUp, Bell, LayoutDashboard, Smartphone,
  CheckCircle2, XCircle, ArrowRight, Menu, X, Star, ChevronRight,
} from "lucide-react";

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatCounter({ value, label, prefix = "", suffix = "" }: { value: number; label: string; prefix?: string; suffix?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 2000, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-slate-400 font-medium">{label}</div>
    </div>
  );
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const features = [
  { icon: Users, title: "Customer Management", desc: "Store and organize customer information in one place. Never lose a contact again.", color: "#6366f1" },
  { icon: Package, title: "Order Tracking", desc: "Monitor pending, shipped, completed, and cancelled orders in real time.", color: "#8b5cf6" },
  { icon: TrendingUp, title: "Profit Analytics", desc: "Track revenue, expenses, and profits with clear and intuitive reports.", color: "#06b6d4" },
  { icon: Bell, title: "Payment Reminders", desc: "Never forget unpaid invoices and customer follow-ups again.", color: "#f59e0b" },
  { icon: LayoutDashboard, title: "Dashboard Overview", desc: "See all your business metrics in one powerful screen at a glance.", color: "#10b981" },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Access your full CRM from any device, anywhere, anytime.", color: "#ec4899" },
];

const beforeItems = [
  "Messenger chats everywhere",
  "Excel spreadsheets",
  "Manual order tracking",
  "Missed follow-ups",
  "Lost customer records",
];

const afterItems = [
  "Centralized CRM Dashboard",
  "Order Tracking System",
  "Revenue Monitoring",
  "Automated Reminders",
  "Organized Customer Database",
];

const audiences = [
  { emoji: "🛍️", label: "Online Sellers" },
  { emoji: "🏪", label: "Shopee Sellers" },
  { emoji: "📦", label: "Lazada Sellers" },
  { emoji: "📱", label: "Facebook Sellers" },
  { emoji: "🔄", label: "Resellers" },
  { emoji: "💼", label: "Small Business Owners" },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "₱199",
    period: "/month",
    features: ["Customer Management", "Order Tracking", "Basic Reports", "Mobile Access"],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₱499",
    period: "/month",
    features: ["Everything in Starter", "Profit Analytics", "Advanced Reports", "Payment Reminders", "Priority Support"],
    cta: "Get Pro",
    highlight: true,
  },
];

export default function LandingPage() {
  const { session, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!loading && session) return <Redirect to="/dashboard" />;

  return (
    <div style={{ background: "#050814", color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        html { scroll-behavior: smooth; }
        @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,10px) scale(0.97)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-25px,15px) scale(1.03)} 66%{transform:translate(20px,-25px) scale(0.98)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(15px,20px) scale(1.04)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:1} 100%{transform:scale(1.4);opacity:0} }
        .blob1 { animation: float1 12s ease-in-out infinite; }
        .blob2 { animation: float2 15s ease-in-out infinite; }
        .blob3 { animation: float3 10s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #a78bfa, #60a5fa, #a78bfa);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .glass-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(139,92,246,0.3);
          transform: translateY(-4px);
          transition: all 0.3s ease;
        }
        .cta-btn {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .cta-btn:hover::before { opacity: 1; }
        .cta-btn span { position: relative; z-index: 1; }
        .outline-btn {
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }
        .outline-btn:hover {
          border-color: rgba(139,92,246,0.6);
          background: rgba(139,92,246,0.1);
        }
        .nav-link { transition: color 0.2s ease; }
        .nav-link:hover { color: #a78bfa; }
        .feature-card { transition: all 0.3s ease; }
        .feature-card:hover { transform: translateY(-6px); }
        .audience-card:hover { border-color: rgba(139,92,246,0.5); transform: translateY(-3px); }
        .audience-card { transition: all 0.25s ease; }
        .pricing-card { transition: all 0.3s ease; }
        .pricing-card:hover { transform: translateY(-6px); }
        .dashboard-mock { 
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
        }
        .mock-bar { height: 10px; border-radius: 9999px; background: rgba(255,255,255,0.06); overflow: hidden; }
        .mock-bar-fill { height: 100%; border-radius: 9999px; }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-border {
          background: linear-gradient(135deg, #7c3aed22, #4f46e522, #06b6d422);
          background-size: 200% 200%;
          animation: gradientShift 6s ease infinite;
        }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
          .mock-bar { display: none; }
        }
      `}</style>

      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div className="blob1" style={{ position: "absolute", top: "-20%", left: "-10%", width: "min(600px, 80vw)", height: "min(600px, 80vw)", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)" }} />
        <div className="blob2" style={{ position: "absolute", top: "30%", right: "-15%", width: "min(700px, 90vw)", height: "min(700px, 90vw)", borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)" }} />
        <div className="blob3" style={{ position: "absolute", bottom: "-10%", left: "20%", width: "min(500px, 70vw)", height: "min(500px, 70vw)", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)" }} />
      </div>

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: isScrolled ? "rgba(5,8,20,0.85)" : "transparent",
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px", minHeight: "68px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={16} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: "16px", color: "white" }}>CRM</span>
          </div>

          <div className="hidden md:flex" style={{ display: "none", alignItems: "center", gap: "32px" }}>
            {["Features", "Pricing", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="nav-link" style={{ fontSize: "14px", fontWeight: 500, color: "#94a3b8" }}>{item}</a>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/login">
              <button className="outline-btn hidden md:block" style={{ display: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, color: "white", cursor: "pointer", background: "transparent" }}>
                Sign In
              </button>
            </Link>
            <Link href="/login">
              <button className="cta-btn" style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, color: "white", cursor: "pointer", border: "none" }}>
                <span>Start Free</span>
              </button>
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: "flex", background: "none", border: "none", color: "white", cursor: "pointer", padding: "8px 4px" }} className="md:hidden mobile-menu-btn">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div style={{ background: "rgba(5,8,20,0.97)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px", maxHeight: "calc(100vh - 68px)", overflowY: "auto" }}>
            {["Features", "Pricing", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "12px 0", color: "#94a3b8", fontSize: "16px", fontWeight: 500, textDecoration: "none" }}>{item}</a>
            ))}
            <Link href="/login">
              <button className="cta-btn" style={{ width: "100%", marginTop: "16px", padding: "12px", borderRadius: "8px", fontSize: "15px", fontWeight: 600, color: "white", cursor: "pointer", border: "none" }}>
                <span>Start Free</span>
              </button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", zIndex: 1, paddingTop: "160px", paddingBottom: "100px", textAlign: "center", maxWidth: "1200px", margin: "0 auto", padding: "160px 24px 100px" }}>
        <FadeIn>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "999px", padding: "6px 16px", marginBottom: "32px" }}>
            <Star size={12} color="#a78bfa" fill="#a78bfa" />
            <span style={{ fontSize: "13px", color: "#a78bfa", fontWeight: 500 }}>Built for Filipino Online Sellers</span>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <h1 style={{ fontSize: "clamp(40px, 7vw, 76px)", fontWeight: 900, lineHeight: 1.05, marginBottom: "24px", letterSpacing: "-2px", color: "white" }}>
            Stop Losing Customers<br />
            <span className="shimmer-text">in Messenger</span>
          </h1>
        </FadeIn>

        <FadeIn delay={200}>
          <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#94a3b8", maxWidth: "620px", margin: "0 auto 40px", lineHeight: 1.7, fontWeight: 400 }}>
            Manage customers, orders, profits, and follow-ups in one dashboard. Built for online sellers, resellers, and small businesses.
          </p>
        </FadeIn>

        <FadeIn delay={300}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center", marginBottom: "72px" }}>
            <Link href="/login">
              <button className="cta-btn" style={{ padding: "14px 32px", borderRadius: "10px", fontSize: "16px", fontWeight: 700, color: "white", cursor: "pointer", border: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Start Free</span>
                <ArrowRight size={16} />
              </button>
            </Link>
            <a href="#features">
              <button className="outline-btn" style={{ padding: "14px 32px", borderRadius: "10px", fontSize: "16px", fontWeight: 600, color: "white", cursor: "pointer", background: "transparent" }}>
                Watch Demo
              </button>
            </a>
          </div>
        </FadeIn>

        {/* Dashboard Mockup */}
        <FadeIn delay={400}>
          <div className="dashboard-mock" style={{ maxWidth: "900px", margin: "0 auto", boxShadow: "0 40px 120px rgba(124,58,237,0.2), 0 0 0 1px rgba(255,255,255,0.05)" }}>
            <div style={{ background: "rgba(255,255,255,0.04)", padding: "12px 16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28c840" }} />
              <div style={{ flex: 1, height: "26px", background: "rgba(255,255,255,0.04)", borderRadius: "6px", marginLeft: "8px" }} />
            </div>
            <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { label: "Total Customers", value: "248", color: "#7c3aed" },
                { label: "Total Orders", value: "1,842", color: "#4f46e5" },
                { label: "Revenue", value: "₱89,400", color: "#06b6d4" },
                { label: "New This Month", value: "34", color: "#10b981" },
              ].map(stat => (
                <div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px", fontWeight: 500 }}>{stat.label}</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "12px", fontWeight: 600 }}>RECENT ORDERS</div>
                {["Maria Santos", "Jose Reyes", "Ana Cruz", "Mark Dela Cruz"].map((name, i) => (
                  <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "#e2e8f0", fontWeight: 500 }}>{name}</div>
                      <div style={{ fontSize: "10px", color: "#475569" }}>Product {i + 1}</div>
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: ["#10b981", "#f59e0b", "#6366f1", "#10b981"][i], background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "999px" }}>
                      {["Paid", "Pending", "Shipped", "Paid"][i]}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "12px", fontWeight: 600 }}>ORDER STATUS</div>
                {[{ label: "Paid", pct: 58, color: "#10b981" }, { label: "Pending", pct: 28, color: "#f59e0b" }, { label: "Shipped", pct: 14, color: "#6366f1" }].map(s => (
                  <div key={s.label} style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>
                      <span>{s.label}</span><span>{s.pct}%</span>
                    </div>
                    <div className="mock-bar">
                      <div className="mock-bar-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Stats */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
        <div className="animated-gradient-border" style={{ maxWidth: "1000px", margin: "0 auto", borderRadius: "20px", border: "1px solid rgba(124,58,237,0.2)", padding: "60px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px" }}>
            <StatCounter value={500} label="Customers Managed" suffix="+" />
            <StatCounter value={120000} label="Revenue Tracked" prefix="₱" />
            <StatCounter value={98} label="Orders Processed" />
            <StatCounter value={95} label="Faster Follow-ups" suffix="%" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ position: "relative", zIndex: 1, padding: "100px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "3px", color: "#7c3aed", marginBottom: "16px", textTransform: "uppercase" }}>FEATURES</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, color: "white", marginBottom: "16px", letterSpacing: "-1px" }}>Everything You Need to Run Your Business</h2>
            <p style={{ color: "#64748b", maxWidth: "540px", margin: "0 auto", lineHeight: 1.7 }}>Powerful tools designed specifically for online sellers to simplify daily operations and accelerate growth.</p>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 80}>
              <div className="glass-card feature-card" style={{ borderRadius: "16px", padding: "28px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${f.color}22`, border: `1px solid ${f.color}44`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "white", marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Why Sellers Switch */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "3px", color: "#7c3aed", marginBottom: "16px", textTransform: "uppercase" }}>WHY SWITCH</div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, color: "white", letterSpacing: "-1px" }}>Why Sellers Switch to CRM Dashboard</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <FadeIn delay={100}>
              <div className="glass-card" style={{ borderRadius: "16px", padding: "32px", borderColor: "rgba(239,68,68,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <XCircle size={20} color="#f87171" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "white", fontSize: "16px" }}>Before</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>The old way</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {beforeItems.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <XCircle size={16} color="#f87171" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: "14px", color: "#94a3b8" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="glass-card" style={{ borderRadius: "16px", padding: "32px", borderColor: "rgba(16,185,129,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircle2 size={20} color="#34d399" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "white", fontSize: "16px" }}>After</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>With CRM Dashboard</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {afterItems.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: "14px", color: "#e2e8f0" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "3px", color: "#7c3aed", marginBottom: "16px", textTransform: "uppercase" }}>WHO IT'S FOR</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, color: "white", letterSpacing: "-1px" }}>Made for Sellers Like You</h2>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
          {audiences.map((a, i) => (
            <FadeIn key={a.label} delay={i * 60}>
              <div className="glass-card audience-card" style={{ borderRadius: "14px", padding: "24px 16px", textAlign: "center", cursor: "default" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>{a.emoji}</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#e2e8f0" }}>{a.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Demo CTA */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
        <FadeIn>
          <div style={{ maxWidth: "800px", margin: "0 auto", borderRadius: "24px", background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.15), rgba(6,182,212,0.1))", border: "1px solid rgba(124,58,237,0.25)", padding: "60px 40px", textAlign: "center", backdropFilter: "blur(12px)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "3px", color: "#a78bfa", marginBottom: "20px", textTransform: "uppercase" }}>LIVE DEMO</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, color: "white", marginBottom: "16px", letterSpacing: "-1px" }}>Try the Dashboard Before You Sign Up</h2>
            <p style={{ color: "#94a3b8", marginBottom: "36px", fontSize: "16px", lineHeight: 1.6 }}>See exactly how CRM Dashboard works. No credit card required.</p>
            <Link href="/login">
              <button className="cta-btn" style={{ padding: "14px 36px", borderRadius: "10px", fontSize: "16px", fontWeight: 700, color: "white", cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span>Try Demo Account</span>
                <ChevronRight size={18} />
              </button>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ position: "relative", zIndex: 1, padding: "100px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "3px", color: "#7c3aed", marginBottom: "16px", textTransform: "uppercase" }}>PRICING</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, color: "white", letterSpacing: "-1px" }}>Simple, Transparent Pricing</h2>
            <p style={{ color: "#64748b", marginTop: "16px" }}>No hidden fees. Cancel anytime.</p>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {pricingPlans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 120}>
              <div className="pricing-card" style={{
                borderRadius: "20px",
                padding: "36px 32px",
                position: "relative",
                ...(plan.highlight ? {
                  background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.2))",
                  border: "1px solid rgba(124,58,237,0.4)",
                } : {
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }),
              }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", borderRadius: "999px", padding: "4px 16px", fontSize: "12px", fontWeight: 700, color: "white", whiteSpace: "nowrap" }}>
                    Most Popular
                  </div>
                )}
                <div style={{ fontSize: "18px", fontWeight: 700, color: "white", marginBottom: "8px" }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "28px" }}>
                  <span style={{ fontSize: "48px", fontWeight: 900, color: "white" }}>{plan.price}</span>
                  <span style={{ color: "#64748b", fontSize: "14px" }}>{plan.period}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <CheckCircle2 size={16} color="#7c3aed" />
                      <span style={{ fontSize: "14px", color: "#cbd5e1" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/login">
                  <button
                    className={plan.highlight ? "cta-btn" : "outline-btn"}
                    style={{
                      width: "100%", padding: "12px", borderRadius: "10px",
                      fontSize: "15px", fontWeight: 700, color: "white", cursor: "pointer",
                      ...(plan.highlight ? { border: "none" } : { background: "transparent" }),
                    }}
                  >
                    <span>{plan.cta}</span>
                  </button>
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "80px 24px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "48px", marginBottom: "64px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp size={16} color="white" />
                </div>
                <span style={{ fontWeight: 700, fontSize: "16px", color: "white" }}>CRM Dashboard</span>
              </div>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.8, maxWidth: "280px" }}>
                We help small businesses manage customers, orders, and profits without complicated software. Affordable and easy-to-use for every entrepreneur.
              </p>
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", marginBottom: "20px", letterSpacing: "2px", textTransform: "uppercase" }}>Features</div>
              {["Customer Management", "Order Tracking", "Profit Analytics", "Payment Reminders", "Dashboard Reports", "Mobile Friendly"].map(f => (
                <div key={f} style={{ fontSize: "14px", color: "#64748b", marginBottom: "10px" }}>{f}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", marginBottom: "20px", letterSpacing: "2px", textTransform: "uppercase" }}>Pricing</div>
              <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "10px" }}>Starter — ₱199/month</div>
              <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "10px" }}>Pro — ₱499/month</div>
              <Link href="/login">
                <button className="cta-btn" style={{ marginTop: "16px", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "white", cursor: "pointer", border: "none" }}>
                  <span>Get Started</span>
                </button>
              </Link>
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", marginBottom: "20px", letterSpacing: "2px", textTransform: "uppercase" }}>Contact</div>
              <a href="mailto:mhonbastasa@yahoo.com.ph" style={{ fontSize: "14px", color: "#a78bfa", textDecoration: "none", display: "block", marginBottom: "10px" }}>mhonbastasa@yahoo.com.ph</a>
              <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {["About", "Privacy Policy", "Terms of Service"].map(l => (
                  <span key={l} style={{ fontSize: "14px", color: "#64748b", cursor: "pointer" }}>{l}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "32px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "13px", color: "#475569" }}>© 2025 CRM Dashboard. All rights reserved.</span>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {["About", "Features", "Pricing", "Contact"].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: "13px", color: "#475569", textDecoration: "none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

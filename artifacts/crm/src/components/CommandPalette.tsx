import * as React from "react";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Search,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Building2,
  Contact,
  ListTodo,
  BarChart3,
  Workflow,
  Sparkles,
  ArrowUpDown,
  CornerDownLeft,
  X,
  Loader2,
  FileText,
  Zap,
  type LucideIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  meta?: Record<string, unknown>;
}

interface StaticItem {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  icon: LucideIcon;
}

type CategoryTab = "All" | string;

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Pages: LayoutDashboard,
  Customers: Users,
  Orders: ShoppingCart,
  Companies: Building2,
  Leads: Contact,
  Tasks: ListTodo,
  Workflows: Workflow,
  Analytics: BarChart3,
  "AI Tools": Sparkles,
  Notes: FileText,
  Actions: Zap,
};

const STATIC_PAGES: StaticItem[] = [
  { id: "page-dashboard", title: "Dashboard", description: "Overview of your CRM workspace", category: "Pages", url: "/dashboard", icon: LayoutDashboard },
  { id: "page-analytics", title: "Analytics", description: "Revenue, pipeline & performance metrics", category: "Pages", url: "/analytics", icon: BarChart3 },
  { id: "page-orders", title: "Orders", description: "Manage orders and track fulfillment", category: "Pages", url: "/orders", icon: ShoppingCart },
  { id: "page-companies", title: "Companies", description: "Company directory and details", category: "Pages", url: "/companies", icon: Building2 },
  { id: "page-leads", title: "Leads", description: "Lead pipeline and AI scoring", category: "Pages", url: "/leads", icon: Contact },
  { id: "page-customers", title: "Customers", description: "Customer management and profiles", category: "Pages", url: "/customers", icon: Users },
  { id: "page-tasks", title: "Tasks", description: "Task board and assignments", category: "Pages", url: "/tasks", icon: ListTodo },
  { id: "page-workflows", title: "Workflows", description: "Automation and workflow builder", category: "Pages", url: "/workflows", icon: Workflow },
];

const STATIC_AI_TOOLS: StaticItem[] = [
  { id: "ai-lead-score", title: "AI Lead Scoring", description: "Score leads with AI analysis", category: "AI Tools", url: "/leads", icon: Sparkles },
  { id: "ai-email-draft", title: "AI Email Draft", description: "Generate email drafts with AI", category: "AI Tools", url: "/leads", icon: Sparkles },
  { id: "ai-meeting-summary", title: "AI Meeting Summary", description: "Summarise meeting notes with AI", category: "AI Tools", url: "/leads", icon: Sparkles },
];

const STATIC_ACTIONS: StaticItem[] = [
  { id: "action-new-customer", title: "New Customer", description: "Create a new customer record", category: "Actions", url: "/customers", icon: Users },
  { id: "action-new-order", title: "New Order", description: "Create a new order", category: "Actions", url: "/orders", icon: ShoppingCart },
  { id: "action-new-lead", title: "New Lead", description: "Add a new lead", category: "Actions", url: "/leads", icon: Contact },
  { id: "action-new-task", title: "New Task", description: "Create a new task", category: "Actions", url: "/tasks", icon: ListTodo },
  { id: "action-new-company", title: "New Company", description: "Add a new company", category: "Actions", url: "/companies", icon: Building2 },
  { id: "action-new-workflow", title: "New Workflow", description: "Create automation workflow", category: "Actions", url: "/workflows", icon: Workflow },
];

const ALL_STATIC = [...STATIC_PAGES, ...STATIC_AI_TOOLS, ...STATIC_ACTIONS];

// ─── Debounce Hook ────────────────────────────────────────────────────────────

function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<CategoryTab>("All");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [apiResults, setApiResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const isMobile = useIsMobile();
  const [, navigate] = useLocation();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  const debouncedQuery = useDebouncedValue(query, 250);

  // ── Keyboard shortcut to open ─────────────────────────────────────────────

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // ── Reset on open ─────────────────────────────────────────────────────────

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveTab("All");
      setSelectedIndex(0);
      setApiResults([]);
      setLoading(false);
      // Focus input after animation
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // ── API search ────────────────────────────────────────────────────────────

  React.useEffect(() => {
    if (!debouncedQuery.trim()) {
      setApiResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    // Abort previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const baseUrl = import.meta.env.VITE_API_URL || "";
    fetch(`${baseUrl}/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=10`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        if (!controller.signal.aborted) {
          setApiResults(data.results ?? []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setApiResults([]);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  // ── Merge static + API results, filter, group ─────────────────────────────

  const filteredStatic = React.useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return ALL_STATIC;
    return ALL_STATIC.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query]);

  // Merge: static items first, then API (db) results — deduplicated by id
  const allResults = React.useMemo(() => {
    const seen = new Set<string>();
    const merged: Array<{ id: string; title: string; description: string; category: string; url: string; icon?: LucideIcon }> = [];
    for (const s of filteredStatic) {
      if (!seen.has(s.id)) { seen.add(s.id); merged.push(s); }
    }
    for (const r of apiResults) {
      if (!seen.has(r.id)) { seen.add(r.id); merged.push(r); }
    }
    return merged;
  }, [filteredStatic, apiResults]);

  // Dynamic category tabs derived from results
  const categoryTabs = React.useMemo<CategoryTab[]>(() => {
    const cats = new Set<string>();
    for (const r of allResults) cats.add(r.category);
    return ["All", ...Array.from(cats)];
  }, [allResults]);

  // Filtered by active tab
  const visibleResults = React.useMemo(() => {
    if (activeTab === "All") return allResults;
    return allResults.filter((r) => r.category === activeTab);
  }, [allResults, activeTab]);

  // Group by category for rendering
  const grouped = React.useMemo(() => {
    const groups: Record<string, typeof visibleResults> = {};
    for (const r of visibleResults) {
      (groups[r.category] ??= []).push(r);
    }
    return groups;
  }, [visibleResults]);

  // Flat list for keyboard nav
  const flatList = visibleResults;

  // ── Reset selected index when results change ──────────────────────────────

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [visibleResults]);

  // ── Navigate to result ────────────────────────────────────────────────────

  const selectResult = React.useCallback(
    (item: (typeof flatList)[0]) => {
      setOpen(false);
      navigate(item.url);
    },
    [navigate]
  );

  // ── Keyboard navigation ───────────────────────────────────────────────────

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % Math.max(flatList.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + flatList.length) % Math.max(flatList.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatList[selectedIndex]) selectResult(flatList[selectedIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  // ── Scroll selected item into view ────────────────────────────────────────

  React.useEffect(() => {
    const el = listRef.current?.querySelector(`[data-cmd-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // ── Close on backdrop click ───────────────────────────────────────────────

  if (!open) return null;

  // Track flat index counter across groups
  let flatIndex = 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="cmd-palette-backdrop"
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Palette */}
      <div
        className={`cmd-palette ${isMobile ? "cmd-palette--mobile" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Quick Switcher"
        onKeyDown={onKeyDown}
      >
        {isMobile && <div className="cmd-mobile-handle" />}

        {/* Search bar */}
        <div className="cmd-search-bar">
          <Search className="cmd-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-search-input"
            placeholder="Search pages, records, actions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          {loading && <Loader2 className="cmd-search-spinner" />}
          <button
            className="cmd-esc-btn"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            {isMobile ? <X className="h-4 w-4" /> : <kbd className="cmd-kbd">ESC</kbd>}
          </button>
        </div>

        {/* Category tabs */}
        <div className="cmd-tabs-rail">
          <div className="cmd-tabs">
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                className={`cmd-tab ${activeTab === tab ? "cmd-tab--active" : ""}`}
                onClick={() => { setActiveTab(tab); setSelectedIndex(0); }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="cmd-results" ref={listRef}>
          {flatList.length === 0 && !loading && (
            <div className="cmd-empty">
              <Search className="cmd-empty-icon" />
              <p className="cmd-empty-title">No results found</p>
              <p className="cmd-empty-desc">
                {query ? `Nothing matched "${query}"` : "Start typing to search across your CRM"}
              </p>
            </div>
          )}

          {flatList.length === 0 && loading && (
            <div className="cmd-empty">
              <Loader2 className="cmd-empty-icon animate-spin" />
              <p className="cmd-empty-title">Searching…</p>
            </div>
          )}

          {Object.entries(grouped).map(([category, items]) => {
            const groupHeader = (
              <div key={`header-${category}`} className="cmd-group-header">
                {category.toUpperCase()} ({items.length})
              </div>
            );

            const groupItems = items.map((item) => {
              const idx = flatIndex++;
              const Icon = (item as StaticItem).icon ?? CATEGORY_ICONS[item.category] ?? FileText;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={item.id}
                  className={`cmd-item ${isSelected ? "cmd-item--selected" : ""}`}
                  data-cmd-index={idx}
                  onClick={() => selectResult(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <span className="cmd-item-icon-wrap">
                    <Icon className="cmd-item-icon" />
                  </span>
                  <span className="cmd-item-text">
                    <span className="cmd-item-title">{item.title}</span>
                    <span className="cmd-item-desc">{item.description}</span>
                  </span>
                  <span className="cmd-item-badge">{item.category}</span>
                </button>
              );
            });

            return (
              <div key={category} className="cmd-group">
                {groupHeader}
                {groupItems}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="cmd-footer">
          <div className="cmd-footer-hints">
            <span className="cmd-hint"><ArrowUpDown className="cmd-hint-icon" /> Navigate</span>
            <span className="cmd-hint"><CornerDownLeft className="cmd-hint-icon" /> Select</span>
            <span className="cmd-hint"><kbd className="cmd-kbd-sm">esc</kbd> Close</span>
          </div>
          <span className="cmd-footer-count">{flatList.length} item{flatList.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </>
  );
}

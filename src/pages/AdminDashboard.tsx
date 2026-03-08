import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminCoupons from "@/components/admin/AdminCoupons";
import AdminErrorLogs from "@/components/admin/AdminErrorLogs";
import AdminNotifications from "@/components/admin/AdminNotifications";
import { Button } from "@/components/ui/button";
import { LogOut, Search } from "lucide-react";

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [autoOpenNewProduct, setAutoOpenNewProduct] = useState(false);
  const [orderFilter, setOrderFilter] = useState<string | undefined>(undefined);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        setActiveTab("products");
        setAutoOpenNewProduct(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleQuickAction = useCallback((action: string) => {
    if (action === "add-product") {
      setActiveTab("products");
      setAutoOpenNewProduct(true);
    } else if (action === "pending-orders") {
      setOrderFilter("pending");
      setActiveTab("orders");
    }
  }, []);

  const handleSearchNav = (tab: string) => {
    setActiveTab(tab);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const tabLabel = (tab: string) => {
    const labels: Record<string, string> = {
      overview: "Overview", orders: "Orders", products: "Products",
      categories: "Categories", coupons: "Coupons", "error-logs": "Error Logs",
    };
    return labels[tab] || tab;
  };

  const searchItems = [
    { label: "Overview", tab: "overview" },
    { label: "Orders", tab: "orders" },
    { label: "Products", tab: "products" },
    { label: "Categories", tab: "categories" },
    { label: "Coupons", tab: "coupons" },
    { label: "Error Logs", tab: "error-logs" },
    { label: "Add New Product", tab: "products", action: "add-product" },
    { label: "Pending Orders", tab: "orders", action: "pending-orders" },
  ].filter((item) => !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground" />
              <span className="font-display font-bold text-foreground text-sm">{tabLabel(activeTab)}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Search trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-muted-foreground text-xs hover:bg-muted/50 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
              </button>
              <AdminNotifications />
              <Button variant="outline" size="sm" onClick={signOut} className="gap-1.5 h-8 text-xs">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-5 overflow-auto">
            {activeTab === "overview" && (
              <AdminOverview onNavigate={setActiveTab} onQuickAction={handleQuickAction} />
            )}
            {activeTab === "orders" && (
              <AdminOrders initialFilter={orderFilter} />
            )}
            {activeTab === "products" && (
              <AdminProducts
                autoOpenNew={autoOpenNewProduct}
                onNewHandled={() => setAutoOpenNewProduct(false)}
              />
            )}
            {activeTab === "categories" && <AdminCategories />}
            {activeTab === "coupons" && <AdminCoupons />}
            {activeTab === "error-logs" && <AdminErrorLogs />}
          </main>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search panels, actions..."
                className="flex-1 bg-transparent text-foreground text-sm focus:outline-none placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                  if (e.key === "Enter" && searchItems.length > 0) {
                    const first = searchItems[0];
                    if (first.action) handleQuickAction(first.action);
                    else handleSearchNav(first.tab);
                  }
                }}
              />
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {searchItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.action) handleQuickAction(item.action);
                    else handleSearchNav(item.tab);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              {searchItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No results</p>
              )}
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
};

export default AdminDashboard;

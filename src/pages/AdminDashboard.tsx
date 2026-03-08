import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminNotifications from "@/components/admin/AdminNotifications";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground" />
              <span className="font-display font-bold text-foreground capitalize">{activeTab}</span>
            </div>
            <div className="flex items-center gap-2">
              <AdminNotifications />
              <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            {activeTab === "overview" && <AdminOverview />}
            {activeTab === "orders" && <AdminOrders />}
            {activeTab === "products" && <AdminProducts />}
            {activeTab === "categories" && <AdminCategories />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;

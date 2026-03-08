import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Package, ShoppingCart, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const [profileRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("orders").select("*, products(name, logo_url)").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(profileRes.data);
      setOrders(ordersRes.data ?? []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-accent/20 text-accent-foreground",
      processing: "bg-primary/20 text-primary",
      delivered: "bg-primary/20 text-primary",
      cancelled: "bg-destructive/20 text-destructive",
    };
    return map[status] ?? "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {profile?.name || user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-display font-bold text-foreground">{orders.length}</p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-display font-bold text-foreground">
                {orders.filter((o) => o.order_status === "delivered").length}
              </p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <User className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground truncate max-w-[160px]">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <h2 className="text-xl font-display font-bold text-foreground mb-4">Order History</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Link to="/categories" className="btn-primary-gradient inline-block text-sm py-2 px-6">
              Browse Plans
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {order.products?.logo_url && (
                    <img src={order.products.logo_url} alt="" className="w-10 h-10 rounded-lg object-contain" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{order.products?.name ?? "Product"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-foreground">₹{order.payment_amount}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

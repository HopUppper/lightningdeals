import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Package, Users, DollarSign, ShoppingCart } from "lucide-react";

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenue: 0, customers: 0, products: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from("orders").select("*, products(name, logo_url), profiles!orders_user_id_fkey(name, email)").order("created_at", { ascending: false }).limit(50),
        supabase.from("products").select("id", { count: "exact" }),
      ]);

      const orderData = ordersRes.data ?? [];
      setOrders(orderData);

      const uniqueUsers = new Set(orderData.map((o) => o.user_id));
      const totalRevenue = orderData
        .filter((o) => o.payment_status === "paid")
        .reduce((sum, o) => sum + Number(o.payment_amount), 0);

      setStats({
        revenue: totalRevenue,
        customers: uniqueUsers.size,
        products: productsRes.count ?? 0,
      });
      setLoading(false);
    };
    fetchData();
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ order_status: status as any }).eq("id", orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: status } : o))
    );
  };

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-accent/20 text-accent-foreground",
      processing: "bg-primary/20 text-primary",
      delivered: "bg-primary/20 text-primary",
      cancelled: "bg-destructive/20 text-destructive",
    };
    return map[status] ?? "bg-muted text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg btn-primary-gradient flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
              PB
            </div>
            <span className="font-display font-bold text-lg text-foreground">Admin Panel</span>
          </div>
          <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: DollarSign, label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, color: "text-primary" },
            { icon: ShoppingCart, label: "Orders", value: orders.length, color: "text-primary" },
            { icon: Users, label: "Customers", value: stats.customers, color: "text-accent-foreground" },
            { icon: Package, label: "Products", value: stats.products, color: "text-primary" },
          ].map((s) => (
            <div key={s.label} className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <h2 className="text-xl font-display font-bold text-foreground mb-4">Recent Orders</h2>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Product</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{order.customer_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                    </td>
                    <td className="p-4 text-foreground">{order.products?.name ?? "—"}</td>
                    <td className="p-4 font-display font-bold text-foreground">₹{order.payment_amount}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.order_status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-xs bg-secondary border border-border rounded-lg px-2 py-1 text-foreground"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

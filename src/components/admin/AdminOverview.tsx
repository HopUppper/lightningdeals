import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const AdminOverview = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenue: 0, customers: 0, products: 0, orderCount: 0 });
  const [topProducts, setTopProducts] = useState<{ name: string; count: number; revenue: number }[]>([]);
  const [dailySales, setDailySales] = useState<{ date: string; revenue: number; orders: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from("orders").select("*, products(name, logo_url)").order("created_at", { ascending: false }),
        supabase.from("products").select("id", { count: "exact" }),
      ]);

      const orderData = ordersRes.data ?? [];
      setOrders(orderData.slice(0, 10));

      const paidOrders = orderData.filter((o) => o.payment_status === "paid");
      const uniqueUsers = new Set(orderData.map((o) => o.user_id));
      const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.payment_amount), 0);

      // Top products
      const productMap = new Map<string, { name: string; count: number; revenue: number }>();
      paidOrders.forEach((o) => {
        const name = o.products?.name || "Unknown";
        const existing = productMap.get(name) || { name, count: 0, revenue: 0 };
        existing.count++;
        existing.revenue += Number(o.payment_amount);
        productMap.set(name, existing);
      });
      const sorted = Array.from(productMap.values()).sort((a, b) => b.count - a.count).slice(0, 5);
      setTopProducts(sorted);

      // Daily sales (last 7 days)
      const dayMap = new Map<string, { revenue: number; orders: number }>();
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        dayMap.set(key, { revenue: 0, orders: 0 });
      }
      paidOrders.forEach((o) => {
        const key = new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        const existing = dayMap.get(key);
        if (existing) {
          existing.revenue += Number(o.payment_amount);
          existing.orders++;
        }
      });
      setDailySales(Array.from(dayMap.entries()).map(([date, v]) => ({ date, ...v })));

      setStats({ revenue: totalRevenue, customers: uniqueUsers.size, products: productsRes.count ?? 0, orderCount: orderData.length });
      setLoading(false);
    };
    fetchData();
  }, []);

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-accent/20 text-accent-foreground",
      processing: "bg-primary/20 text-primary",
      delivered: "bg-primary/30 text-primary",
      cancelled: "bg-destructive/20 text-destructive",
      refunded: "bg-muted text-muted-foreground",
    };
    return map[status] ?? "bg-muted text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}` },
          { icon: ShoppingCart, label: "Total Orders", value: stats.orderCount },
          { icon: Users, label: "Customers", value: stats.customers },
          { icon: Package, label: "Products", value: stats.products },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Revenue (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" /> Orders (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h2 className="font-display font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" /> Recent Orders
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Product</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <p className="font-medium text-foreground text-xs">{order.customer_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                    </td>
                    <td className="p-3 text-foreground text-xs">{order.products?.name ?? "—"}</td>
                    <td className="p-3 font-display font-bold text-foreground text-xs">₹{order.payment_amount}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h2 className="font-display font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Top Selling
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No sales data yet</p>
            ) : (
              topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.count} sold · ₹{p.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

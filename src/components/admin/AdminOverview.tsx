import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DollarSign, ShoppingCart, Users, Package, TrendingUp, Plus,
  Edit2, Image, ClipboardList, Clock, Lightbulb, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from "recharts";

interface Props {
  onNavigate: (tab: string) => void;
  onQuickAction?: (action: string) => void;
}

const tips = [
  { title: "Add products faster", desc: "Use AI Generate to auto-write descriptions when adding products." },
  { title: "Drag & drop images", desc: "Click the image area in product form to upload logos instantly." },
  { title: "Inline price editing", desc: "Click any price in the Products table to edit it directly." },
  { title: "Keyboard shortcuts", desc: "Press Ctrl+N to add a product, Ctrl+K to search." },
  { title: "Bulk order updates", desc: "Use the status dropdown in Orders to change status instantly." },
];

const AdminOverview = ({ onNavigate, onQuickAction }: Props) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenue: 0, customers: 0, products: 0, orderCount: 0, pendingOrders: 0 });
  const [topProducts, setTopProducts] = useState<{ name: string; count: number; revenue: number }[]>([]);
  const [dailySales, setDailySales] = useState<{ date: string; revenue: number; orders: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    setTipIndex(Math.floor(Math.random() * tips.length));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from("orders").select("*, products(name, logo_url)").order("created_at", { ascending: false }),
        supabase.from("products").select("id", { count: "exact" }),
      ]);

      const orderData = ordersRes.data ?? [];
      setOrders(orderData.slice(0, 8));

      const paidOrders = orderData.filter((o) => o.payment_status === "paid");
      const pendingOrders = orderData.filter((o) => o.order_status === "pending").length;
      const uniqueUsers = new Set(orderData.map((o) => o.user_id));
      const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.payment_amount), 0);

      const productMap = new Map<string, { name: string; count: number; revenue: number }>();
      paidOrders.forEach((o) => {
        const name = o.products?.name || "Unknown";
        const existing = productMap.get(name) || { name, count: 0, revenue: 0 };
        existing.count++;
        existing.revenue += Number(o.payment_amount);
        productMap.set(name, existing);
      });
      setTopProducts(Array.from(productMap.values()).sort((a, b) => b.count - a.count).slice(0, 5));

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
        if (existing) { existing.revenue += Number(o.payment_amount); existing.orders++; }
      });
      setDailySales(Array.from(dayMap.entries()).map(([date, v]) => ({ date, ...v })));

      setStats({
        revenue: totalRevenue, customers: uniqueUsers.size,
        products: productsRes.count ?? 0, orderCount: orderData.length, pendingOrders
      });
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

  const quickActions = [
    { icon: Plus, label: "Add Product", color: "bg-primary/10 text-primary", action: () => onQuickAction?.("add-product") },
    { icon: Edit2, label: "Edit Products", color: "bg-blue-500/10 text-blue-500", action: () => onNavigate("products") },
    { icon: Image, label: "Upload Image", color: "bg-purple-500/10 text-purple-500", action: () => onQuickAction?.("add-product") },
    { icon: ClipboardList, label: "Manage Orders", color: "bg-orange-500/10 text-orange-500", action: () => onNavigate("orders") },
    { icon: Clock, label: `Pending (${stats.pendingOrders})`, color: "bg-accent/10 text-accent-foreground", action: () => onQuickAction?.("pending-orders") },
    { icon: Package, label: "Categories", color: "bg-emerald-500/10 text-emerald-500", action: () => onNavigate("categories") },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((qa, i) => (
            <motion.button
              key={qa.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={qa.action}
              className="glass-card p-4 flex flex-col items-center gap-2.5 hover:border-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl ${qa.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <qa.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-foreground">{qa.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: DollarSign, label: "Revenue", value: `₹${stats.revenue.toLocaleString()}` },
          { icon: ShoppingCart, label: "Orders", value: stats.orderCount },
          { icon: Users, label: "Customers", value: stats.customers },
          { icon: Package, label: "Products", value: stats.products },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="glass-card p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-4 flex items-start gap-3 border-primary/20"
      >
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4 text-accent-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{tips[tipIndex].title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{tips[tipIndex].desc}</p>
        </div>
        <button
          onClick={() => setTipIndex((prev) => (prev + 1) % tips.length)}
          className="text-xs text-primary hover:underline shrink-0"
        >
          Next tip
        </button>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <h3 className="font-display font-bold text-foreground text-sm mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Revenue (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
              />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-4">
          <h3 className="font-display font-bold text-foreground text-sm mb-3 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" /> Orders (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
              />
              <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders + Top Selling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-3 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-display font-bold text-foreground text-sm flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" /> Recent Orders
            </h2>
            <button onClick={() => onNavigate("orders")} className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Customer</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Product</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Amount</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <p className="font-medium text-foreground text-xs">{order.customer_name || "—"}</p>
                    </td>
                    <td className="p-3 text-foreground text-xs">{order.products?.name ?? "—"}</td>
                    <td className="p-3 font-display font-bold text-foreground text-xs">₹{order.payment_amount}</td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${statusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={4} className="p-6 text-center text-muted-foreground text-xs">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-3 border-b border-border/50">
            <h2 className="font-display font-bold text-foreground text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Top Selling
            </h2>
          </div>
          <div className="p-3 space-y-2.5">
            {topProducts.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No sales data yet</p>
            ) : (
              topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.count} sold · ₹{p.revenue.toLocaleString()}</p>
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

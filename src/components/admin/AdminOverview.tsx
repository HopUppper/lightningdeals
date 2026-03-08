import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DollarSign, ShoppingCart, Users, Package, TrendingUp, Plus,
  Edit2, Image, ClipboardList, Clock, Lightbulb, ArrowRight,
  BarChart3, PieChart, CalendarDays, ArrowUpRight, ArrowDownRight,
  UserPlus, Repeat, Star, Percent
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart as RechartsPie, Pie, Cell
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

const COLORS = ["hsl(38, 85%, 58%)", "hsl(210, 20%, 95%)", "hsl(142, 70%, 45%)", "hsl(0, 72%, 51%)", "hsl(220, 12%, 55%)"];

const AdminOverview = ({ onNavigate, onQuickAction }: Props) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenue: 0, customers: 0, products: 0, orderCount: 0, pendingOrders: 0 });
  const [prevStats, setPrevStats] = useState({ revenue: 0, orderCount: 0 });
  const [topProducts, setTopProducts] = useState<{ name: string; count: number; revenue: number }[]>([]);
  const [dailySales, setDailySales] = useState<{ date: string; revenue: number; orders: number }[]>([]);
  const [monthlySales, setMonthlySales] = useState<{ month: string; revenue: number; orders: number }[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [chartRange, setChartRange] = useState<"7d" | "30d">("7d");

  useEffect(() => { setTipIndex(Math.floor(Math.random() * tips.length)); }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        // Previous period stats (for trend comparison)
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000);
        const currentPeriod = paidOrders.filter((o) => new Date(o.created_at) >= sevenDaysAgo);
        const prevPeriod = paidOrders.filter((o) => {
          const d = new Date(o.created_at);
          return d >= fourteenDaysAgo && d < sevenDaysAgo;
        });
        setPrevStats({
          revenue: prevPeriod.reduce((s, o) => s + Number(o.payment_amount), 0),
          orderCount: prevPeriod.length,
        });

        // Top products
        const productMap = new Map<string, { name: string; count: number; revenue: number }>();
        paidOrders.forEach((o) => {
          const name = o.products?.name || "Unknown";
          const existing = productMap.get(name) || { name, count: 0, revenue: 0 };
          existing.count++;
          existing.revenue += Number(o.payment_amount);
          productMap.set(name, existing);
        });
        setTopProducts(Array.from(productMap.values()).sort((a, b) => b.count - a.count).slice(0, 5));

        // Daily sales (7 or 30 days)
        const days = chartRange === "7d" ? 7 : 30;
        const dayMap = new Map<string, { revenue: number; orders: number }>();
        for (let i = days - 1; i >= 0; i--) {
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

        // Monthly sales (6 months)
        const monthMap = new Map<string, { revenue: number; orders: number }>();
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const key = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
          monthMap.set(key, { revenue: 0, orders: 0 });
        }
        paidOrders.forEach((o) => {
          const key = new Date(o.created_at).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
          const existing = monthMap.get(key);
          if (existing) { existing.revenue += Number(o.payment_amount); existing.orders++; }
        });
        setMonthlySales(Array.from(monthMap.entries()).map(([month, v]) => ({ month, ...v })));

        // Status breakdown
        const statusMap = new Map<string, number>();
        orderData.forEach((o) => statusMap.set(o.order_status, (statusMap.get(o.order_status) || 0) + 1));
        setStatusBreakdown(Array.from(statusMap.entries()).map(([name, value]) => ({ name, value })));

        setStats({
          revenue: totalRevenue, customers: uniqueUsers.size,
          products: productsRes.count ?? 0, orderCount: orderData.length, pendingOrders
        });
      } catch (e) {
        console.error("Failed to fetch admin overview:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chartRange]);

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

  const getTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const revenueTrend = getTrend(
    dailySales.slice(-7).reduce((s, d) => s + d.revenue, 0),
    prevStats.revenue
  );
  const orderTrend = getTrend(
    dailySales.slice(-7).reduce((s, d) => s + d.orders, 0),
    prevStats.orderCount
  );

  const avgOrderValue = stats.orderCount > 0 ? Math.round(stats.revenue / stats.orderCount) : 0;

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

      {/* Stats with trends */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { icon: DollarSign, label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, trend: revenueTrend },
          { icon: ShoppingCart, label: "Orders", value: stats.orderCount, trend: orderTrend },
          { icon: Users, label: "Customers", value: stats.customers, trend: null },
          { icon: Package, label: "Products", value: stats.products, trend: null },
          { icon: BarChart3, label: "Avg Order", value: `₹${avgOrderValue}`, trend: null },
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
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-display font-bold text-foreground">{s.value}</p>
            </div>
            {s.trend !== null && s.trend !== 0 && (
              <div className={`flex items-center gap-0.5 text-[10px] font-medium ${s.trend > 0 ? "text-emerald-500" : "text-destructive"}`}>
                {s.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(s.trend)}%
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Tip */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-4 flex items-start gap-3 border-primary/20">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4 text-accent-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{tips[tipIndex].title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{tips[tipIndex].desc}</p>
        </div>
        <button onClick={() => setTipIndex((prev) => (prev + 1) % tips.length)} className="text-xs text-primary hover:underline shrink-0">Next tip</button>
      </motion.div>

      {/* Revenue Chart with range toggle */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-foreground text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" /> Revenue Trend
          </h3>
          <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
            {(["7d", "30d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setChartRange(r)}
                className={`text-[10px] px-3 py-1 rounded-md font-medium transition-colors ${
                  chartRange === r ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "7d" ? "7 Days" : "30 Days"}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={dailySales}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 85%, 58%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(38, 85%, 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={chartRange === "30d" ? 4 : 0} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11, color: "hsl(var(--foreground))" }} />
            <Area type="monotone" dataKey="revenue" stroke="hsl(38, 85%, 58%)" strokeWidth={2} fill="url(#revenueGrad)" dot={{ r: 2, fill: "hsl(38, 85%, 58%)" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Orders + Status + Monthly */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Orders bar chart */}
        <div className="glass-card p-5">
          <h3 className="font-display font-bold text-foreground text-sm mb-3 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" /> Orders ({chartRange === "7d" ? "7 Days" : "30 Days"})
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} interval={chartRange === "30d" ? 6 : 0} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11, color: "hsl(var(--foreground))" }} />
              <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie */}
        <div className="glass-card p-5">
          <h3 className="font-display font-bold text-foreground text-sm mb-3 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-accent" /> Order Status
          </h3>
          {statusBreakdown.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <RechartsPie>
                  <Pie data={statusBreakdown} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={2}>
                    {statusBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </RechartsPie>
              </ResponsiveContainer>
              <div className="space-y-2">
                {statusBreakdown.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-muted-foreground capitalize">{s.name}</span>
                    <span className="text-xs font-medium text-foreground ml-auto">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-8">No data</p>
          )}
        </div>

        {/* Monthly revenue */}
        <div className="glass-card p-5">
          <h3 className="font-display font-bold text-foreground text-sm mb-3 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-emerald-500" /> Monthly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11, color: "hsl(var(--foreground))" }} />
              <Bar dataKey="revenue" fill="hsl(142, 70%, 45%)" radius={[4, 4, 0, 0]} />
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
                    <td className="p-3"><p className="font-medium text-foreground text-xs">{order.customer_name || "—"}</p></td>
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
              <TrendingUp className="w-4 h-4 text-accent" /> Top Selling
            </h2>
          </div>
          <div className="p-3 space-y-2.5">
            {topProducts.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No sales data yet</p>
            ) : (
              topProducts.map((p, i) => {
                const maxRev = topProducts[0]?.revenue || 1;
                return (
                  <div key={p.name} className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.count} sold · ₹{p.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="ml-7">
                      <div className="h-1 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(p.revenue / maxRev) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

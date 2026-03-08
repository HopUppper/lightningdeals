import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart3, TrendingUp, Users, Tag, Gift, IndianRupee,
  ArrowUpRight, ArrowDownRight, Layers, ShoppingBag
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const COLORS = [
  "hsl(38, 85%, 58%)", "hsl(210, 70%, 55%)", "hsl(142, 70%, 45%)",
  "hsl(340, 70%, 55%)", "hsl(270, 60%, 55%)", "hsl(180, 50%, 45%)"
];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 11,
  color: "hsl(var(--foreground))",
};

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [categoryRevenue, setCategoryRevenue] = useState<{ name: string; revenue: number; orders: number }[]>([]);
  const [couponStats, setCouponStats] = useState<{ code: string; uses: number; discount: number }[]>([]);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0, totalRewardsPaid: 0, topReferrers: [] as { name: string; referrals: number; earned: number }[],
  });
  const [revenueByDay, setRevenueByDay] = useState<{ day: string; revenue: number }[]>([]);
  const [ltvData, setLtvData] = useState({ avgLtv: 0, maxLtv: 0, singleBuyers: 0, multiBuyers: 0 });
  const [paymentMethodStats, setPaymentMethodStats] = useState<{ name: string; value: number }[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<{ week: string; revenue: number; orders: number }[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [ordersRes, categoriesRes, couponsRes, referralsRes, profilesRes] = await Promise.all([
        supabase.from("orders").select("*, products(name, category_id, categories:category_id(name))"),
        supabase.from("categories").select("id, name"),
        supabase.from("coupons").select("code, used_count, discount_value, discount_type"),
        supabase.from("referral_codes").select("user_id, code, total_referrals, total_earned, wallet_balance"),
        supabase.from("profiles").select("user_id, name, email"),
      ]);

      const orders = ordersRes.data ?? [];
      const categories = categoriesRes.data ?? [];
      const coupons = couponsRes.data ?? [];
      const referrals = referralsRes.data ?? [];
      const profiles = profilesRes.data ?? [];
      const paidOrders = orders.filter((o) => o.payment_status === "paid");

      // --- Category Revenue ---
      const catMap = new Map<string, { revenue: number; orders: number }>();
      paidOrders.forEach((o) => {
        const catName = (o.products as any)?.categories?.name || "Uncategorized";
        const existing = catMap.get(catName) || { revenue: 0, orders: 0 };
        existing.revenue += Number(o.payment_amount);
        existing.orders++;
        catMap.set(catName, existing);
      });
      setCategoryRevenue(
        Array.from(catMap.entries())
          .map(([name, v]) => ({ name, ...v }))
          .sort((a, b) => b.revenue - a.revenue)
      );

      // --- Coupon Performance ---
      setCouponStats(
        coupons
          .filter((c) => c.used_count > 0)
          .map((c) => ({ code: c.code, uses: c.used_count, discount: c.discount_value }))
          .sort((a, b) => b.uses - a.uses)
          .slice(0, 8)
      );

      // --- Referral Analytics ---
      const profileMap = new Map(profiles.map((p) => [p.user_id, p]));
      const topReferrers = referrals
        .filter((r) => r.total_referrals > 0)
        .sort((a, b) => b.total_referrals - a.total_referrals)
        .slice(0, 5)
        .map((r) => ({
          name: profileMap.get(r.user_id)?.name || profileMap.get(r.user_id)?.email || "Unknown",
          referrals: r.total_referrals,
          earned: Number(r.total_earned),
        }));
      setReferralStats({
        totalReferrals: referrals.reduce((s, r) => s + r.total_referrals, 0),
        totalRewardsPaid: referrals.reduce((s, r) => s + Number(r.total_earned), 0),
        topReferrers,
      });

      // --- Revenue by Day of Week ---
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayMap = new Map<string, number>();
      dayNames.forEach((d) => dayMap.set(d, 0));
      paidOrders.forEach((o) => {
        const day = dayNames[new Date(o.created_at).getDay()];
        dayMap.set(day, (dayMap.get(day) || 0) + Number(o.payment_amount));
      });
      setRevenueByDay(dayNames.map((day) => ({ day, revenue: dayMap.get(day) || 0 })));

      // --- Customer LTV ---
      const userSpend = new Map<string, number>();
      paidOrders.forEach((o) => {
        userSpend.set(o.user_id, (userSpend.get(o.user_id) || 0) + Number(o.payment_amount));
      });
      const spends = Array.from(userSpend.values());
      const userOrderCounts = new Map<string, number>();
      paidOrders.forEach((o) => userOrderCounts.set(o.user_id, (userOrderCounts.get(o.user_id) || 0) + 1));
      const singleBuyers = Array.from(userOrderCounts.values()).filter((c) => c === 1).length;
      const multiBuyers = Array.from(userOrderCounts.values()).filter((c) => c > 1).length;

      setLtvData({
        avgLtv: spends.length > 0 ? Math.round(spends.reduce((a, b) => a + b, 0) / spends.length) : 0,
        maxLtv: spends.length > 0 ? Math.round(Math.max(...spends)) : 0,
        singleBuyers,
        multiBuyers,
      });

      // --- Payment Status Breakdown ---
      const payMap = new Map<string, number>();
      orders.forEach((o) => {
        const status = o.payment_status || "unknown";
        payMap.set(status, (payMap.get(status) || 0) + 1);
      });
      setPaymentMethodStats(Array.from(payMap.entries()).map(([name, value]) => ({ name, value })));

      // --- Weekly Trend (last 8 weeks) ---
      const weekMap = new Map<string, { revenue: number; orders: number }>();
      for (let i = 7; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i * 7);
        const key = `W${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
        weekMap.set(key, { revenue: 0, orders: 0 });
      }
      paidOrders.forEach((o) => {
        const orderDate = new Date(o.created_at);
        const now = new Date();
        const diffWeeks = Math.floor((now.getTime() - orderDate.getTime()) / (7 * 86400000));
        if (diffWeeks <= 7) {
          const d = new Date();
          d.setDate(d.getDate() - diffWeeks * 7);
          const key = `W${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
          const existing = weekMap.get(key);
          if (existing) {
            existing.revenue += Number(o.payment_amount);
            existing.orders++;
          }
        }
      });
      setWeeklyTrend(Array.from(weekMap.entries()).map(([week, v]) => ({ week, ...v })));
    } catch (e) {
      console.error("Analytics fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-foreground">Analytics & Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep dive into revenue, customers, and growth metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: IndianRupee, label: "Avg Customer LTV", value: `₹${ltvData.avgLtv.toLocaleString()}`, sub: `Max: ₹${ltvData.maxLtv.toLocaleString()}`, color: "text-primary" },
          { icon: Users, label: "Buyer Segments", value: `${ltvData.multiBuyers} repeat`, sub: `${ltvData.singleBuyers} one-time`, color: "text-emerald-500" },
          { icon: Gift, label: "Referral Rewards", value: `₹${referralStats.totalRewardsPaid.toLocaleString()}`, sub: `${referralStats.totalReferrals} total referrals`, color: "text-accent-foreground" },
          { icon: Tag, label: "Top Coupon Uses", value: couponStats[0]?.uses || 0, sub: couponStats[0]?.code || "No coupons used", color: "text-blue-500" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <m.icon className={`w-4 h-4 ${m.color}`} />
              <span className="text-xs text-muted-foreground">{m.label}</span>
            </div>
            <p className="text-xl font-display font-bold text-foreground">{m.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue by Category + Day of Week */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-display font-bold text-foreground text-sm mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" /> Revenue by Category
          </h3>
          {categoryRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryRevenue} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={100} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                  {categoryRevenue.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-8">No category data</p>
          )}
        </div>

        <div className="glass-card p-5">
          <h3 className="font-display font-bold text-foreground text-sm mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent" /> Revenue by Day of Week
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="hsl(38, 85%, 58%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Trend + Payment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="font-display font-bold text-foreground text-sm mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Weekly Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(142, 70%, 45%)" strokeWidth={2} fill="url(#weeklyGrad)" dot={{ r: 3, fill: "hsl(142, 70%, 45%)" }} />
              <Line type="monotone" dataKey="orders" stroke="hsl(38, 85%, 58%)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-display font-bold text-foreground text-sm mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" /> Payment Status
          </h3>
          {paymentMethodStats.length > 0 ? (
            <div className="flex flex-col items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={paymentMethodStats} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={2}>
                    {paymentMethodStats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-2">
                {paymentMethodStats.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-muted-foreground capitalize flex-1">{s.name}</span>
                    <span className="text-xs font-medium text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-8">No data</p>
          )}
        </div>
      </div>

      {/* Coupon Performance + Top Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-display font-bold text-foreground text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-500" /> Coupon Performance
            </h3>
          </div>
          <div className="p-4">
            {couponStats.length > 0 ? (
              <div className="space-y-3">
                {couponStats.map((c, i) => {
                  const maxUses = couponStats[0]?.uses || 1;
                  return (
                    <div key={c.code} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-foreground">{c.code}</span>
                          <span className="text-[10px] text-muted-foreground">{c.discount}{c.discount > 100 ? " off" : "% off"}</span>
                        </div>
                        <span className="text-xs font-medium text-foreground">{c.uses} uses</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${(c.uses / maxUses) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">No coupons used yet</p>
            )}
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-display font-bold text-foreground text-sm flex items-center gap-2">
              <Gift className="w-4 h-4 text-accent" /> Top Referrers
            </h3>
          </div>
          <div className="p-4">
            {referralStats.topReferrers.length > 0 ? (
              <div className="space-y-3">
                {referralStats.topReferrers.map((r, i) => (
                  <div key={r.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{r.name}</p>
                      <p className="text-[10px] text-muted-foreground">{r.referrals} referrals · ₹{r.earned.toLocaleString()} earned</p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500">
                      <ArrowUpRight className="w-3 h-3" />
                      <span className="text-[10px] font-medium">₹{r.earned}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">No referrals yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

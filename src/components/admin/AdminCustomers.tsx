import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Search, Mail, Phone, MapPin, ShoppingCart, DollarSign, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface Customer {
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  created_at: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string | null;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const [profilesRes, ordersRes] = await Promise.all([
          supabase.from("profiles").select("user_id, name, email, phone, location, created_at"),
          supabase.from("orders").select("user_id, payment_amount, payment_status, created_at"),
        ]);

        const profiles = profilesRes.data ?? [];
        const orders = ordersRes.data ?? [];

        // Aggregate order data per customer
        const orderMap = new Map<string, { count: number; spent: number; lastOrder: string | null }>();
        orders.forEach((o) => {
          const existing = orderMap.get(o.user_id) || { count: 0, spent: 0, lastOrder: null };
          existing.count++;
          if (o.payment_status === "paid") {
            existing.spent += Number(o.payment_amount);
          }
          if (!existing.lastOrder || o.created_at > existing.lastOrder) {
            existing.lastOrder = o.created_at;
          }
          orderMap.set(o.user_id, existing);
        });

        const customerList: Customer[] = profiles.map((p) => {
          const stats = orderMap.get(p.user_id) || { count: 0, spent: 0, lastOrder: null };
          return {
            user_id: p.user_id,
            name: p.name || "Unknown",
            email: p.email,
            phone: p.phone,
            location: p.location,
            created_at: p.created_at,
            orderCount: stats.count,
            totalSpent: stats.spent,
            lastOrder: stats.lastOrder,
          };
        });

        // Sort by total spent descending
        customerList.sort((a, b) => b.totalSpent - a.totalSpent);
        setCustomers(customerList);
      } catch (e) {
        console.error("Failed to fetch customers:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const viewCustomerOrders = async (customer: Customer) => {
    setSelectedCustomer(customer);
    const { data } = await supabase
      .from("orders")
      .select("*, products(name, logo_url)")
      .eq("user_id", customer.user_id)
      .order("created_at", { ascending: false });
    setCustomerOrders(data ?? []);
  };

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.phone?.includes(s);
  });

  const totalLTV = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgLTV = customers.length > 0 ? Math.round(totalLTV / customers.length) : 0;

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl font-display font-bold text-foreground">Customers ({customers.length})</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-56"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Users, label: "Total Customers", value: customers.length },
          { icon: DollarSign, label: "Total LTV", value: `₹${totalLTV.toLocaleString()}` },
          { icon: ShoppingCart, label: "Avg LTV", value: `₹${avgLTV.toLocaleString()}` },
          { icon: Users, label: "With Orders", value: customers.filter((c) => c.orderCount > 0).length },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-display font-bold text-foreground">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Customer table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Customer</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Contact</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Location</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Orders</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Total Spent</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.user_id}
                  onClick={() => viewCustomerOrders(c)}
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{c.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {c.phone ? (
                        <><Phone className="w-3 h-3" /> {c.phone}</>
                      ) : (
                        <span className="text-muted-foreground/50">No phone</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {c.location ? (
                        <><MapPin className="w-3 h-3" /> {c.location}</>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-display font-bold text-foreground">{c.orderCount}</td>
                  <td className="p-3 font-display font-bold text-foreground">₹{c.totalSpent.toLocaleString()}</td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer detail panel */}
      {selectedCustomer && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{selectedCustomer.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground">{selectedCustomer.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedCustomer.email}</p>
              </div>
            </div>
            <button onClick={() => setSelectedCustomer(null)} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Orders</p>
              <p className="text-lg font-display font-bold text-foreground">{selectedCustomer.orderCount}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Lifetime Value</p>
              <p className="text-lg font-display font-bold text-foreground">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Last Order</p>
              <p className="text-sm font-display font-bold text-foreground">
                {selectedCustomer.lastOrder
                  ? new Date(selectedCustomer.lastOrder).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                  : "—"}
              </p>
            </div>
          </div>

          {customerOrders.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Order History</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {customerOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between bg-secondary/30 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      {o.products?.logo_url ? (
                        <img src={o.products.logo_url} alt="" className="w-8 h-8 rounded object-contain bg-muted/30" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-muted/50 flex items-center justify-center">
                          <ShoppingCart className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{o.products?.name || "Unknown"}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(o.created_at).toLocaleDateString("en-IN")} · {o.order_status}
                        </p>
                      </div>
                    </div>
                    <span className="font-display font-bold text-foreground">₹{o.payment_amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AdminCustomers;

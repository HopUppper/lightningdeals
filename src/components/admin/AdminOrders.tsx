import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Eye, MessageCircle, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const statuses = ["all", "pending", "processing", "delivered", "cancelled", "refunded"] as const;

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

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase
      .from("orders")
      .select("*, products(name, logo_url, slug)")
      .order("created_at", { ascending: false });

    if (filterStatus !== "all") {
      query = query.eq("order_status", filterStatus as any);
    }

    const { data } = await query;
    setOrders(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const openOrderDetail = async (order: any) => {
    setSelectedOrder(order);
    const { data } = await supabase
      .from("order_status_history")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true });
    setStatusHistory(data ?? []);
  };

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ order_status: status as any }).eq("id", orderId);
    if (error) {
      toast.error("Failed to update status");
    } else {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, order_status: status } : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, order_status: status }));
        setStatusHistory((prev) => [...prev, { id: Date.now(), status, created_at: new Date().toISOString() }]);
      }
      toast.success(`Order marked as ${status}`);
    }
  };

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      o.customer_name?.toLowerCase().includes(s) ||
      o.customer_email?.toLowerCase().includes(s) ||
      o.payment_id?.toLowerCase().includes(s) ||
      o.id?.toLowerCase().includes(s) ||
      o.products?.name?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground">All Orders ({orders.length})</h2>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-56"
            />
          </div>
          <div className="flex gap-1 bg-muted/50 rounded-lg p-1 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium capitalize transition-colors ${
                  filterStatus === s ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Product</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Payment</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground text-sm">{order.customer_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                    </td>
                    <td className="p-4 text-foreground text-sm">{order.products?.name ?? "—"}</td>
                    <td className="p-4 font-display font-bold text-foreground">₹{order.payment_amount}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        order.payment_status === "paid" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent-foreground"
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.order_status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-xs border-0 rounded-full px-2.5 py-1 font-medium capitalize cursor-pointer ${statusColor(order.order_status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openOrderDetail(order)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {order.customer_phone && (
                          <a
                            href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello, this is Sidh from Lightning Deals.\nYour order has been received and we are processing your subscription.\nWe will deliver it shortly.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground block text-xs">Customer</span><span className="font-medium text-foreground">{selectedOrder.customer_name}</span></div>
                <div><span className="text-muted-foreground block text-xs">Email</span><span className="font-medium text-foreground">{selectedOrder.customer_email}</span></div>
                <div><span className="text-muted-foreground block text-xs">Phone</span><span className="font-medium text-foreground">{selectedOrder.customer_phone || "—"}</span></div>
                <div><span className="text-muted-foreground block text-xs">Country</span><span className="font-medium text-foreground">{selectedOrder.customer_country || "—"}</span></div>
                <div><span className="text-muted-foreground block text-xs">Product</span><span className="font-medium text-foreground">{selectedOrder.products?.name}</span></div>
                <div><span className="text-muted-foreground block text-xs">Amount</span><span className="font-display font-bold text-foreground">₹{selectedOrder.payment_amount}</span></div>
                <div><span className="text-muted-foreground block text-xs">Payment ID</span><span className="font-mono text-xs text-foreground">{selectedOrder.payment_id || "—"}</span></div>
                <div><span className="text-muted-foreground block text-xs">Order ID</span><span className="font-mono text-xs text-foreground">{selectedOrder.id?.slice(0, 8)}</span></div>
              </div>
              {selectedOrder.notes && (
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Notes</span>
                  <p className="text-foreground bg-muted/50 rounded-lg p-3 text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Status Buttons */}
              <div className="flex gap-2 pt-2 flex-wrap">
                {["pending", "processing", "delivered", "cancelled", "refunded"].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={selectedOrder.order_status === s ? "default" : "outline"}
                    onClick={() => updateStatus(selectedOrder.id, s)}
                    className="capitalize text-xs flex-1 min-w-[70px]"
                  >
                    {s}
                  </Button>
                ))}
              </div>

              {/* Status Timeline */}
              {statusHistory.length > 0 && (
                <div>
                  <span className="text-muted-foreground block text-xs mb-2 font-semibold">Order Timeline</span>
                  <div className="relative pl-4 space-y-3">
                    <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-border" />
                    {statusHistory.map((h, i) => (
                      <div key={h.id} className="relative flex items-start gap-3">
                        <div className={`absolute left-[-13px] w-3 h-3 rounded-full border-2 ${i === statusHistory.length - 1 ? "bg-primary border-primary" : "bg-background border-border"}`} />
                        <div>
                          <span className={`text-xs font-semibold capitalize ${statusColor(h.status)} px-2 py-0.5 rounded-full`}>
                            {h.status}
                          </span>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {new Date(h.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Package, ShoppingCart, LogOut, User, MessageCircle, Mail, Phone, Edit2, Check, X, Key, Clock, Shield, RefreshCw, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const statusConfig: Record<string, { color: string; icon: typeof Clock; label: string }> = {
  pending: { color: "bg-accent/20 text-accent-foreground", icon: Clock, label: "Pending" },
  processing: { color: "bg-primary/20 text-primary", icon: Package, label: "Processing" },
  delivered: { color: "bg-primary/30 text-primary", icon: Check, label: "Delivered" },
  cancelled: { color: "bg-destructive/20 text-destructive", icon: X, label: "Cancelled" },
  refunded: { color: "bg-muted text-muted-foreground", icon: RefreshCw, label: "Refunded" },
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [timelineOrder, setTimelineOrder] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const [profileRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("orders").select("*, products(name, logo_url, duration, delivery, slug)").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(profileRes.data);
      setOrders(ordersRes.data ?? []);
      if (profileRes.data) {
        setProfileForm({ name: profileRes.data.name || "", phone: profileRes.data.phone || "" });
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleProfileSave = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ name: profileForm.name, phone: profileForm.phone })
      .eq("user_id", user.id);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      setProfile((prev: any) => ({ ...prev, ...profileForm }));
      setEditingProfile(false);
      toast.success("Profile updated");
    }
  };

  const openTimeline = async (order: any) => {
    setTimelineOrder(order);
    const { data } = await supabase
      .from("order_status_history")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true });
    setTimeline(data ?? []);
  };

  const handleDownloadInvoice = async (order: any) => {
    try {
      const { data, error } = await supabase.storage
        .from("invoices")
        .download(order.invoice_url);
      if (error || !data) {
        toast.error("Failed to download invoice");
        return;
      }
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${order.id.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download invoice");
    }
  };

  const deliveredOrders = orders.filter((o) => o.order_status === "delivered");
  const pendingOrders = orders.filter((o) => o.order_status === "pending" || o.order_status === "processing");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">My Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {profile?.name || user?.email}</p>
            </div>
            <Button variant="outline" onClick={signOut} className="gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><ShoppingCart className="w-6 h-6 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">Total Orders</p><p className="text-2xl font-display font-bold text-foreground">{orders.length}</p></div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Key className="w-6 h-6 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">Active Subscriptions</p><p className="text-2xl font-display font-bold text-foreground">{deliveredOrders.length}</p></div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center"><Clock className="w-6 h-6 text-accent-foreground" /></div>
              <div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-display font-bold text-foreground">{pendingOrders.length}</p></div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Shield className="w-6 h-6 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">Total Spent</p><p className="text-2xl font-display font-bold text-foreground">₹{orders.reduce((s, o) => s + Number(o.payment_amount || 0), 0)}</p></div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="orders" className="gap-2 data-[state=active]:bg-background"><Package className="w-4 h-4" /> My Orders</TabsTrigger>
              <TabsTrigger value="subscriptions" className="gap-2 data-[state=active]:bg-background"><Key className="w-4 h-4" /> Subscriptions</TabsTrigger>
              <TabsTrigger value="account" className="gap-2 data-[state=active]:bg-background"><User className="w-4 h-4" /> Account</TabsTrigger>
              <TabsTrigger value="support" className="gap-2 data-[state=active]:bg-background"><MessageCircle className="w-4 h-4" /> Support</TabsTrigger>
            </TabsList>

            {/* My Orders Tab */}
            <TabsContent value="orders">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">Order History</h2>
              {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
              ) : orders.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Link to="/categories" className="btn-primary-gradient inline-block text-sm py-2 px-6">Browse Plans</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const config = statusConfig[order.order_status] || statusConfig.pending;
                    const StatusIcon = config.icon;
                    return (
                      <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            {order.products?.logo_url ? (
                              <img src={order.products.logo_url} alt="" className="w-10 h-10 rounded-lg object-contain bg-muted/30 p-1" loading="lazy" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center"><Package className="w-5 h-5 text-muted-foreground" /></div>
                            )}
                            <div>
                              <p className="font-medium text-foreground">{order.products?.name ?? "Product"}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                {order.payment_id && <span className="ml-2 font-mono">#{order.payment_id.slice(-8)}</span>}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-display font-bold text-foreground">₹{order.payment_amount}</span>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize inline-flex items-center gap-1 ${config.color}`}>
                              <StatusIcon className="w-3 h-3" /> {order.order_status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            {order.products?.duration && <span>Duration: {order.products.duration}</span>}
                            {order.products?.delivery && <span>Delivery: {order.products.delivery}</span>}
                          </div>
                          <div className="flex items-center gap-3">
                            {order.invoice_url && (
                              <button onClick={() => handleDownloadInvoice(order)} className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1">
                                <Download className="w-3 h-3" /> Invoice
                              </button>
                            )}
                            <button onClick={() => openTimeline(order)} className="text-xs text-primary hover:underline font-medium">
                              View Timeline
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Subscriptions Tab */}
            <TabsContent value="subscriptions">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">Active Subscriptions</h2>
              {deliveredOrders.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No active subscriptions</p>
                  <p className="text-xs text-muted-foreground mb-4">Your subscriptions will appear here once your order is delivered.</p>
                  <Link to="/categories" className="btn-primary-gradient inline-block text-sm py-2 px-6">Browse Plans</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {deliveredOrders.map((order) => (
                    <motion.div key={order.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        {order.products?.logo_url ? (
                          <img src={order.products.logo_url} alt="" className="w-12 h-12 rounded-xl object-contain bg-muted/30 p-1.5" loading="lazy" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center"><Package className="w-6 h-6 text-muted-foreground" /></div>
                        )}
                        <div>
                          <p className="font-display font-semibold text-foreground">{order.products?.name}</p>
                          <p className="text-xs text-muted-foreground">{order.products?.duration || "1 Year"}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Purchased</span>
                        <span className="text-foreground">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/20 text-primary inline-flex items-center gap-1"><Check className="w-3 h-3" /> Active</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">Account Details</h2>
              <div className="glass-card p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-foreground">Personal Information</h3>
                  {!editingProfile ? (
                    <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)} className="gap-1.5"><Edit2 className="w-3.5 h-3.5" /> Edit</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleProfileSave} className="gap-1.5"><Check className="w-3.5 h-3.5" /> Save</Button>
                      <Button variant="outline" size="sm" onClick={() => { setEditingProfile(false); setProfileForm({ name: profile?.name || "", phone: profile?.phone || "" }); }}>Cancel</Button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
                    {editingProfile ? (
                      <input value={profileForm.name} onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    ) : (
                      <p className="text-foreground font-medium">{profile?.name || "—"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                    <p className="text-foreground font-medium flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> {user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Phone / WhatsApp</label>
                    {editingProfile ? (
                      <input value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+91..." />
                    ) : (
                      <p className="text-foreground font-medium flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> {profile?.phone || "Not set"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Member Since</label>
                    <p className="text-foreground font-medium">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">Need Help?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="https://wa.me/919999999999?text=Hi!%20I%20need%20help%20with%20my%20order." target="_blank" rel="noopener noreferrer" className="glass-card p-6 hover:border-primary/30 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"><MessageCircle className="w-6 h-6 text-primary" /></div>
                  <h3 className="font-display font-semibold text-foreground mb-1">WhatsApp Support</h3>
                  <p className="text-sm text-muted-foreground">Chat with us on WhatsApp for instant support</p>
                </a>
                <a href="mailto:support@lightningdeals.in" className="glass-card p-6 hover:border-primary/30 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"><Mail className="w-6 h-6 text-primary" /></div>
                  <h3 className="font-display font-semibold text-foreground mb-1">Email Support</h3>
                  <p className="text-sm text-muted-foreground">support@lightningdeals.in</p>
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Order Timeline Dialog */}
      <Dialog open={!!timelineOrder} onOpenChange={() => setTimelineOrder(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Order Timeline</DialogTitle>
          </DialogHeader>
          {timelineOrder && (
            <div className="space-y-4">
              <div className="text-sm">
                <p className="font-medium text-foreground">{timelineOrder.products?.name}</p>
                <p className="text-xs text-muted-foreground">Order #{timelineOrder.id?.slice(0, 8)} · ₹{timelineOrder.payment_amount}</p>
              </div>
              {timeline.length > 0 ? (
                <div className="relative pl-5 space-y-4">
                  <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-border" />
                  {timeline.map((h, i) => {
                    const cfg = statusConfig[h.status] || statusConfig.pending;
                    return (
                      <div key={h.id} className="relative">
                        <div className={`absolute left-[-17px] w-3.5 h-3.5 rounded-full border-2 ${i === timeline.length - 1 ? "bg-primary border-primary" : "bg-background border-border"}`} />
                        <div>
                          <span className={`text-xs font-semibold capitalize ${cfg.color} px-2 py-0.5 rounded-full`}>{h.status}</span>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            {new Date(h.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No timeline data available</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Dashboard;

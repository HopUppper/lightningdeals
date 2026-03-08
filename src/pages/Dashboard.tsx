import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Package, ShoppingCart, LogOut, User, MessageCircle, Mail, Phone, Edit2, Check, X, Key, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });

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

  const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
    pending: { color: "bg-accent/20 text-accent-foreground", icon: Clock },
    processing: { color: "bg-primary/20 text-primary", icon: Package },
    delivered: { color: "bg-primary/30 text-primary", icon: Check },
    cancelled: { color: "bg-destructive/20 text-destructive", icon: X },
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
              <p className="text-muted-foreground mt-1">
                Welcome back, {profile?.name || user?.email}
              </p>
            </div>
            <Button variant="outline" onClick={signOut} className="gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
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
                <Key className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <p className="text-2xl font-display font-bold text-foreground">{deliveredOrders.length}</p>
              </div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-display font-bold text-foreground">{pendingOrders.length}</p>
              </div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-display font-bold text-foreground">
                  ₹{orders.reduce((s, o) => s + Number(o.payment_amount || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="orders" className="gap-2 data-[state=active]:bg-background">
                <Package className="w-4 h-4" /> My Orders
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="gap-2 data-[state=active]:bg-background">
                <Key className="w-4 h-4" /> Subscriptions
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-2 data-[state=active]:bg-background">
                <User className="w-4 h-4" /> Account
              </TabsTrigger>
              <TabsTrigger value="support" className="gap-2 data-[state=active]:bg-background">
                <MessageCircle className="w-4 h-4" /> Support
              </TabsTrigger>
            </TabsList>

            {/* My Orders Tab */}
            <TabsContent value="orders">
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
                  {orders.map((order) => {
                    const config = statusConfig[order.order_status] || statusConfig.pending;
                    const StatusIcon = config.icon;
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {order.products?.logo_url ? (
                              <img src={order.products.logo_url} alt="" className="w-10 h-10 rounded-lg object-contain bg-muted/30 p-1" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                                <Package className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-foreground">{order.products?.name ?? "Product"}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric",
                                })}
                                {order.payment_id && (
                                  <span className="ml-2 font-mono">#{order.payment_id.slice(-8)}</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-display font-bold text-foreground">₹{order.payment_amount}</span>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize inline-flex items-center gap-1 ${config.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {order.order_status}
                            </span>
                          </div>
                        </div>
                        {order.products?.duration && (
                          <div className="mt-2 pt-2 border-t border-border flex gap-4 text-xs text-muted-foreground">
                            <span>Duration: {order.products.duration}</span>
                            <span>Delivery: {order.products.delivery || "WhatsApp (< 5 min)"}</span>
                          </div>
                        )}
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
                  <p className="text-xs text-muted-foreground mb-4">
                    Your subscriptions will appear here once your order is delivered.
                  </p>
                  <Link to="/categories" className="btn-primary-gradient inline-block text-sm py-2 px-6">
                    Browse Plans
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {deliveredOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-card p-5 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        {order.products?.logo_url ? (
                          <img src={order.products.logo_url} alt="" className="w-12 h-12 rounded-xl object-contain bg-muted/30 p-1.5" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-display font-semibold text-foreground">{order.products?.name}</p>
                          <p className="text-xs text-muted-foreground">{order.products?.duration || "1 Year"}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Purchased</span>
                        <span className="text-foreground">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/20 text-primary inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
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
                    <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)} className="gap-1.5">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleProfileSave} className="gap-1.5">
                        <Check className="w-3.5 h-3.5" /> Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setEditingProfile(false); setProfileForm({ name: profile?.name || "", phone: profile?.phone || "" }); }}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
                    {editingProfile ? (
                      <input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profile?.name || "—"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                    <p className="text-foreground font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" /> {user?.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Phone / WhatsApp</label>
                    {editingProfile ? (
                      <input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+91..."
                      />
                    ) : (
                      <p className="text-foreground font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" /> {profile?.phone || "Not set"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Member Since</label>
                    <p className="text-foreground font-medium">
                      {profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "long", year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">Need Help?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="https://wa.me/919999999999?text=Hi!%20I%20need%20help%20with%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-6 hover:border-primary/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1">WhatsApp Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat with us directly on WhatsApp for instant help. Available 24/7.
                  </p>
                </a>

                <a
                  href="mailto:support@lightningdeals.in"
                  className="glass-card p-6 hover:border-primary/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1">Email Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Send us an email and we'll get back to you within 24 hours.
                  </p>
                </a>

                <Link
                  to="/faq"
                  className="glass-card p-6 hover:border-primary/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <Package className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1">FAQ</h3>
                  <p className="text-sm text-muted-foreground">
                    Find answers to commonly asked questions about orders, delivery, and more.
                  </p>
                </Link>

                <Link
                  to="/help"
                  className="glass-card p-6 hover:border-primary/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <Shield className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1">Help Center</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed guides on how to use your subscriptions and troubleshoot issues.
                  </p>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Dashboard;

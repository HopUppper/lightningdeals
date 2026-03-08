import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  Package, LogOut, User, MessageCircle, Mail, Phone, Edit2,
  Check, X, Key, Clock, Shield, RefreshCw, Download, Heart,
  Star, ArrowRight, ShoppingCart, Trash2, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const statusConfig: Record<string, { color: string; icon: typeof Clock; label: string }> = {
  pending: { color: "bg-accent/20 text-accent", icon: Clock, label: "Pending" },
  processing: { color: "bg-blue-500/20 text-blue-400", icon: Package, label: "Processing" },
  delivered: { color: "bg-emerald-500/20 text-emerald-400", icon: Check, label: "Delivered" },
  cancelled: { color: "bg-destructive/20 text-destructive", icon: X, label: "Cancelled" },
  refunded: { color: "bg-muted text-muted-foreground", icon: RefreshCw, label: "Refunded" },
};

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [timelineOrder, setTimelineOrder] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      const [profileRes, ordersRes, wishlistRes, reviewsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("orders").select("*, products(name, logo_url, duration, delivery, slug, price_discounted, price_original, color)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("wishlist").select("*, products(id, name, slug, logo_url, color, price_original, price_discounted, description)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("reviews").select("*, products(name, slug, logo_url)").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(profileRes.data);
      setOrders(ordersRes.data ?? []);
      setWishlist(wishlistRes.data ?? []);
      setMyReviews(reviewsRes.data ?? []);
      if (profileRes.data) {
        setProfileForm({ name: profileRes.data.name || "", phone: profileRes.data.phone || "" });
      }
    } catch (e) {
      console.error("Failed to fetch dashboard data:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleProfileSave = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ name: profileForm.name, phone: profileForm.phone }).eq("user_id", user.id);
    if (error) { toast.error("Failed to update profile"); return; }
    setProfile((prev: any) => ({ ...prev, ...profileForm }));
    setEditingProfile(false);
    toast.success("Profile updated");
  };

  const openTimeline = async (order: any) => {
    setTimelineOrder(order);
    const { data } = await supabase.from("order_status_history").select("*").eq("order_id", order.id).order("created_at", { ascending: true });
    setTimeline(data ?? []);
  };

  const handleDownloadInvoice = async (order: any) => {
    try {
      const { data, error } = await supabase.storage.from("invoices").download(order.invoice_url);
      if (error || !data) { toast.error("Failed to download invoice"); return; }
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${order.id.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error("Failed to download invoice"); }
  };

  const removeFromWishlist = async (wishlistId: string) => {
    const { error } = await supabase.from("wishlist").delete().eq("id", wishlistId);
    if (error) { toast.error("Failed to remove"); return; }
    setWishlist((prev) => prev.filter((w) => w.id !== wishlistId));
    toast.success("Removed from wishlist");
  };

  const handleReorder = (order: any) => {
    if (order.products?.slug) {
      navigate(`/product/${order.products.slug}`);
    }
  };

  const handleGenerateInvoice = async (order: any) => {
    setGeneratingInvoice(order.id);
    try {
      const { data, error } = await supabase.functions.invoke("generate-invoice", {
        body: { order_id: order.id },
      });
      if (error || !data?.success) {
        toast.error("Failed to generate invoice");
      } else {
        setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, invoice_url: data.invoice_path } : o));
        toast.success("Invoice generated!");
      }
    } catch {
      toast.error("Failed to generate invoice");
    } finally {
      setGeneratingInvoice(null);
    }
  };

  const deleteReview = async (reviewId: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (error) { toast.error("Failed to delete review"); return; }
    setMyReviews((prev) => prev.filter((r) => r.id !== reviewId));
    toast.success("Review deleted");
  };

  const deliveredOrders = orders.filter((o) => o.order_status === "delivered");
  const pendingOrders = orders.filter((o) => o.order_status === "pending" || o.order_status === "processing");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20 px-6 sm:px-10 lg:px-16 max-w-5xl mx-auto">
        <motion.div variants={fadeIn} initial="hidden" animate="show">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="section-eyebrow mb-3">Dashboard</p>
              <h1 className="font-display text-foreground">
                welcome back{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}
              </h1>
            </div>
            <Button
              variant="outline"
              onClick={signOut}
              className="gap-2 rounded-full border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Orders", value: orders.length, icon: Package },
              { label: "Active", value: deliveredOrders.length, icon: Key },
              { label: "Pending", value: pendingOrders.length, icon: Clock },
              { label: "Wishlist", value: wishlist.length, icon: Heart },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-display text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1 font-body">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="orders" className="space-y-8">
            <TabsList className="bg-secondary/50 p-1 rounded-full border border-border">
              <TabsTrigger value="orders" className="gap-2 rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground text-sm font-body">
                <Package className="w-3.5 h-3.5" /> Orders
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="gap-2 rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground text-sm font-body">
                <Heart className="w-3.5 h-3.5" /> Wishlist
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2 rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground text-sm font-body">
                <Star className="w-3.5 h-3.5" /> Reviews
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-2 rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground text-sm font-body">
                <User className="w-3.5 h-3.5" /> Account
              </TabsTrigger>
              <TabsTrigger value="support" className="gap-2 rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground text-sm font-body">
                <MessageCircle className="w-3.5 h-3.5" /> Support
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              {orders.length === 0 ? (
                <div className="glass-card p-16 text-center">
                  <Package className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-6 font-body">No orders yet</p>
                  <Link to="/categories" className="btn-primary !text-sm">Browse Deals</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order, i) => {
                    const config = statusConfig[order.order_status] || statusConfig.pending;
                    const StatusIcon = config.icon;
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="glass-card p-5"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            {order.products?.logo_url ? (
                              <img src={order.products.logo_url} alt="" className="w-10 h-10 rounded-lg object-contain bg-secondary p-1.5" loading="lazy" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                                <Package className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-body font-medium text-foreground text-sm">{order.products?.name ?? "Product"}</p>
                              <p className="text-xs text-muted-foreground font-body">
                                {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-body font-semibold text-foreground">₹{order.payment_amount}</span>
                            <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium capitalize inline-flex items-center gap-1 font-body ${config.color}`}>
                              <StatusIcon className="w-3 h-3" /> {order.order_status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                          <div className="flex gap-4 text-xs text-muted-foreground font-body">
                            {order.products?.duration && <span>{order.products.duration}</span>}
                          </div>
                          <div className="flex items-center gap-3">
                            {order.invoice_url ? (
                              <button onClick={() => handleDownloadInvoice(order)} className="text-xs text-accent hover:text-accent/80 font-medium inline-flex items-center gap-1 font-body">
                                <Download className="w-3 h-3" /> Invoice
                              </button>
                            ) : order.payment_status === "paid" ? (
                              <button
                                onClick={() => handleGenerateInvoice(order)}
                                disabled={generatingInvoice === order.id}
                                className="text-xs text-accent hover:text-accent/80 font-medium inline-flex items-center gap-1 font-body disabled:opacity-50"
                              >
                                <FileText className="w-3 h-3" /> {generatingInvoice === order.id ? "Generating..." : "Get Invoice"}
                              </button>
                            ) : null}
                            <button onClick={() => handleReorder(order)} className="text-xs text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 font-body">
                              <ShoppingCart className="w-3 h-3" /> Reorder
                            </button>
                            <button onClick={() => openTimeline(order)} className="text-xs text-accent hover:text-accent/80 font-medium font-body">
                              Timeline
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              {wishlist.length === 0 ? (
                <div className="glass-card p-16 text-center">
                  <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2 font-body">Your wishlist is empty</p>
                  <p className="text-xs text-muted-foreground mb-6 font-body">Save products you love for later</p>
                  <Link to="/categories" className="btn-primary !text-sm">Explore Deals</Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {wishlist.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="glass-card p-5 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Link to={`/product/${item.products?.slug}`} className="flex items-center gap-3 flex-1 min-w-0">
                          {item.products?.logo_url ? (
                            <img src={item.products.logo_url} alt="" className="w-10 h-10 rounded-lg object-contain bg-secondary p-1.5 shrink-0" loading="lazy" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-body font-medium text-foreground text-sm truncate group-hover:text-accent transition-colors">
                              {item.products?.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-body line-clamp-1">{item.products?.description}</p>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="font-body font-semibold text-foreground text-sm">₹{item.products?.price_discounted}</span>
                              {item.products?.price_original > item.products?.price_discounted && (
                                <span className="text-xs text-muted-foreground line-through font-body">₹{item.products?.price_original}</span>
                              )}
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-destructive transition-colors shrink-0"
                          title="Remove from wishlist"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <Link
                        to={`/product/${item.products?.slug}`}
                        className="mt-3 pt-3 border-t border-border flex items-center gap-1 text-xs text-accent font-medium font-body hover:text-accent/80 transition-colors"
                      >
                        View product <ArrowRight className="w-3 h-3" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              {myReviews.length === 0 ? (
                <div className="glass-card p-16 text-center">
                  <Star className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2 font-body">No reviews yet</p>
                  <p className="text-xs text-muted-foreground mb-6 font-body">Purchase a product and share your experience</p>
                  <Link to="/categories" className="btn-primary !text-sm">Browse Deals</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myReviews.map((review, i) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="glass-card p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Link to={`/product/${review.products?.slug}`} className="flex items-center gap-3 min-w-0 flex-1">
                          {review.products?.logo_url ? (
                            <img src={review.products.logo_url} alt="" className="w-10 h-10 rounded-lg object-contain bg-secondary p-1.5 shrink-0" loading="lazy" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                              <Star className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-body font-medium text-foreground text-sm truncate hover:text-accent transition-colors">
                              {review.products?.name ?? "Product"}
                            </p>
                            <div className="flex gap-0.5 mt-1">
                              {[1,2,3,4,5].map((s) => (
                                <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "fill-accent text-accent" : "text-muted"}`} />
                              ))}
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-destructive transition-colors shrink-0"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed font-body">"{review.comment}"</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2 font-body">
                        {new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account">
              <div className="glass-card p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-body font-semibold text-foreground">Personal Information</h3>
                  {!editingProfile ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProfile(true)}
                      className="gap-1.5 rounded-full border-border text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleProfileSave} className="gap-1.5 rounded-full bg-foreground text-background hover:opacity-90">
                        <Check className="w-3 h-3" /> Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setEditingProfile(false); setProfileForm({ name: profile?.name || "", phone: profile?.phone || "" }); }}
                        className="rounded-full border-border"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block font-body uppercase tracking-wider">Full Name</label>
                    {editingProfile ? (
                      <input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-foreground text-sm font-body focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    ) : (
                      <p className="text-foreground font-body font-medium">{profile?.name || "—"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block font-body uppercase tracking-wider">Email</label>
                    <p className="text-foreground font-body font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" /> {user?.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block font-body uppercase tracking-wider">Phone / WhatsApp</label>
                    {editingProfile ? (
                      <input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-foreground text-sm font-body focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder="+91..."
                      />
                    ) : (
                      <p className="text-foreground font-body font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" /> {profile?.phone || "Not set"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block font-body uppercase tracking-wider">Member Since</label>
                    <p className="text-foreground font-body font-medium">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border flex flex-wrap gap-3">
                  <Link to="/change-password">
                    <Button variant="outline" size="sm" className="gap-2 rounded-full border-border text-muted-foreground hover:text-foreground">
                      <Key className="w-3.5 h-3.5" /> Change Password
                    </Button>
                  </Link>
                  <Link to="/wishlist">
                    <Button variant="outline" size="sm" className="gap-2 rounded-full border-border text-muted-foreground hover:text-foreground">
                      <Heart className="w-3.5 h-3.5" /> View Wishlist
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="https://wa.me/917695956938?text=Hi!%20I%20need%20help%20with%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-8 group"
                >
                  <MessageCircle className="w-5 h-5 text-muted-foreground mb-4 group-hover:text-accent transition-colors" />
                  <h3 className="font-body font-semibold text-foreground mb-2">WhatsApp Support</h3>
                  <p className="text-sm text-muted-foreground font-body">Chat with us for instant support</p>
                </a>
                <a
                  href="mailto:sidhjain9002@gmail.com"
                  className="glass-card p-8 group"
                >
                  <Mail className="w-5 h-5 text-muted-foreground mb-4 group-hover:text-accent transition-colors" />
                  <h3 className="font-body font-semibold text-foreground mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground font-body">sidhjain9002@gmail.com</p>
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Order Timeline Dialog */}
      <Dialog open={!!timelineOrder} onOpenChange={() => setTimelineOrder(null)}>
        <DialogContent className="sm:max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Order Timeline</DialogTitle>
          </DialogHeader>
          {timelineOrder && (
            <div className="space-y-4">
              <div className="text-sm font-body">
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
                        <div className={`absolute left-[-17px] w-3.5 h-3.5 rounded-full border-2 ${i === timeline.length - 1 ? "bg-accent border-accent" : "bg-card border-border"}`} />
                        <div>
                          <span className={`text-[11px] font-semibold capitalize font-body ${cfg.color} px-2 py-0.5 rounded-full`}>{h.status}</span>
                          <p className="text-[11px] text-muted-foreground mt-1 font-body">
                            {new Date(h.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4 font-body">No timeline data available</p>
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

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, MessageCircle, Shield, Lock, Zap, Tag, X, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ProductLogo from "@/components/ProductLogo";

const WHATSAPP_NUMBER = "917695956938";

const generateOrderId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "LD-";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
};

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  // Auto-fill from profile
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("name, email, phone").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) setForm({ name: data.name || "", email: data.email || user.email || "", phone: data.phone || "" });
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const couponDiscount = appliedCoupon
    ? appliedCoupon.discount_type === "percentage"
      ? Math.round(totalPrice * appliedCoupon.discount_value / 100)
      : Math.min(appliedCoupon.discount_value, totalPrice)
    : 0;

  const finalPrice = Math.max(0, totalPrice - couponDiscount);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    const { data, error } = await supabase
      .from("coupons").select("*")
      .eq("code", couponCode.toUpperCase().trim())
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) { toast.error("Invalid coupon code"); setCouponLoading(false); return; }
    if (data.expires_at && new Date(data.expires_at) < new Date()) { toast.error("This coupon has expired"); setCouponLoading(false); return; }
    if (data.max_uses && data.used_count >= data.max_uses) { toast.error("Coupon usage limit reached"); setCouponLoading(false); return; }
    if (data.min_order_amount && totalPrice < data.min_order_amount) { toast.error(`Minimum order of ₹${data.min_order_amount} required`); setCouponLoading(false); return; }

    setAppliedCoupon(data);
    toast.success("Coupon applied!");
    setCouponLoading(false);
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCouponCode(""); };

  const handleWhatsAppOrder = async () => {
    if (!user) { toast.error("Please log in to place an order"); navigate("/login"); return; }
    if (!form.name || !form.email || !form.phone) { toast.error("Please fill in all fields"); return; }

    setLoading(true);
    try {
      const orderId = generateOrderId();
      const productNames = items.map((i) => `${i.name} × ${i.quantity}`).join(", ");

      for (const item of items) {
        for (let q = 0; q < item.quantity; q++) {
          await supabase.from("orders").insert({
            user_id: user.id, product_id: item.id, payment_amount: item.price,
            payment_status: "pending", payment_id: orderId,
            customer_name: form.name, customer_email: form.email, customer_phone: form.phone,
            order_status: "pending",
            coupon_code: appliedCoupon?.code || "", coupon_discount: couponDiscount,
            notes: `WhatsApp Order | ID: ${orderId}`,
          });
        }
      }

      if (appliedCoupon) {
        await supabase.from("coupons").update({ used_count: appliedCoupon.used_count + 1 } as any).eq("id", appliedCoupon.id);
      }

      const message = encodeURIComponent(
        `Hello Lightning Deals! ⚡\n\nI would like to place an order.\n\n📦 *Products:* ${productNames}\n💰 *Total:* ₹${finalPrice}${couponDiscount > 0 ? ` (₹${couponDiscount} off with ${appliedCoupon.code})` : ""}\n🆔 *Order ID:* ${orderId}\n👤 *Name:* ${form.name}\n📧 *Email:* ${form.email}\n📱 *WhatsApp:* ${form.phone}\n\nPlease guide me with the payment process. 🙏`
      );

      clearCart();
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
      navigate("/order-confirmation", { state: { orderId, orderCount: items.reduce((s, i) => s + i.quantity, 0) } });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 section-padding text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5">
            <ShoppingCart className="w-7 h-7 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-3">Nothing to checkout</h1>
          <Link to="/categories" className="text-accent hover:underline text-sm">Browse products →</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Checkout — Lightning Deals" description="Complete your order securely." />
      <Navbar />

      <div className="pt-24 section-padding">
        <div className="container-tight max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/cart" className="hover:text-foreground transition-colors">Cart</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">Checkout</span>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left: Forms */}
              <div className="lg:col-span-3 space-y-6">
                {/* Trust banner */}
                <div className="bg-accent/5 border border-accent/15 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete your order through <strong className="text-foreground">secure WhatsApp checkout</strong> for instant processing.
                  </p>
                </div>

                {/* Contact Details */}
                <div className="glass-card p-6 space-y-4">
                  <h2 className="font-display font-semibold text-foreground text-lg">Your Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/30 transition-all" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/30 transition-all" placeholder="you@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">WhatsApp Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/30 transition-all" placeholder="+91 98765 43210" />
                  </div>
                </div>

                {/* Coupon */}
                <div className="glass-card p-6">
                  <h2 className="font-display font-semibold text-foreground mb-3">Promo Code</h2>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-accent/10 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-accent" />
                        <span className="font-display font-bold text-accent tracking-wider text-sm">{appliedCoupon.code}</span>
                        <span className="text-xs text-muted-foreground">
                          — {appliedCoupon.discount_type === "percentage" ? `${appliedCoupon.discount_value}% off` : `₹${appliedCoupon.discount_value} off`}
                        </span>
                      </div>
                      <button onClick={removeCoupon} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="flex-1 rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-accent/40" placeholder="Enter code" onKeyDown={(e) => e.key === "Enter" && applyCoupon()} />
                      <button onClick={applyCoupon} disabled={couponLoading} className="px-5 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50">
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  )}
                </div>

                {/* How it works */}
                <div className="glass-card p-6">
                  <h2 className="font-display font-semibold text-foreground mb-4 text-lg">How It Works</h2>
                  <div className="space-y-3">
                    {[
                      'Click "Order on WhatsApp" below',
                      "Send the pre-filled message to our team",
                      "We'll guide you with payment instructions",
                      "Subscription delivered in under 5 minutes",
                    ].map((text, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-accent">{i + 1}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-2">
                <div className="glass-card p-6 sticky top-28 space-y-5">
                  <h2 className="font-display font-semibold text-foreground text-lg">Order Summary</h2>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <ProductLogo name={item.name} logoUrl={item.logoUrl} color={item.color} size="w-9 h-9" fontSize="text-xs" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium text-foreground">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">₹{totalPrice}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-accent">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span className="font-medium">−₹{couponDiscount}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-display font-semibold text-foreground text-base">Total</span>
                      <div className="text-right">
                        {couponDiscount > 0 && <span className="text-xs text-muted-foreground line-through mr-2">₹{totalPrice}</span>}
                        <span className="font-display font-bold text-foreground text-xl">₹{finalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Order Button */}
                  <button
                    onClick={handleWhatsAppOrder}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-base text-white disabled:opacity-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, hsl(142, 70%, 45%), hsl(152, 58%, 36%))", boxShadow: "0 0 30px -8px hsl(142 70% 45% / 0.4)" }}
                  >
                    {loading ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                    ) : (
                      <><MessageCircle className="w-5 h-5" /> Order on WhatsApp — ₹{finalPrice}</>
                    )}
                  </button>

                  {/* Trust indicators */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: Lock, label: "Secure" },
                      { icon: Zap, label: "Instant" },
                      { icon: MessageCircle, label: "Support" },
                    ].map((t) => (
                      <div key={t.label} className="flex flex-col items-center gap-1 py-2 rounded-lg bg-secondary/50 text-[10px] text-muted-foreground">
                        <t.icon className="w-3.5 h-3.5" />
                        <span>{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Checkout;

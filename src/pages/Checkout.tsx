import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, MessageCircle, Shield, Lock, Zap, Tag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "919999999999";

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

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

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
      .from("coupons")
      .select("*")
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

      // Create orders in database
      for (const item of items) {
        for (let i = 0; i < item.quantity; i++) {
          await supabase.from("orders").insert({
            user_id: user.id,
            product_id: item.id,
            payment_amount: item.price,
            payment_status: "pending",
            payment_id: orderId,
            customer_name: form.name,
            customer_email: form.email,
            customer_phone: form.phone,
            order_status: "pending",
            coupon_code: appliedCoupon?.code || "",
            coupon_discount: couponDiscount,
            notes: `WhatsApp Order | ID: ${orderId}`,
          });
        }
      }

      // Increment coupon usage
      if (appliedCoupon) {
        await supabase.from("coupons").update({ used_count: appliedCoupon.used_count + 1 } as any).eq("id", appliedCoupon.id);
      }

      // Build WhatsApp message
      const message = encodeURIComponent(
        `Hello Lightning Deals! ⚡\n\n` +
        `I would like to place an order.\n\n` +
        `📦 *Products:* ${productNames}\n` +
        `💰 *Total:* ₹${finalPrice}${couponDiscount > 0 ? ` (₹${couponDiscount} off with ${appliedCoupon.code})` : ""}\n` +
        `🆔 *Order ID:* ${orderId}\n` +
        `👤 *Name:* ${form.name}\n` +
        `📧 *Email:* ${form.email}\n` +
        `📱 *WhatsApp:* ${form.phone}\n\n` +
        `Please guide me with the payment process. 🙏`
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
        <div className="pt-32 text-center">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Nothing to checkout</h1>
          <Link to="/categories" className="text-primary hover:underline">Browse products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 section-padding">
        <div className="container-tight max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/cart" className="text-sm text-primary hover:underline inline-flex items-center gap-1 mb-6">
              <ArrowLeft className="w-3 h-3" /> Back to Cart
            </Link>
            <h1 className="text-3xl font-display font-bold text-foreground mb-8">Secure Checkout</h1>

            {/* Trust banner */}
            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 mb-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Complete your order through our <strong className="text-foreground">secure WhatsApp checkout</strong> for faster processing and personalized support.
              </p>
            </div>

            {/* Contact Details */}
            <div className="glass-card p-6 mb-6 space-y-4">
              <h2 className="font-display font-semibold text-foreground">Your Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">WhatsApp Number *</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+91 98765 43210" />
              </div>
            </div>

            {/* Coupon Code */}
            <div className="glass-card p-6 mb-6">
              <h2 className="font-display font-semibold text-foreground mb-3">Promo Code</h2>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-primary/10 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    <span className="font-display font-bold text-primary tracking-wider">{appliedCoupon.code}</span>
                    <span className="text-sm text-muted-foreground">
                      — {appliedCoupon.discount_type === "percentage" ? `${appliedCoupon.discount_value}% off` : `₹${appliedCoupon.discount_value} off`}
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter code" onKeyDown={(e) => e.key === "Enter" && applyCoupon()} />
                  <button onClick={applyCoupon} disabled={couponLoading} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="glass-card p-6 space-y-3 mb-6">
              <h2 className="font-display font-semibold text-foreground mb-4">Order Summary</h2>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                  <span className="text-foreground font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-primary">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span className="font-medium">−₹{couponDiscount}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-display font-semibold text-foreground">Total</span>
                <div className="text-right">
                  {couponDiscount > 0 && <span className="text-sm text-muted-foreground line-through mr-2">₹{totalPrice}</span>}
                  <span className="font-display font-bold text-foreground text-lg">₹{finalPrice}</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Order Button */}
            <button
              onClick={handleWhatsAppOrder}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-base text-primary-foreground disabled:opacity-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, hsl(142, 70%, 45%), hsl(152, 58%, 36%))", boxShadow: "0 0 30px -8px hsl(142 70% 45% / 0.4)" }}
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
              ) : (
                <><MessageCircle className="w-5 h-5" /> Order on WhatsApp — ₹{finalPrice}</>
              )}
            </button>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: Lock, label: "Secure Order" },
                { icon: Zap, label: "Fast Delivery" },
                { icon: MessageCircle, label: "Direct Support" },
              ].map((t) => (
                <div key={t.label} className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <t.icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </div>
              ))}
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

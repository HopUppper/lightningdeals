import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Loader2, CreditCard, Shield, Tag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
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
    country: "India",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    if (error || !data) {
      toast.error("Invalid coupon code");
      setCouponLoading(false);
      return;
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      toast.error("This coupon has expired");
      setCouponLoading(false);
      return;
    }

    if (data.max_uses && data.used_count >= data.max_uses) {
      toast.error("This coupon has reached its usage limit");
      setCouponLoading(false);
      return;
    }

    if (data.min_order_amount && totalPrice < data.min_order_amount) {
      toast.error(`Minimum order of ₹${data.min_order_amount} required`);
      setCouponLoading(false);
      return;
    }

    setAppliedCoupon(data);
    toast.success("Coupon applied!");
    setCouponLoading(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please log in to continue");
      navigate("/login");
      return;
    }

    if (!form.name || !form.email) {
      toast.error("Please fill in your name and email");
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          amount: finalPrice,
          currency: "INR",
          receipt: `order_${Date.now()}`,
          notes: { customer_email: form.email },
        },
      });

      if (error || !data?.order_id) {
        toast.error(data?.error || "Failed to create order. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Lightning Deals",
        description: `Order of ${items.length} item(s)`,
        order_id: data.order_id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#7c3aed" },
        handler: async (response: any) => {
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_data: {
                    items: items.map((i) => ({ id: i.id, quantity: i.quantity, price: i.price })),
                    customer_name: form.name,
                    customer_email: form.email,
                    customer_phone: form.phone,
                    customer_country: form.country,
                    notes: form.notes,
                    coupon_code: appliedCoupon?.code || "",
                    coupon_discount: couponDiscount,
                  },
                },
              }
            );

            if (verifyError || !verifyData?.success) {
              toast.error("Payment verification failed. Contact support.");
              setLoading(false);
              return;
            }

            // Increment coupon usage
            if (appliedCoupon) {
              await supabase.from("coupons").update({ used_count: appliedCoupon.used_count + 1 } as any).eq("id", appliedCoupon.id);
            }

            clearCart();
            navigate("/order-confirmation", {
              state: {
                paymentId: response.razorpay_payment_id,
                orderCount: items.reduce((s, i) => s + i.quantity, 0),
              },
            });
          } catch {
            toast.error("Something went wrong verifying payment.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        toast.error(response.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
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
            <h1 className="text-3xl font-display font-bold text-foreground mb-8">Checkout</h1>

            {/* Contact Details */}
            <div className="glass-card p-6 mb-6 space-y-4">
              <h2 className="font-display font-semibold text-foreground">Contact Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="you@email.com" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">WhatsApp Number</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+91..." />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Country</label>
                  <select name="country" value={form.country} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>India</option>
                    <option>USA</option>
                    <option>UK</option>
                    <option>Canada</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Notes / Special Requests</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Any specific requirements..." />
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
                  <button onClick={removeCoupon} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter code"
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
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

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="btn-primary-gradient w-full inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <><CreditCard className="w-4 h-4" /> Pay ₹{finalPrice}</>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>Secured by Razorpay · UPI, Cards, Net Banking, Wallets</span>
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

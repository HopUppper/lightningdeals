import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight, Minus, Plus, Shield, Zap, MessageCircle, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import ProductLogo from "@/components/ProductLogo";

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const totalSavings = items.reduce((s, i) => s + (i.original - i.price) * i.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Your Cart — Lightning Deals" description="Review your cart and proceed to checkout." />
      <Navbar />

      <div className="pt-28 section-padding">
        <div className="container-tight max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-semibold text-foreground">Shopping Cart</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {items.length === 0 ? "Your cart is empty" : `${items.reduce((s, i) => s + i.quantity, 0)} item${items.length > 1 ? "s" : ""} in your cart`}
                </p>
              </div>
              {items.length > 0 && (
                <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-destructive transition-colors">
                  Clear all
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-9 h-9 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-display font-semibold text-foreground mb-3">Nothing here yet</h2>
                <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                  Browse our premium subscriptions and find incredible deals on your favorite tools.
                </p>
                <Link to="/categories" className="btn-gold">
                  Browse Plans <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-3">
                  {items.map((item, idx) => {
                    const saving = (item.original - item.price) * item.quantity;
                    const discountPct = item.original > 0 ? Math.round(((item.original - item.price) / item.original) * 100) : 0;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card p-5 flex items-center gap-4 sm:gap-5 group"
                      >
                        <ProductLogo name={item.name} logoUrl={item.logoUrl} color={item.color} />

                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate text-sm sm:text-base">{item.name}</h3>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-foreground font-semibold text-sm">₹{item.price}</span>
                            <span className="text-muted-foreground line-through text-xs">₹{item.original}</span>
                            {discountPct > 0 && (
                              <span className="text-[10px] font-medium text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                                {discountPct}% off
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-1.5">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-7 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Subtotal */}
                        <span className="text-foreground font-display font-semibold w-16 text-right text-sm hidden sm:block">
                          ₹{item.price * item.quantity}
                        </span>

                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeItem(item.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 sticky top-28 space-y-5">
                    <h3 className="font-display font-semibold text-foreground">Order Summary</h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">₹{totalPrice + totalSavings}</span>
                      </div>
                      {totalSavings > 0 && (
                        <div className="flex justify-between text-accent">
                          <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Savings</span>
                          <span className="font-medium">−₹{totalSavings}</span>
                        </div>
                      )}
                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="font-display font-semibold text-foreground">Total</span>
                        <span className="font-display font-bold text-foreground text-xl">₹{totalPrice}</span>
                      </div>
                    </div>

                    <Button onClick={() => navigate("/checkout")} className="btn-gold w-full !rounded-xl">
                      Checkout <ArrowRight className="w-4 h-4" />
                    </Button>

                    {/* Trust badges */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {[
                        { icon: Shield, label: "Secure" },
                        { icon: Zap, label: "Instant" },
                        { icon: MessageCircle, label: "Support" },
                      ].map((t) => (
                        <div key={t.label} className="flex flex-col items-center gap-1 py-2 rounded-lg bg-secondary/50 text-[10px] text-muted-foreground">
                          <t.icon className="w-3.5 h-3.5" />
                          <span>{t.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Cart;

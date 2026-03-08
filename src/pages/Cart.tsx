import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import ProductLogo from "@/components/ProductLogo";

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 section-padding">
        <div className="container-tight max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="section-title !mt-0 mb-10">Shopping Cart</h1>

            {items.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <ShoppingCart className="w-14 h-14 text-muted-foreground mx-auto mb-5" />
                <h2 className="text-xl font-display font-semibold text-foreground mb-3">Your cart is empty</h2>
                <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">Browse our premium subscriptions and add items to your cart.</p>
                <Link to="/categories" className="btn-primary-gradient inline-flex items-center gap-2">
                  Browse Plans <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="glass-card p-5 flex items-center gap-5">
                    <ProductLogo name={item.name} logoUrl={item.logoUrl} color={item.color} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground truncate">{item.name}</h3>
                      <div className="flex items-baseline gap-2 text-sm mt-1">
                        <span className="text-foreground font-semibold">₹{item.price}</span>
                        <span className="text-muted-foreground line-through text-xs">₹{item.original}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <span className="text-foreground font-display font-semibold w-20 text-right">₹{item.price * item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <div className="glass-card p-8 mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-muted-foreground text-base">Subtotal</span>
                    <span className="text-foreground font-display font-bold text-2xl">₹{totalPrice}</span>
                  </div>
                  <Button onClick={() => navigate("/checkout")} className="btn-primary-gradient w-full flex items-center justify-center gap-2 py-3.5">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Button>
                  <button onClick={clearCart} className="w-full text-center text-sm text-muted-foreground hover:text-destructive mt-4 transition-colors">
                    Clear Cart
                  </button>
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

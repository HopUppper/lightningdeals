import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const Checkout = () => {
  const { items, totalPrice } = useCart();

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

            <div className="glass-card p-6 space-y-3 mb-6">
              <h2 className="font-display font-semibold text-foreground mb-4">Order Summary</h2>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                  <span className="text-foreground font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-display font-semibold text-foreground">Total</span>
                <span className="font-display font-bold text-foreground text-lg">₹{totalPrice}</span>
              </div>
            </div>

            <div className="glass-card p-6 text-center">
              <p className="text-muted-foreground text-sm mb-4">Payment integration coming soon. Contact us via WhatsApp to complete your order.</p>
              <a
                href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi! I'd like to order: ${items.map(i => `${i.name} x${i.quantity}`).join(', ')}. Total: ₹${totalPrice}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-gradient inline-flex items-center gap-2"
              >
                Complete via WhatsApp
              </a>
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

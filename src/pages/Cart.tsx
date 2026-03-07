import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";

const Cart = () => {
  // Static demo cart — will be replaced with state/context later
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 section-padding">
        <div className="container-tight max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold text-foreground mb-8">Shopping Cart</h1>
            <div className="glass-card p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-display font-semibold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-sm text-muted-foreground mb-6">Browse our premium subscriptions and add items to your cart.</p>
              <Link to="/categories" className="btn-primary-gradient inline-flex items-center gap-2">
                Browse Plans
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Cart;

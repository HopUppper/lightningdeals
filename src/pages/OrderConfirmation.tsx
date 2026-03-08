import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, MessageCircle, Clock, Shield } from "lucide-react";

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, orderCount } = location.state || {};

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Order Confirmed — Lightning Deals" description="Your order has been placed successfully." />
      <Navbar />

      <div className="pt-24 section-padding">
        <div className="container-tight max-w-lg">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            {/* Success Card */}
            <div className="glass-card p-10 text-center relative overflow-hidden">
              {/* Subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative z-10"
              >
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-accent" />
                </div>
              </motion.div>

              <div className="relative z-10">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">Order Placed!</h1>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Your order has been sent via WhatsApp. Our team will guide you through payment.
                </p>
              </div>
            </div>

            {/* Order Details */}
            {orderId && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order ID</p>
                    <p className="font-mono text-foreground font-bold text-lg">{orderId}</p>
                  </div>
                  {orderCount && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Items</p>
                      <p className="text-foreground font-bold text-lg">{orderCount}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* What's next */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 space-y-4">
              <h3 className="font-display font-semibold text-foreground">What Happens Next</h3>
              {[
                { icon: MessageCircle, text: "Our team reviews your order on WhatsApp" },
                { icon: Shield, text: "Payment link is shared securely" },
                { icon: Clock, text: "Credentials delivered within 5 minutes of payment" },
                { icon: Package, text: "Subscription activated and ready to use" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <step.icon className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground">{step.text}</p>
                </div>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-3">
              <Link to="/dashboard" className="btn-gold flex-1 text-center justify-center">
                View Orders <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/categories" className="btn-secondary flex-1 text-center justify-center">
                Continue Shopping
              </Link>
            </motion.div>

            {/* Help link */}
            <a
              href="https://wa.me/917695956938"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
            >
              <MessageCircle className="w-4 h-4" /> Need help? Chat with us
            </a>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;

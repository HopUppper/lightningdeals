import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

const OrderConfirmation = () => {
  const location = useLocation();
  const { paymentId, orderCount } = location.state || {};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 section-padding">
        <div className="container-tight max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            </motion.div>

            <div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Payment Successful!
              </h1>
              <p className="text-muted-foreground">
                Your order has been placed successfully.
              </p>
            </div>

            {paymentId && (
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-1">
                <p className="text-muted-foreground">
                  Payment ID: <span className="font-mono text-foreground">{paymentId}</span>
                </p>
                {orderCount && (
                  <p className="text-muted-foreground">
                    Items ordered: <span className="font-semibold text-foreground">{orderCount}</span>
                  </p>
                )}
              </div>
            )}

            <div className="bg-muted/30 rounded-lg p-4 flex items-start gap-3 text-left">
              <Package className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Your product keys / credentials will be delivered to your WhatsApp & email within 5 minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/dashboard"
                className="btn-primary-gradient inline-flex items-center justify-center gap-2 flex-1"
              >
                View Orders <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/categories"
                className="px-6 py-3 rounded-xl border border-border text-foreground hover:bg-muted/50 transition-colors text-center flex-1"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />

      <div className="container-tight section-padding relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground/80">Save up to 70% on premium subscriptions</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6"
          >
            <span className="text-primary-foreground">Get Premium Subscriptions at </span>
            <span className="gradient-text">Massive Discounts</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-primary-foreground/60 mb-10 max-w-xl leading-relaxed"
          >
            Access Canva Pro, Adobe, LinkedIn Premium, TradingView & more at unbeatable prices. Instant delivery, guaranteed authentic accounts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/categories" className="btn-primary-gradient inline-flex items-center gap-2 text-base">
              Browse Subscriptions
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-primary-foreground/20 text-primary-foreground/80 font-semibold hover:bg-primary-foreground/5 transition-all text-base"
            >
              View Categories
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-8 mt-16"
          >
            {[
              { value: "10K+", label: "Happy Customers" },
              { value: "50+", label: "Premium Tools" },
              { value: "< 5min", label: "Avg. Delivery" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-display font-bold text-primary-foreground">{s.value}</div>
                <div className="text-sm text-primary-foreground/50">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

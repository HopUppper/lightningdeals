import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", damping: 20, stiffness: 100 } },
};

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
    {/* Animated decorative blobs */}
    <motion.div
      className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]"
      animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-[120px]"
      animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />

    <div className="container-tight section-padding relative z-10">
      <motion.div className="max-w-3xl" variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-8">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-primary-foreground/80">Save up to 70% on premium subscriptions</span>
        </motion.div>

        <motion.h1 variants={item} className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
          <span className="text-primary-foreground">Get Premium Subscriptions at </span>
          <span className="gradient-text">Massive Discounts</span>
        </motion.h1>

        <motion.p variants={item} className="text-lg sm:text-xl text-primary-foreground/60 mb-10 max-w-xl leading-relaxed">
          Access Canva Pro, Adobe, LinkedIn Premium, TradingView & more at unbeatable prices. Instant delivery, guaranteed authentic accounts.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap gap-4">
          <Link to="/categories" className="btn-primary-gradient inline-flex items-center gap-2 text-base group">
            Browse Subscriptions
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-primary-foreground/20 text-primary-foreground/80 font-semibold hover:bg-primary-foreground/5 hover:border-primary-foreground/30 transition-all duration-300 text-base"
          >
            View Categories
          </Link>
        </motion.div>

        {/* Stats with counter-like stagger */}
        <motion.div variants={item} className="flex flex-wrap gap-8 mt-16">
          {[
            { value: "10K+", label: "Happy Customers" },
            { value: "100+", label: "Premium Tools" },
            { value: "< 5min", label: "Avg. Delivery" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, type: "spring", damping: 18 }}
            >
              <div className="text-2xl font-display font-bold text-primary-foreground">{s.value}</div>
              <div className="text-sm text-primary-foreground/50">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;

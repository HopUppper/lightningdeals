import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, Clock } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 120 } },
};

const HeroSection = () => (
  <section className="relative min-h-[94vh] flex items-center overflow-hidden noise-overlay" style={{ background: "var(--gradient-hero)" }}>
    {/* Static gradient orbs instead of animated ones - GPU friendly */}
    <div className="absolute top-10 right-[10%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] animate-float-slow" />
    <div className="absolute -bottom-20 left-[5%] w-[600px] h-[400px] bg-accent/8 rounded-full blur-[140px] animate-float" />

    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
      backgroundSize: '60px 60px'
    }} />

    <div className="container-tight section-padding relative z-10">
      <motion.div className="max-w-3xl" variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-10 border border-white/10 animate-pulse-glow">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-sm font-medium text-primary-foreground/70">🔥 Mega Sale Live — Up to 70% OFF</span>
        </motion.div>

        <motion.h1 variants={item} className="!text-4xl sm:!text-5xl lg:!text-7xl font-display font-bold !leading-[1.08] mb-7 tracking-tight">
          <span className="text-primary-foreground">Premium Tools.</span>
          <br />
          <span className="gradient-text">Unbeatable Prices.</span>
        </motion.h1>

        <motion.p variants={item} className="text-lg sm:text-xl text-primary-foreground/50 mb-12 max-w-xl leading-relaxed">
          Access Canva Pro, Adobe, LinkedIn Premium, TradingView & 100+ more at massive discounts. Delivered instantly via WhatsApp.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap gap-4">
          <Link to="/categories" className="btn-primary-gradient inline-flex items-center gap-2.5 text-base group">
            Browse Subscriptions
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link to="/about" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-primary-foreground/70 font-semibold hover:bg-white/5 hover:border-white/20 transition-all duration-200 text-base">
            How it Works
          </Link>
        </motion.div>

        <motion.div variants={item} className="flex flex-wrap items-center gap-8 mt-16">
          {[
            { icon: Shield, label: "Secure Payments" },
            { icon: Zap, label: "Instant Delivery" },
            { icon: Clock, label: "24/7 Support" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2.5 text-primary-foreground/40">
              <badge.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div variants={item} className="flex flex-wrap gap-12 mt-14 pt-10 border-t border-white/8">
          {[
            { value: "10K+", label: "Happy Customers" },
            { value: "100+", label: "Premium Tools" },
            { value: "< 5min", label: "Avg. Delivery" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground tracking-tight">{s.value}</div>
              <div className="text-sm text-primary-foreground/40 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;

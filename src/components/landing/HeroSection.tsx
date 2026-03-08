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
    <div className="absolute top-10 right-[10%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] animate-float-slow" />
    <div className="absolute -bottom-20 left-[5%] w-[600px] h-[400px] bg-accent/8 rounded-full blur-[140px] animate-float" />

    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
      backgroundSize: '60px 60px'
    }} />

    <div className="container-tight section-padding relative z-10">
      <motion.div className="max-w-3xl" variants={container} initial="hidden" animate="show">
        {/* Brand name */}
        <motion.div variants={item} className="flex items-center gap-2.5 mb-6">
          <Zap className="w-6 h-6 text-accent fill-accent" />
          <span className="text-xl sm:text-2xl font-display font-bold text-primary-foreground tracking-tight">Lightning Deals</span>
        </motion.div>

        {/* Sale badge */}
        <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-8 border border-white/10 animate-pulse-glow">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-sm font-medium text-primary-foreground/70">✨ Mega Sale Live — Up to 90% OFF Premium Tools</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={item} className="!text-4xl sm:!text-5xl lg:!text-7xl font-display font-bold !leading-[1.08] mb-6 tracking-tight">
          <span className="text-primary-foreground">Premium Tools.</span>
          <br />
          <span className="gradient-text">Unbeatable Prices.</span>
        </motion.h1>

        {/* Value proposition */}
        <motion.p variants={item} className="text-lg sm:text-xl text-primary-foreground/50 mb-12 max-w-xl leading-relaxed">
          Lightning Deals brings you premium software subscriptions at massive discounts. Access Canva, Adobe, Notion, ChatGPT & 100+ more — delivered instantly via WhatsApp.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-wrap gap-4">
          <Link to="/categories" className="btn-primary-gradient inline-flex items-center gap-2.5 text-base group">
            Browse Deals
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link to="/categories" className="btn-gold inline-flex items-center gap-2.5 text-base group">
            Start Saving Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div variants={item} className="flex flex-wrap items-center gap-8 mt-16">
          {[
            { icon: Shield, label: "Secure Orders" },
            { icon: Zap, label: "Instant Delivery" },
            { icon: Clock, label: "24/7 Support" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2.5 text-primary-foreground/40">
              <badge.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Stats */}
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

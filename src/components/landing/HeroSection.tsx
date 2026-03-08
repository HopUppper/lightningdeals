import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, Clock } from "lucide-react";
import { useMemo } from "react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 120 } },
};

// Tool logos with brand colors
const floatingTools = [
  { name: "Canva", color: "#00C4CC", icon: "C", x: "8%", y: "18%" },
  { name: "Notion", color: "#000000", icon: "N", x: "5%", y: "55%" },
  { name: "ChatGPT", color: "#10A37F", icon: "G", x: "12%", y: "78%" },
  { name: "Figma", color: "#A259FF", icon: "F", x: "88%", y: "15%" },
  { name: "Adobe", color: "#FF0000", icon: "A", x: "92%", y: "50%" },
  { name: "Perplexity", color: "#1FB8CD", icon: "P", x: "85%", y: "80%" },
  { name: "Linear", color: "#5E6AD2", icon: "L", x: "3%", y: "38%" },
  { name: "Slack", color: "#4A154B", icon: "S", x: "95%", y: "35%" },
];

const FloatingLogo = ({ tool, index }: { tool: typeof floatingTools[0]; index: number }) => {
  const duration = 6 + (index % 3) * 2;
  const delay = index * 0.3;
  const yOffset = index % 2 === 0 ? -14 : 14;

  return (
    <motion.div
      className="absolute hidden lg:flex items-center justify-center w-12 h-12 rounded-2xl font-display font-bold text-white/90 text-sm select-none pointer-events-none"
      style={{
        left: tool.x,
        top: tool.y,
        backgroundColor: tool.color,
        opacity: 0,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: [0, 0.18, 0.22, 0.18, 0],
        scale: [0.8, 1, 1.05, 1, 0.8],
        y: [0, yOffset, 0, -yOffset, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    >
      {tool.icon}
    </motion.div>
  );
};

const LightningStreak = ({ side }: { side: "left" | "right" }) => (
  <motion.div
    className="absolute hidden lg:block pointer-events-none"
    style={{
      [side]: side === "left" ? "15%" : "15%",
      top: "20%",
      width: "2px",
      height: "200px",
      background: `linear-gradient(180deg, transparent 0%, hsl(152, 58%, 42%) 30%, hsl(43, 90%, 55%) 70%, transparent 100%)`,
      filter: "blur(1px)",
      opacity: 0,
      transform: `rotate(${side === "left" ? "-15deg" : "15deg"})`,
    }}
    animate={{
      opacity: [0, 0, 0.4, 0.6, 0.3, 0],
      scaleY: [0.3, 0.3, 1, 1.1, 0.8, 0.3],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      repeatDelay: side === "left" ? 5 : 7,
      ease: "easeInOut",
    }}
  />
);

const HeroSection = () => {
  const tools = useMemo(() => floatingTools, []);

  return (
    <section
      className="relative min-h-[94vh] flex items-center overflow-hidden noise-overlay"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-10 right-[10%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px]"
        animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 left-[5%] w-[600px] h-[400px] bg-accent/10 rounded-full blur-[140px]"
        animate={{ y: [0, 15, 0], x: [0, -10, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full blur-[120px]"
        style={{ background: "hsl(152, 50%, 30%)", opacity: 0.06 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating tool logos */}
      {tools.map((tool, i) => (
        <FloatingLogo key={tool.name} tool={tool} index={i} />
      ))}

      {/* Lightning streaks */}
      <LightningStreak side="left" />
      <LightningStreak side="right" />

      {/* Side accent lines - left */}
      <div className="absolute left-0 top-0 bottom-0 w-px hidden lg:block">
        <motion.div
          className="absolute left-8 top-[20%] w-px h-32"
          style={{ background: "linear-gradient(180deg, transparent, hsl(152, 58%, 36% / 0.2), transparent)" }}
          animate={{ opacity: [0.2, 0.5, 0.2], scaleY: [0.8, 1.2, 0.8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-16 top-[50%] w-px h-24"
          style={{ background: "linear-gradient(180deg, transparent, hsl(43, 90%, 55% / 0.15), transparent)" }}
          animate={{ opacity: [0.15, 0.4, 0.15], scaleY: [0.9, 1.1, 0.9] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Side accent lines - right */}
      <div className="absolute right-0 top-0 bottom-0 w-px hidden lg:block">
        <motion.div
          className="absolute right-8 top-[30%] w-px h-28"
          style={{ background: "linear-gradient(180deg, transparent, hsl(152, 58%, 36% / 0.2), transparent)" }}
          animate={{ opacity: [0.2, 0.45, 0.2], scaleY: [0.85, 1.15, 0.85] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute right-16 top-[60%] w-px h-20"
          style={{ background: "linear-gradient(180deg, transparent, hsl(43, 90%, 55% / 0.12), transparent)" }}
          animate={{ opacity: [0.1, 0.35, 0.1], scaleY: [0.9, 1.2, 0.9] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      {/* Main content - centered */}
      <div className="container-tight section-padding relative z-10">
        <motion.div className="max-w-3xl mx-auto text-center" variants={container} initial="hidden" animate="show">
          {/* Brand name */}
          <motion.div variants={item} className="flex items-center justify-center gap-2.5 mb-6">
            <Zap className="w-6 h-6 text-accent fill-accent" />
            <span className="text-xl sm:text-2xl font-display font-bold text-primary-foreground tracking-tight">
              Lightning Deals
            </span>
          </motion.div>

          {/* Sale badge */}
          <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-8 border border-white/10 animate-pulse-glow">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-sm font-medium text-primary-foreground/70">
              ✨ Mega Sale Live — Up to 90% OFF Premium Tools
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={item} className="!text-4xl sm:!text-5xl lg:!text-7xl font-display font-bold !leading-[1.08] mb-6 tracking-tight">
            <span className="text-primary-foreground">Premium Tools.</span>
            <br />
            <span className="gradient-text">Unbeatable Prices.</span>
          </motion.h1>

          {/* Description */}
          <motion.p variants={item} className="text-lg sm:text-xl text-primary-foreground/50 mb-12 max-w-xl mx-auto leading-relaxed">
            Lightning Deals brings you premium software subscriptions at massive discounts. Access Canva, Adobe, Notion, ChatGPT & 100+ more — delivered instantly via WhatsApp.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap justify-center gap-4">
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
          <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-8 mt-16">
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
          <motion.div variants={item} className="flex flex-wrap justify-center gap-12 mt-14 pt-10 border-t border-white/8">
            {[
              { value: "10K+", label: "Happy Customers" },
              { value: "100+", label: "Premium Tools" },
              { value: "< 5min", label: "Avg. Delivery" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground tracking-tight">
                  {s.value}
                </div>
                <div className="text-sm text-primary-foreground/40 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

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

const leftTools = [
  { name: "Canva", domain: "canva.com", x: 40, y: 80 },
  { name: "Notion", domain: "notion.so", x: 15, y: 220 },
  { name: "ChatGPT", domain: "openai.com", x: 55, y: 360 },
  { name: "Linear", domain: "linear.app", x: 10, y: 500 },
];
const rightTools = [
  { name: "Figma", domain: "figma.com", x: 25, y: 100 },
  { name: "Adobe", domain: "adobe.com", x: 50, y: 250 },
  { name: "Perplexity", domain: "perplexity.ai", x: 10, y: 400 },
  { name: "Slack", domain: "slack.com", x: 45, y: 520 },
];

const FloatingLogo = ({ tool, index }: { tool: typeof leftTools[0]; index: number }) => {
  const dur = 7 + (index % 3) * 2;
  const yOff = index % 2 === 0 ? -16 : 16;
  return (
    <motion.div
      className="absolute w-10 h-10 rounded-xl overflow-hidden select-none pointer-events-none bg-white/10 backdrop-blur-sm p-1.5 border border-white/10"
      style={{ left: tool.x, top: tool.y }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 0.35, 0.45, 0.35, 0],
        scale: [0.8, 1, 1.05, 1, 0.8],
        y: [0, yOff, 0, -yOff, 0],
      }}
      transition={{ duration: dur, repeat: Infinity, delay: index * 0.6, ease: "easeInOut" }}
    >
      <img
        src={`https://logo.clearbit.com/${tool.domain}`}
        alt={tool.name}
        className="w-full h-full object-contain rounded-md"
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    </motion.div>
  );
};

/* Lightning bolt SVG that strikes from top to bottom */
const LightningBolt = ({ side, delay }: { side: "left" | "right"; delay: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{
      [side]: side === "left" ? 80 : 70,
      top: "5%",
      width: 40,
      height: 500,
      opacity: 0,
    }}
    animate={{
      opacity: [0, 0, 0.6, 0.8, 0.4, 0],
    }}
    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: delay, ease: "easeOut" }}
  >
    <svg viewBox="0 0 40 500" fill="none" className="w-full h-full">
      <motion.path
        d="M20 0 L14 120 L26 140 L12 280 L28 310 L8 500"
        stroke="url(#lightning-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: [0, 0, 1, 1, 1],
          opacity: [0, 0, 0.8, 0.6, 0],
        }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: delay, ease: "easeOut" }}
      />
      {/* Glow path */}
      <motion.path
        d="M20 0 L14 120 L26 140 L12 280 L28 310 L8 500"
        stroke="url(#lightning-grad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: [0, 0, 1, 1, 1],
          opacity: [0, 0, 0.3, 0.2, 0],
        }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: delay, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="lightning-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(152,58%,50%)" stopOpacity="0.9" />
          <stop offset="40%" stopColor="hsl(152,58%,42%)" stopOpacity="1" />
          <stop offset="70%" stopColor="hsl(43,90%,55%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(43,90%,55%)" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  </motion.div>
);

const HeroSection = () => {
  const left = useMemo(() => leftTools, []);
  const right = useMemo(() => rightTools, []);

  return (
    <section className="relative min-h-[94vh] flex items-center overflow-hidden noise-overlay" style={{ background: "var(--gradient-hero)" }}>
      {/* Gradient orbs */}
      <motion.div className="absolute top-10 right-[10%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px]"
        animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="absolute -bottom-20 left-[5%] w-[600px] h-[400px] bg-accent/10 rounded-full blur-[140px]"
        animate={{ y: [0, 15, 0], x: [0, -10, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* 3-column layout */}
      <div className="w-full max-w-[1560px] mx-auto px-5 sm:px-8 lg:px-10 py-20 sm:py-24 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(120px,1fr)_minmax(0,720px)_minmax(120px,1fr)] items-center gap-0">

          {/* Left — logos + lightning */}
          <div className="hidden lg:block relative h-[600px]">
            {left.map((t, i) => <FloatingLogo key={t.name} tool={t} index={i} />)}
            <LightningBolt side="left" delay={6} />
          </div>

          {/* Center */}
          <motion.div className="text-center" variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="flex items-center justify-center gap-2.5 mb-6">
              <Zap className="w-6 h-6 text-accent fill-accent" />
              <span className="text-xl sm:text-2xl font-display font-bold text-primary-foreground tracking-tight">Lightning Deals</span>
            </motion.div>

            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-8 border border-white/10 animate-pulse-glow">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-sm font-medium text-primary-foreground/70">✨ Mega Sale Live — Up to 90% OFF Premium Tools</span>
            </motion.div>

            <motion.h1 variants={item} className="!text-4xl sm:!text-5xl lg:!text-7xl font-display font-bold !leading-[1.08] mb-6 tracking-tight">
              <span className="text-primary-foreground">Premium Tools.</span>
              <br />
              <span className="gradient-text">Unbeatable Prices.</span>
            </motion.h1>

            <motion.p variants={item} className="text-lg sm:text-xl text-primary-foreground/50 mb-10 max-w-xl mx-auto leading-relaxed">
              Lightning Deals brings you premium software subscriptions at massive discounts. Access Canva, Adobe, Notion, ChatGPT & 100+ more — delivered instantly via WhatsApp.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap justify-center gap-4">
              <Link to="/categories" className="btn-primary-gradient inline-flex items-center gap-2.5 text-base group">
                Browse Deals <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link to="/categories" className="btn-gold inline-flex items-center gap-2.5 text-base group">
                Start Saving Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-10">
              {[
                { icon: Zap, label: "100+ Premium Tools" },
                { icon: Shield, label: "Instant WhatsApp Delivery" },
                { icon: Clock, label: "Up to 90% OFF" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-primary-foreground/40">
                  <b.icon className="w-3.5 h-3.5" />
                  <span className="text-xs sm:text-sm font-medium">{b.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap justify-center gap-12 mt-12 pt-10 border-t border-white/8">
              {[
                { value: "10K+", label: "Happy Customers" },
                { value: "100+", label: "Premium Tools" },
                { value: "< 5min", label: "Avg. Delivery" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground tracking-tight">{s.value}</div>
                  <div className="text-sm text-primary-foreground/40 mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — logos + lightning */}
          <div className="hidden lg:block relative h-[600px]">
            {right.map((t, i) => <FloatingLogo key={t.name} tool={t} index={i + 4} />)}
            <LightningBolt side="right" delay={9} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

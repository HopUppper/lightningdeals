import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AnimatedCounter, credEase, staggerContainer, fadeUpVariants } from "@/components/animations/CredAnimations";

const container = staggerContainer(0.12);
const item = fadeUpVariants;

const HeroSection = () => (
  <section
    className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay"
    style={{ background: "var(--gradient-hero)" }}
  >
    {/* Subtle radial glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
      style={{ background: "radial-gradient(circle, hsl(38 80% 55% / 0.06) 0%, transparent 70%)" }}
    />

    <motion.div
      className="container-tight text-center relative z-10 px-6"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.p variants={item} custom={0} className="section-eyebrow mb-8">
        Premium Software Marketplace
      </motion.p>

      <motion.h1 variants={item} custom={0.05} className="text-balance max-w-4xl mx-auto">
        <span className="text-foreground">premium tools,</span>
        <br />
        <span className="gradient-text italic">unbeatable prices</span>
      </motion.h1>

      <motion.p variants={item} custom={0.1} className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mt-8 leading-relaxed font-body">
        Access Canva, Adobe, ChatGPT, Notion and 100+ premium subscriptions
        at up to 90% off. Delivered instantly via WhatsApp.
      </motion.p>

      <motion.div variants={item} custom={0.15} className="flex flex-wrap justify-center gap-4 mt-12">
        <Link to="/categories" className="btn-primary group">
          Explore Deals
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
        <Link to="/about" className="btn-secondary">
          How It Works
        </Link>
      </motion.div>

      <motion.div variants={item} custom={0.2} className="flex justify-center gap-16 mt-20">
        {[
          { value: 10000, suffix: "+", label: "Customers" },
          { value: 100, suffix: "+", label: "Premium Tools" },
          { raw: "< 5min", label: "Delivery" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl sm:text-3xl font-display text-foreground">
              {"value" in stat ? (
                <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2.5} />
              ) : (
                stat.raw
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-body uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>

    {/* Bottom fade */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
  </section>
);

export default HeroSection;

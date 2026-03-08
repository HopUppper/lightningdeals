import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Headphones, Lock } from "lucide-react";
import { credEase, staggerContainer } from "@/components/animations/CredAnimations";

const items = [
  { icon: Shield, label: "Verified & Authentic", desc: "Every subscription is genuine and verified" },
  { icon: Zap, label: "Instant Delivery", desc: "Most orders delivered in under 5 minutes" },
  { icon: Lock, label: "Secure Payments", desc: "Your transactions are fully protected" },
  { icon: Headphones, label: "24/7 Support", desc: "Always here when you need us" },
];

const container = staggerContainer(0.1);

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: credEase, delay: i * 0.08 },
  }),
};

const TrustSection = memo(() => (
  <section className="section-padding relative overflow-hidden border-t border-border">
    <div className="container-tight relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: credEase }}
        className="text-center mb-16"
      >
        <span className="section-eyebrow">Trust</span>
        <h2 className="section-title">why choose us</h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            variants={cardVariants}
            custom={i}
            className="glass-card p-8 text-center group"
          >
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mx-auto mb-5 group-hover:border-accent/30 group-hover:scale-110 transition-all duration-500">
              <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors duration-500" />
            </div>
            <h3 className="text-sm font-body font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">{item.label}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-body">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
));

TrustSection.displayName = "TrustSection";
export default TrustSection;

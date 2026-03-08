import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Headphones, Lock } from "lucide-react";

const items = [
  { icon: Shield, label: "Verified & Authentic", desc: "Every subscription is genuine and verified" },
  { icon: Zap, label: "Instant Delivery", desc: "Most orders delivered in under 5 minutes" },
  { icon: Lock, label: "Secure Payments", desc: "Your transactions are fully protected" },
  { icon: Headphones, label: "24/7 Support", desc: "Always here when you need us" },
];

const TrustSection = memo(() => (
  <section className="section-padding relative overflow-hidden border-t border-border">
    <div className="container-tight relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-16"
      >
        <span className="section-eyebrow">Trust</span>
        <h2 className="section-title">why choose us</h2>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-8 text-center group"
          >
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mx-auto mb-5 group-hover:border-accent/30 transition-colors duration-500">
              <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors duration-500" />
            </div>
            <h3 className="text-sm font-body font-semibold text-foreground mb-2">{item.label}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-body">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
));

TrustSection.displayName = "TrustSection";
export default TrustSection;

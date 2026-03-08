import { memo } from "react";
import { motion } from "framer-motion";

const steps = [
  { step: "01", title: "Browse & Choose", desc: "Explore 100+ premium subscriptions at unbeatable prices." },
  { step: "02", title: "Order via WhatsApp", desc: "Place your order with personalized support and instant confirmation." },
  { step: "03", title: "Instant Delivery", desc: "Receive your subscription credentials within minutes." },
];

const HowItWorks = memo(() => (
  <section className="section-padding relative overflow-hidden border-t border-border">
    <div className="container-tight relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-20"
      >
        <span className="section-eyebrow">Process</span>
        <h2 className="section-title">how it works</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card p-10 sm:p-12 group"
          >
            <span className="text-5xl font-display text-border group-hover:text-muted-foreground transition-colors duration-500">
              {s.step}
            </span>
            <h3 className="font-body font-semibold text-foreground text-base mt-6 mb-3">
              {s.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-body">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
));

HowItWorks.displayName = "HowItWorks";
export default HowItWorks;

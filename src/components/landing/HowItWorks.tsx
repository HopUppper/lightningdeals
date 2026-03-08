import { memo } from "react";
import { motion } from "framer-motion";
import { credEase, staggerContainer, fadeUpVariants } from "@/components/animations/CredAnimations";

const steps = [
  { step: "01", title: "Browse & Choose", desc: "Explore 100+ premium subscriptions at unbeatable prices." },
  { step: "02", title: "Order via WhatsApp", desc: "Place your order with personalized support and instant confirmation." },
  { step: "03", title: "Instant Delivery", desc: "Receive your subscription credentials within minutes." },
];

const container = staggerContainer(0.15);

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: credEase, delay: i * 0.12 },
  }),
};

const HowItWorks = memo(() => (
  <section className="section-padding relative overflow-hidden border-t border-border">
    <div className="container-tight relative z-10">
      <motion.div
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        className="text-center mb-20"
      >
        <span className="section-eyebrow">Process</span>
        <h2 className="section-title">how it works</h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden"
      >
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            variants={cardVariants}
            custom={i}
            className="bg-card p-10 sm:p-12 group hover:bg-card/80 transition-colors duration-500"
          >
            <span className="text-5xl font-display text-border group-hover:text-accent/40 transition-colors duration-700">
              {s.step}
            </span>
            <h3 className="font-body font-semibold text-foreground text-base mt-6 mb-3 group-hover:text-accent transition-colors duration-500">
              {s.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-body">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
));

HowItWorks.displayName = "HowItWorks";
export default HowItWorks;

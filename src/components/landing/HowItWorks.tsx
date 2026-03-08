import { memo } from "react";
import { motion } from "framer-motion";
import { Search, CreditCard, Zap } from "lucide-react";

const steps = [
  { icon: Search, title: "Choose Your Subscription", desc: "Browse our catalog of 100+ premium tools and pick your plan.", step: "01" },
  { icon: CreditCard, title: "Make Secure Payment", desc: "Pay securely via UPI, cards, net banking or wallets through Razorpay.", step: "02" },
  { icon: Zap, title: "Receive Within Minutes", desc: "Get your subscription credentials delivered directly to your WhatsApp.", step: "03" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const card = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 120 } },
};

const HowItWorks = memo(() => (
  <section className="section-padding bg-secondary/30 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />

    <div className="container-tight relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 25 }}
        className="text-center mb-16"
      >
        <span className="section-eyebrow">Simple Process</span>
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle mx-auto">Three simple steps to get your premium subscription</p>
      </motion.div>

      <motion.div className="grid md:grid-cols-3 gap-6" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
        {steps.map((s, i) => (
          <motion.div key={s.step} variants={card} className="relative">
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-14 left-[calc(50%+40px)] right-[calc(-50%+40px)] h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
            )}
            <div className="glass-card p-10 text-center relative group h-full">
              <div className="absolute top-6 right-6 text-5xl font-display font-bold text-primary/5 select-none group-hover:text-primary/10 transition-colors duration-300">
                {s.step}
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300 will-change-transform">
                <s.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-3 tracking-tight">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
));

HowItWorks.displayName = "HowItWorks";
export default HowItWorks;

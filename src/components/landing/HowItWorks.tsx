import { motion } from "framer-motion";
import { Search, CreditCard, Zap } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Choose Your Subscription",
    desc: "Browse our catalog of 100+ premium tools and pick your plan.",
    step: "01",
  },
  {
    icon: CreditCard,
    title: "Make Secure Payment",
    desc: "Pay securely via UPI, cards, net banking or wallets through Razorpay.",
    step: "02",
  },
  {
    icon: Zap,
    title: "Receive Within Minutes",
    desc: "Get your subscription credentials delivered directly to your WhatsApp.",
    step: "03",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const card = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", damping: 18, stiffness: 90 },
  },
};

const HowItWorks = () => (
  <section className="section-padding bg-background">
    <div className="container-tight">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 20 }}
        className="text-center mb-16"
      >
        <span className="text-sm font-semibold text-primary uppercase tracking-wider">Simple Process</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3">How It Works</h2>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {steps.map((s) => (
          <motion.div key={s.step} variants={card} className="glass-card p-8 text-center relative group">
            <div className="absolute top-6 right-6 text-5xl font-display font-bold text-border/50 select-none group-hover:text-primary/15 transition-colors duration-500">
              {s.step}
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-400">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-3">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HowItWorks;

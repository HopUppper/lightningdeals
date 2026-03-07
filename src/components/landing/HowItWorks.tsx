import { motion } from "framer-motion";
import { Search, CreditCard, Zap } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Choose Your Subscription",
    desc: "Browse our catalog of 50+ premium tools and pick your plan.",
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

const HowItWorks = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Simple Process</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3">
            How It Works
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 text-center relative group"
            >
              <div className="absolute top-6 right-6 text-5xl font-display font-bold text-border/60 select-none">
                {s.step}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

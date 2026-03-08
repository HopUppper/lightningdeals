import { motion } from "framer-motion";
import { Users, Zap, Shield, Headphones, CheckCircle } from "lucide-react";

const items = [
  { icon: Users, value: "10,000+", label: "Customers Served", desc: "Happy customers worldwide" },
  { icon: Zap, value: "< 5 min", label: "Fast Delivery", desc: "Instant WhatsApp delivery" },
  { icon: Shield, value: "100%", label: "Secure Payments", desc: "Razorpay encrypted checkout" },
  { icon: Headphones, value: "24/7", label: "Support Available", desc: "Always here to help" },
];

const badges = [
  "✔ Secure Payments",
  "✔ Fast Delivery",
  "✔ Verified Service",
  "✔ Customer Support",
];

const TrustSection = () => (
  <section className="section-padding bg-secondary/40 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

    <div className="container-tight relative z-10">
      {/* Trust badges row */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        {badges.map((b) => (
          <span key={b} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {b}
          </span>
        ))}
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 text-center group"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-105 transition-all duration-300">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-display font-bold text-foreground">{item.value}</div>
            <div className="text-sm font-medium text-foreground mt-1">{item.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustSection;

import { motion } from "framer-motion";
import { Users, Zap, Shield, Headphones } from "lucide-react";

const items = [
  { icon: Users, value: "10,000+", label: "Customers Served", color: "hsl(var(--primary))" },
  { icon: Zap, value: "< 5 min", label: "Fast Delivery", color: "hsl(var(--accent))" },
  { icon: Shield, value: "100%", label: "Secure Payments", color: "hsl(var(--primary))" },
  { icon: Headphones, value: "24/7", label: "Support Available", color: "hsl(var(--accent))" },
];

const TrustSection = () => (
  <section className="section-padding bg-background relative overflow-hidden mesh-gradient">
    <div className="container-tight relative z-10">
      {/* Badges row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-3 mb-14"
      >
        {["Secure Payments", "Instant Delivery", "Verified Service", "24/7 Support"].map((b, i) => (
          <motion.span
            key={b}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {b}
          </motion.span>
        ))}
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, type: "spring", damping: 20 }}
            className="glass-card p-6 text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-500">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">{item.value}</div>
            <div className="text-sm font-medium text-muted-foreground mt-1">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustSection;

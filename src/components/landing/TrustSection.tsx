import { memo } from "react";
import { motion } from "framer-motion";
import { Users, Zap, Shield, Headphones } from "lucide-react";

const items = [
  { icon: Users, value: "10,000+", label: "Customers Served" },
  { icon: Zap, value: "< 5 min", label: "Fast Delivery" },
  { icon: Shield, value: "100%", label: "Secure Payments" },
  { icon: Headphones, value: "24/7", label: "Support Available" },
];

const badges = ["Secure Payments", "Instant Delivery", "Verified Service", "24/7 Support"];

const TrustSection = memo(() => (
  <section className="section-padding bg-background relative overflow-hidden mesh-gradient">
    <div className="container-tight relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 25 }}
        className="flex flex-wrap justify-center gap-3 mb-16"
      >
        {badges.map((b) => (
          <span key={b} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {b}
          </span>
        ))}
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.06, type: "spring", damping: 25 }}
            className="glass-card p-8 text-center group"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300 will-change-transform">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight">{item.value}</div>
            <div className="text-sm font-medium text-muted-foreground mt-2">{item.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 25 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-primary/5 border border-primary/10">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Most subscriptions delivered within <strong className="text-primary">10–30 minutes</strong></span>
        </div>
      </motion.div>
    </div>
  </section>
));

TrustSection.displayName = "TrustSection";
export default TrustSection;

import { motion } from "framer-motion";
import { Users, Zap, Shield, Headphones } from "lucide-react";

const items = [
  { icon: Users, value: "10,000+", label: "Customers Served" },
  { icon: Zap, value: "< 5 min", label: "Fast Delivery" },
  { icon: Shield, value: "100%", label: "Secure Payments" },
  { icon: Headphones, value: "24/7", label: "Support Available" },
];

const TrustSection = () => (
  <section className="section-padding bg-secondary/50">
    <div className="container-tight">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-display font-bold text-foreground">{item.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustSection;

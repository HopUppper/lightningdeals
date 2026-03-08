import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  { name: "Rahul Sharma", text: "Amazing service! Got my Canva Pro account within minutes. The discount was unbelievable.", rating: 5, product: "Canva Pro", initials: "RS", color: "hsl(var(--primary))" },
  { name: "Priya Patel", text: "LinkedIn Premium at such a low price? I was skeptical but it's 100% legit. Great support too.", rating: 5, product: "LinkedIn Premium", initials: "PP", color: "hsl(210, 80%, 45%)" },
  { name: "Arjun Mehta", text: "Saved a fortune on Adobe Creative Cloud. Fast delivery and excellent customer service.", rating: 5, product: "Adobe CC", initials: "AM", color: "hsl(0, 80%, 50%)" },
  { name: "Sneha Gupta", text: "TradingView Premium delivered in under 3 minutes. Lightning Deals is my go-to for subscriptions!", rating: 5, product: "TradingView", initials: "SG", color: "hsl(var(--accent))" },
];

const Testimonials = memo(() => (
  <section className="section-padding bg-background relative overflow-hidden">
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />

    <div className="container-tight relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 25 }}
        className="text-center mb-16"
      >
        <span className="section-eyebrow">Testimonials</span>
        <h2 className="section-title">Loved by <span className="gradient-text">10,000+</span> Customers</h2>
        <p className="section-subtitle mx-auto">See what our customers say about their experience</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.06, type: "spring", damping: 25 }}
            className="glass-card p-7 relative group"
          >
            <Quote className="absolute top-5 right-5 w-7 h-7 text-primary/5 group-hover:text-primary/10 transition-colors duration-300" />
            <div className="flex gap-0.5 mb-5">
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{r.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground font-display font-bold text-xs shrink-0" style={{ backgroundColor: r.color }}>
                {r.initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{r.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Purchased {r.product}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 25 }}
        className="mt-14 text-center"
      >
        <div className="inline-flex items-center gap-3.5 px-6 py-3 rounded-full glass-card border border-border/30">
          <div className="flex -space-x-2">
            {reviews.map((r, i) => (
              <div key={r.initials} className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-primary-foreground font-display text-[9px] font-bold" style={{ backgroundColor: r.color, zIndex: 4 - i }}>
                {r.initials}
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">Trusted by <span className="font-bold text-primary">10,000+</span> customers</span>
        </div>
      </motion.div>
    </div>
  </section>
));

Testimonials.displayName = "Testimonials";
export default Testimonials;

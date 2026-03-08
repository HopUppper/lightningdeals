import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Rahul Sharma",
    text: "Amazing service! Got my Canva Pro account within minutes. The discount was unbelievable.",
    rating: 5,
    product: "Canva Pro",
    initials: "RS",
    color: "hsl(var(--primary))",
  },
  {
    name: "Priya Patel",
    text: "LinkedIn Premium at such a low price? I was skeptical but it's 100% legit. Great support too.",
    rating: 5,
    product: "LinkedIn Premium",
    initials: "PP",
    color: "hsl(210, 80%, 45%)",
  },
  {
    name: "Arjun Mehta",
    text: "Saved a fortune on Adobe Creative Cloud. Fast delivery and excellent customer service.",
    rating: 5,
    product: "Adobe CC",
    initials: "AM",
    color: "hsl(0, 80%, 50%)",
  },
  {
    name: "Sneha Gupta",
    text: "TradingView Premium delivered in under 3 minutes. Lightning Deals is my go-to for subscriptions!",
    rating: 5,
    product: "TradingView",
    initials: "SG",
    color: "hsl(var(--accent))",
  },
];

const Testimonials = () => (
  <section className="section-padding bg-background relative overflow-hidden">
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />

    <div className="container-tight relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-sm font-semibold text-primary uppercase tracking-wider">Testimonials</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3 tracking-tight">
          Loved by <span className="gradient-text">10,000+</span> Customers
        </h2>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">
          See what our customers say about their experience
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, type: "spring", damping: 20 }}
            className="glass-card p-6 relative group"
          >
            <Quote className="absolute top-4 right-4 w-7 h-7 text-primary/5 group-hover:text-primary/10 transition-colors duration-500" />

            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />
              ))}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{r.text}"</p>

            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-primary-foreground font-display font-bold text-xs shrink-0"
                style={{ backgroundColor: r.color }}
              >
                {r.initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{r.name}</div>
                <div className="text-xs text-muted-foreground">Purchased {r.product}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card border border-border/30">
          <div className="flex -space-x-2">
            {reviews.map((r, i) => (
              <div
                key={r.initials}
                className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-primary-foreground font-display text-[9px] font-bold"
                style={{ backgroundColor: r.color, zIndex: 4 - i }}
              >
                {r.initials}
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">
            Trusted by <span className="font-bold text-primary">10,000+</span> customers
          </span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Testimonials;

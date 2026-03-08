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
  <section className="section-padding bg-secondary/30 relative overflow-hidden">
    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

    <div className="container-tight relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-semibold text-primary uppercase tracking-wider">Testimonials</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3">
          Loved by <span className="gradient-text">10,000+</span> Customers
        </h2>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">
          See what our customers say about their experience with Lightning Deals
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 relative group"
          >
            {/* Quote icon */}
            <Quote className="absolute top-4 right-4 w-8 h-8 text-border/40 group-hover:text-primary/20 transition-colors" />

            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>

            {/* Review */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{r.text}"</p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground font-display font-bold text-sm shrink-0"
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

      {/* Social proof banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card">
          <div className="flex -space-x-2">
            {["RS", "PP", "AM", "SG"].map((initials, i) => (
              <div
                key={initials}
                className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-primary-foreground font-display text-[10px] font-bold"
                style={{ backgroundColor: reviews[i].color, zIndex: 4 - i }}
              >
                {initials}
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">
            Trusted by <span className="font-bold text-primary">10,000+</span> customers worldwide
          </span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Testimonials;

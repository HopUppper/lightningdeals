import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Rahul Sharma",
    text: "Amazing service! Got my Canva Pro account within minutes. The discount was unbelievable.",
    rating: 5,
    product: "Canva Pro",
  },
  {
    name: "Priya Patel",
    text: "LinkedIn Premium at such a low price? I was skeptical but it's 100% legit. Great support too.",
    rating: 5,
    product: "LinkedIn Premium",
  },
  {
    name: "Arjun Mehta",
    text: "Saved a fortune on Adobe Creative Cloud. Fast delivery and excellent customer service.",
    rating: 5,
    product: "Adobe CC",
  },
  {
    name: "Sneha Gupta",
    text: "TradingView Premium delivered in under 3 minutes. Lightning Deals is my go-to for subscriptions!",
    rating: 5,
    product: "TradingView",
  },
];

const Testimonials = () => (
  <section className="section-padding bg-background">
    <div className="container-tight">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-semibold text-primary uppercase tracking-wider">Testimonials</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3">
          Loved by 10,000+ Customers
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{r.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm">
                {r.name[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.product}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;

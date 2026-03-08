import { memo } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name: "Rahul S.", text: "Got my Canva Pro in under 3 minutes. The discount was unbelievable.", rating: 5, product: "Canva Pro" },
  { name: "Priya P.", text: "LinkedIn Premium at this price? Skeptical at first but 100% legit.", rating: 5, product: "LinkedIn Premium" },
  { name: "Arjun M.", text: "Saved thousands on Adobe CC. Excellent service and fast delivery.", rating: 5, product: "Adobe CC" },
  { name: "Sneha G.", text: "TradingView Premium delivered instantly. Lightning Deals is my go-to now.", rating: 5, product: "TradingView" },
];

const Testimonials = memo(() => (
  <section className="section-padding relative overflow-hidden border-t border-border">
    <div className="container-tight relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-16"
      >
        <span className="section-eyebrow">Testimonials</span>
        <h2 className="section-title">trusted by <span className="italic text-accent">10,000+</span></h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card p-8 group"
          >
            <div className="flex gap-0.5 mb-5">
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star key={j} className="w-3 h-3 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 font-body">
              "{r.text}"
            </p>
            <div>
              <p className="text-sm font-medium text-foreground font-body">{r.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 font-body">{r.product}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
));

Testimonials.displayName = "Testimonials";
export default Testimonials;

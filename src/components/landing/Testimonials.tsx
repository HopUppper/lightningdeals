import { memo } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { credEase, staggerContainer } from "@/components/animations/CredAnimations";

const reviews = [
  { name: "Rahul S.", text: "Got my Canva Pro in under 3 minutes. The discount was unbelievable.", rating: 5, product: "Canva Pro" },
  { name: "Priya P.", text: "LinkedIn Premium at this price? Skeptical at first but 100% legit.", rating: 5, product: "LinkedIn Premium" },
  { name: "Arjun M.", text: "Saved thousands on Adobe CC. Excellent service and fast delivery.", rating: 5, product: "Adobe CC" },
  { name: "Sneha G.", text: "TradingView Premium delivered instantly. Lightning Deals is my go-to now.", rating: 5, product: "TradingView" },
];

const container = staggerContainer(0.1);

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: credEase, delay: i * 0.08 },
  }),
};

const Testimonials = memo(() => (
  <section className="section-padding relative overflow-hidden border-t border-border">
    <div className="container-tight relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: credEase }}
        className="text-center mb-16"
      >
        <span className="section-eyebrow">Testimonials</span>
        <h2 className="section-title">trusted by <span className="italic text-accent">10,000+</span></h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden"
      >
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            variants={cardVariants}
            custom={i}
            className="bg-card p-8 group hover:bg-card/80 transition-colors duration-500"
          >
            <div className="flex gap-0.5 mb-5">
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star key={j} className="w-3 h-3 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 font-body group-hover:text-foreground/70 transition-colors duration-500">
              "{r.text}"
            </p>
            <div>
              <p className="text-sm font-medium text-foreground font-body">{r.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 font-body">{r.product}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
));

Testimonials.displayName = "Testimonials";
export default Testimonials;

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";

const LimitedOffer = () => (
  <section className="section-padding bg-background">
    <div className="container-tight">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl p-8 sm:p-12"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-dark mb-4">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground/80">Limited Time Offer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary-foreground mb-3">
              Get <span className="gradient-text-gold">70% OFF</span> on All Premium Subscriptions
            </h2>
            <p className="text-primary-foreground/60 max-w-lg">
              Don't miss out on our biggest sale. Premium tools at prices you won't believe.
            </p>
          </div>
          <Link to="/categories" className="btn-gold inline-flex items-center gap-2 whitespace-nowrap text-base">
            Shop Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default LimitedOffer;

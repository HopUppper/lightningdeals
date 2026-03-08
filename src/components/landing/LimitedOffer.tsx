import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";

const LimitedOffer = () => {
  // 48 hours from now for rolling urgency
  const offerEnd = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  return (
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 18, stiffness: 80 }}
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12"
          style={{ background: "var(--gradient-hero)" }}
        >
          {/* Animated glow */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-accent/15 rounded-full blur-[80px]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-48 h-48 bg-primary/15 rounded-full blur-[60px]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", damping: 20, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-dark mb-4"
              >
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-primary-foreground/80">Limited Time Offer</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", damping: 20, delay: 0.2 }}
                className="text-2xl sm:text-3xl font-display font-bold text-primary-foreground mb-3"
              >
                Get <span className="gradient-text-gold">70% OFF</span> on All Premium Subscriptions
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", damping: 20, delay: 0.3 }}
                className="text-primary-foreground/60 max-w-lg mb-4"
              >
                Don't miss out on our biggest sale. Premium tools at prices you won't believe.
              </motion.p>
              <CountdownTimer expiresAt={offerEnd} />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", damping: 16, delay: 0.4 }}
            >
              <Link to="/categories" className="btn-gold inline-flex items-center gap-2 whitespace-nowrap text-base group">
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LimitedOffer;

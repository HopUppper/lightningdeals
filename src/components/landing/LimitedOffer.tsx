import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";

const LimitedOffer = () => {
  const offerEnd = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  return (
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 20, stiffness: 80 }}
          className="relative overflow-hidden rounded-3xl p-10 sm:p-14 noise-overlay"
          style={{ background: "var(--gradient-hero)" }}
        >
          <motion.div
            className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.2, 0.08] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-60 h-60 bg-primary/10 rounded-full blur-[80px]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/10 mb-5"
              >
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span className="text-sm font-medium text-primary-foreground/70">Limited Time Offer</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="!text-3xl sm:!text-4xl lg:!text-5xl font-display font-bold text-primary-foreground mb-4 tracking-tight"
              >
                Get <span className="gradient-text-gold">70% OFF</span> on All Plans
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-primary-foreground/50 max-w-lg mb-6 text-lg"
              >
                Don't miss our biggest sale. Premium tools at unbeatable prices.
              </motion.p>
              <CountdownTimer expiresAt={offerEnd} />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring", damping: 16 }}
            >
              <Link to="/categories" className="btn-gold inline-flex items-center gap-2.5 whitespace-nowrap text-base group">
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

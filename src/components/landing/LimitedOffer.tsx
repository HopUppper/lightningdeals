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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25 }}
          className="relative overflow-hidden rounded-3xl p-10 sm:p-14 noise-overlay"
          style={{ background: "var(--gradient-hero)" }}
        >
          {/* Static glows instead of animated */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-float-slow" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/10 rounded-full blur-[80px] animate-float" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/10 mb-5">
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span className="text-sm font-medium text-primary-foreground/70">Limited Time Offer</span>
              </div>
              <h2 className="!text-3xl sm:!text-4xl lg:!text-5xl font-display font-bold text-primary-foreground mb-4 tracking-tight">
                Get <span className="gradient-text-gold">70% OFF</span> on All Plans
              </h2>
              <p className="text-primary-foreground/50 max-w-lg mb-6 text-lg">
                Don't miss our biggest sale. Premium tools at unbeatable prices.
              </p>
              <CountdownTimer expiresAt={offerEnd} />
            </div>
            <div>
              <Link to="/categories" className="btn-gold inline-flex items-center gap-2.5 whitespace-nowrap text-base group">
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LimitedOffer;

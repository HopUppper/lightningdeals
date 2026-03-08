import { memo } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = "917695956938";

const WhatsAppCTA = memo(() => (
  <section className="section-padding">
    <div className="container-tight">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card p-12 sm:p-16 text-center relative overflow-hidden"
      >
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsl(38 80% 55% / 0.1) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="section-title !mt-0">
            ready to <span className="italic text-accent">save</span>?
          </h2>
          <p className="text-muted-foreground text-base mt-5 mb-10 font-body leading-relaxed">
            Order your premium subscription through WhatsApp for instant support and the fastest delivery experience.
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Lightning Deals! ⚡ I'd like to place an order.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary group"
          >
            <MessageCircle className="w-4 h-4" />
            Order on WhatsApp
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </motion.div>
    </div>
  </section>
));

WhatsAppCTA.displayName = "WhatsAppCTA";
export default WhatsAppCTA;

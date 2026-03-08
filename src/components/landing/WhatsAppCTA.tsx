import { memo } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Shield, Zap, Clock } from "lucide-react";

const WHATSAPP_NUMBER = "917695956938";

const WhatsAppCTA = memo(() => (
  <section className="section-padding bg-background">
    <div className="container-tight">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 25 }}
        className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center"
        style={{ background: "linear-gradient(135deg, hsl(142, 70%, 42%), hsl(152, 58%, 32%))" }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>

          <h2 className="!text-3xl sm:!text-4xl font-display font-bold text-white mb-4 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">
            Order your premium subscription through WhatsApp for instant support and the fastest delivery experience.
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Lightning Deals! ⚡ I'd like to place an order. Please guide me.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-foreground font-semibold text-base hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200"
            style={{ boxShadow: "0 10px 30px -10px rgba(0,0,0,0.3)" }}
          >
            <MessageCircle className="w-5 h-5" />
            Order on WhatsApp
          </a>

          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              { icon: Shield, label: "Secure Orders" },
              { icon: Zap, label: "5-Min Delivery" },
              { icon: Clock, label: "24/7 Support" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2 text-white/50 text-sm">
                <t.icon className="w-4 h-4" />
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
));

WhatsAppCTA.displayName = "WhatsAppCTA";
export default WhatsAppCTA;

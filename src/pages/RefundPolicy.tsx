import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { RotateCcw, MessageCircle } from "lucide-react";

const sections = [
  { title: "Refund Eligibility", content: "Refunds are available within 48 hours of purchase if the delivered subscription does not work as described or cannot be activated. To request a refund, contact our support team via WhatsApp or email with your Order ID and a description of the issue." },
  { title: "Refund Process", content: "Once a refund request is received, our team will verify the issue within 24 hours. If approved, the refund will be processed to your original payment method within 5–7 business days." },
  { title: "Non-Refundable Cases", content: "Refunds are not available in the following cases: the subscription has already been activated and used, credentials have been shared with third parties, the request is made after 48 hours of purchase, or the issue is caused by user error or misuse." },
  { title: "Replacement Policy", content: "If a delivered subscription is defective, we may offer a replacement instead of a refund. Replacements are processed within 24 hours and delivered via WhatsApp." },
  { title: "Customer Support", content: "For any refund or replacement queries, reach out to us on WhatsApp or email sidhjain9002@gmail.com. Our support team is available to help resolve issues promptly." },
];

const RefundPolicy = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Refund Policy — Lightning Deals" description="Learn about Lightning Deals refund and replacement policies." />
    <Navbar />
    <div className="pt-28 section-padding">
      <div className="container-tight max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-semibold text-foreground">Refund Policy</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Last updated: March 8, 2026</p>
            </div>
          </div>

          {/* Quick summary */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-5 mb-6 bg-accent/5 border-accent/15">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Quick summary:</strong> Full refund within 48 hours if subscription doesn't work. Replacements processed within 24 hours.
            </p>
          </motion.div>

          <div className="space-y-1">
            {sections.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.03 }}
                className="glass-card p-6"
              >
                <h2 className="font-display font-semibold text-foreground text-base mb-2.5">{s.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.content}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6 mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">Need to request a refund?</p>
            <a href="https://wa.me/917695956938" target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex">
              <MessageCircle className="w-4 h-4" /> Contact Support
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default RefundPolicy;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Zap, MessageCircle, Mail, Clock, Truck } from "lucide-react";

const highlights = [
  { icon: Zap, title: "Instant Delivery", desc: "Most subscriptions within 5 minutes" },
  { icon: MessageCircle, title: "WhatsApp Delivery", desc: "Credentials sent to your WhatsApp" },
  { icon: Mail, title: "Email Backup", desc: "Copy also sent to your email" },
  { icon: Clock, title: "24/7 Support", desc: "Help available anytime" },
];

const sections = [
  { title: "How Subscriptions Are Delivered", content: "All products on Lightning Deals are digital subscriptions. After payment confirmation, your subscription credentials (login details, activation keys, or account access) are delivered directly via WhatsApp and a backup copy is sent to your email address." },
  { title: "Delivery Timeline", content: "Standard delivery is within 5 minutes of payment confirmation. During peak hours or for certain products, delivery may take up to 30 minutes. If you have not received your delivery within 1 hour, please contact our support team." },
  { title: "Delivery Issues", content: "If you experience any issues with your delivery — such as missing credentials, non-working accounts, or access problems — contact us immediately via WhatsApp. Our team will resolve the issue or provide a replacement within 24 hours." },
  { title: "Customer Support Channels", content: "WhatsApp: +91 76959 56938 (fastest response)\nEmail: sidhjain9002@gmail.com\n\nSupport is available 7 days a week." },
];

const DeliveryPolicy = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Delivery Policy — Lightning Deals" description="Learn about Lightning Deals digital subscription delivery process." />
    <Navbar />
    <div className="pt-28 section-padding">
      <div className="container-tight max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-semibold text-foreground">Delivery Policy</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Last updated: March 8, 2026</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.04 }}
                className="glass-card p-4 text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2.5">
                  <h.icon className="w-4 h-4 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-xs mb-0.5">{h.title}</h3>
                <p className="text-[10px] text-muted-foreground">{h.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="space-y-1">
            {sections.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.03 }}
                className="glass-card p-6"
              >
                <h2 className="font-display font-semibold text-foreground text-base mb-2.5">{s.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{s.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default DeliveryPolicy;

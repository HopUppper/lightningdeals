import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Zap, MessageCircle, Mail, Clock } from "lucide-react";

const DeliveryPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-28 section-padding">
      <div className="container-tight max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title !mt-0 mb-4">Delivery Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: March 8, 2026</p>

          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {[
              { icon: Zap, title: "Instant Delivery", desc: "Most subscriptions delivered within 5 minutes" },
              { icon: MessageCircle, title: "WhatsApp Delivery", desc: "Credentials sent directly to your WhatsApp" },
              { icon: Mail, title: "Email Backup", desc: "Copy of credentials also sent to your email" },
              { icon: Clock, title: "24/7 Support", desc: "Help available anytime if you face issues" },
            ].map((c) => (
              <div key={c.title} className="glass-card p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-sm">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="prose prose-sm max-w-none space-y-8">
            {[
              { title: "How Subscriptions Are Delivered", content: "All products on Lightning Deals are digital subscriptions. After payment confirmation, your subscription credentials (login details, activation keys, or account access) are delivered directly via WhatsApp and a backup copy is sent to your email address." },
              { title: "Delivery Timeline", content: "Standard delivery is within 5 minutes of payment confirmation. During peak hours or for certain products, delivery may take up to 30 minutes. If you have not received your delivery within 1 hour, please contact our support team." },
              { title: "Delivery Issues", content: "If you experience any issues with your delivery — such as missing credentials, non-working accounts, or access problems — contact us immediately via WhatsApp. Our team will resolve the issue or provide a replacement within 24 hours." },
              { title: "Customer Support Channels", content: "WhatsApp: +91 76959 56938 (fastest response)\nEmail: sidhjain9002@gmail.com\n\nSupport is available 7 days a week." },
            ].map((s) => (
              <div key={s.title}>
                <h2 className="font-display font-semibold text-foreground text-lg mb-3">{s.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default DeliveryPolicy;

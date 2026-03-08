import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, Mail, FileText, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const helpLinks = [
  { icon: HelpCircle, title: "FAQ", desc: "Find answers to common questions", to: "/faq", color: "bg-accent/10 text-accent" },
  { icon: MessageCircle, title: "WhatsApp Support", desc: "Get instant help from our team", href: "https://wa.me/917695956938", color: "bg-accent/10 text-accent" },
  { icon: Mail, title: "Email Support", desc: "We respond within 24 hours", to: "/contact", color: "bg-accent/10 text-accent" },
  { icon: FileText, title: "Refund Policy", desc: "Learn about our refund process", to: "/refund-policy", color: "bg-accent/10 text-accent" },
  { icon: Shield, title: "Privacy Policy", desc: "How we protect your data", to: "/privacy-policy", color: "bg-accent/10 text-accent" },
];

const Help = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Help & Support — Lightning Deals" description="Get help and support for Lightning Deals." />
    <Navbar />

    <div className="pt-28 section-padding">
      <div className="container-tight max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
          <span className="section-eyebrow">Support</span>
          <h1 className="section-title">Help & Support</h1>
          <p className="section-subtitle mx-auto">We're here to help you with any questions or issues.</p>
        </motion.div>

        <div className="space-y-3">
          {helpLinks.map((item, i) => {
            const content = (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6 flex items-center gap-4 group"
              >
                <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-foreground">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.desc}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </motion.div>
            );

            if (item.href) {
              return <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className="block">{content}</a>;
            }
            return <Link key={item.title} to={item.to!} className="block">{content}</Link>;
          })}
        </div>
      </div>
    </div>

    <Footer />
    <WhatsAppButton />
  </div>
);

export default Help;

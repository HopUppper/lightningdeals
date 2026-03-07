import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Help = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 section-padding">
      <div className="container-tight max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Support</span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3">Help & Support</h1>
          <p className="text-muted-foreground mt-3">We're here to help you with any questions or issues.</p>
        </motion.div>

        <div className="space-y-4">
          <Link to="/faq" className="glass-card p-6 flex items-center gap-4 block">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-display font-semibold text-foreground">FAQ</div>
              <div className="text-sm text-muted-foreground">Find answers to commonly asked questions</div>
            </div>
          </Link>
          <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="glass-card p-6 flex items-center gap-4 block">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-display font-semibold text-foreground">WhatsApp Support</div>
              <div className="text-sm text-muted-foreground">Chat with us directly on WhatsApp</div>
            </div>
          </a>
          <Link to="/contact" className="glass-card p-6 flex items-center gap-4 block">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-display font-semibold text-foreground">Email Support</div>
              <div className="text-sm text-muted-foreground">Send us an email and we'll respond within 24 hours</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Help;

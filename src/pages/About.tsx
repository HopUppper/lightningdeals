import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Shield, Zap, Heart, Users } from "lucide-react";

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-28 section-padding">
      <div className="container-tight max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
          <span className="section-eyebrow">About Us</span>
          <h1 className="section-title">We Make Premium Affordable</h1>
          <p className="section-subtitle mx-auto">
            Lightning Deals is India's trusted platform for discounted digital subscriptions. We partner with authorized resellers to bring you premium software at prices that won't break the bank.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { icon: Shield, title: "100% Authentic", desc: "All subscriptions are genuine and sourced from authorized channels." },
            { icon: Zap, title: "Instant Delivery", desc: "Get your credentials delivered via WhatsApp within minutes." },
            { icon: Heart, title: "Customer First", desc: "24/7 support and hassle-free experience guaranteed." },
            { icon: Users, title: "10K+ Trust Us", desc: "Join thousands of happy customers across India." },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-5">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2.5 text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default About;

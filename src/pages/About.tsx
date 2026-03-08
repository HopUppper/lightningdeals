import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Shield, Zap, Heart, Users, Award, Globe } from "lucide-react";

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Products" },
  { value: "< 5min", label: "Avg Delivery" },
  { value: "24/7", label: "Support" },
];

const values = [
  { icon: Shield, title: "100% Authentic", desc: "All subscriptions are genuine and sourced from authorized channels. No exceptions." },
  { icon: Zap, title: "Instant Delivery", desc: "Credentials delivered via WhatsApp within minutes of payment confirmation." },
  { icon: Heart, title: "Customer First", desc: "Dedicated support team available 24/7 to ensure a seamless experience." },
  { icon: Award, title: "Best Prices", desc: "We negotiate bulk deals to pass maximum savings directly to you." },
  { icon: Users, title: "Trusted Community", desc: "Join thousands of satisfied customers across India who trust us." },
  { icon: Globe, title: "Global Brands", desc: "Access premium subscriptions from world-leading software companies." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="About Us — Lightning Deals" description="India's trusted platform for discounted premium digital subscriptions." />
    <Navbar />

    <div className="pt-28 section-padding">
      <div className="container-tight max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
          <span className="section-eyebrow">About Us</span>
          <h1 className="section-title">We Make Premium <span className="gradient-text-gold">Affordable</span></h1>
          <p className="section-subtitle mx-auto">
            Lightning Deals is India's trusted platform for discounted digital subscriptions. We partner with authorized resellers to bring you premium software at prices that won't break the bank.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-8 mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display font-bold text-2xl sm:text-3xl gradient-text-gold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-card p-7 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/8 flex items-center justify-center mb-5 group-hover:bg-accent/15 group-hover:scale-110 transition-all duration-500">
                <item.icon className="w-5 h-5 text-accent" />
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

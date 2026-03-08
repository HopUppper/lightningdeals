import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const sections = [
  { title: "Information We Collect", content: "We collect personal information you provide when placing orders, including your name, email address, phone number, and WhatsApp contact details. We also collect order-related data such as products purchased, transaction amounts, and delivery preferences." },
  { title: "How We Use Your Information", content: "Your information is used to process and fulfill orders, communicate order updates via WhatsApp and email, provide customer support, improve our services, and send relevant promotional offers (with your consent). We never sell your personal data to third parties." },
  { title: "Data Security", content: "We implement industry-standard security measures to protect your personal information. All data is stored securely using encrypted databases. Payment processing is handled through secure channels, and we do not store payment card details on our servers." },
  { title: "WhatsApp Communication", content: "By providing your WhatsApp number, you consent to receiving order confirmations, delivery updates, and support messages via WhatsApp. You can opt out of promotional messages at any time by messaging us." },
  { title: "Cookies & Analytics", content: "We use essential cookies to maintain your session and shopping cart. Analytics cookies help us understand how visitors interact with our website to improve the user experience. You can manage cookie preferences through your browser settings." },
  { title: "Your Rights", content: "You have the right to access, correct, or delete your personal data. You may request a copy of your data or ask us to remove your account by contacting our support team. We will respond to all requests within 30 days." },
  { title: "Contact Us", content: "For privacy-related inquiries, contact us at sidhjain9002@gmail.com or reach out via WhatsApp." },
];

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Privacy Policy — Lightning Deals" description="Learn how Lightning Deals collects, uses, and protects your personal information." />
    <Navbar />
    <div className="pt-28 section-padding">
      <div className="container-tight max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-semibold text-foreground">Privacy Policy</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Last updated: March 8, 2026</p>
            </div>
          </div>

          <div className="space-y-1">
            {sections.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.03 }}
                className="glass-card p-6"
              >
                <h2 className="font-display font-semibold text-foreground text-base mb-2.5">{s.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.content}</p>
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

export default PrivacyPolicy;

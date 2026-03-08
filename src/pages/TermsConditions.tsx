import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const sections = [
  { title: "Acceptance of Terms", content: "By accessing and using the Lightning Deals platform, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services." },
  { title: "Services Offered", content: "Lightning Deals is a digital marketplace offering premium software subscriptions at discounted prices. All products are digital and delivered electronically via WhatsApp and email. We act as an authorized reseller for the listed software products." },
  { title: "Ordering Process", content: "Orders are placed through our WhatsApp checkout system. After selecting products, you will be connected with our team on WhatsApp to complete the payment process. Orders are confirmed only after successful payment verification." },
  { title: "Payment Terms", content: "Payment is processed through secure channels as guided by our WhatsApp support team. We accept UPI, bank transfers, and other payment methods as communicated during the checkout process. All prices are listed in Indian Rupees (₹)." },
  { title: "Delivery Policy", content: "Digital subscriptions are delivered within 5 minutes of payment confirmation via WhatsApp and email. Delivery includes account credentials, activation keys, or direct account access depending on the product." },
  { title: "User Responsibilities", content: "Users must provide accurate personal and contact information. Subscription credentials must not be shared, resold, or transferred. Users are responsible for maintaining the confidentiality of their account details." },
  { title: "Intellectual Property", content: "All content on this website, including logos, text, graphics, and software, is protected by intellectual property laws. Product names and logos belong to their respective owners." },
  { title: "Limitation of Liability", content: "Lightning Deals shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability is limited to the amount paid for the specific product in question." },
  { title: "Changes to Terms", content: "We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of the platform after changes constitutes acceptance of the revised terms." },
];

const TermsConditions = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Terms & Conditions — Lightning Deals" description="Read the terms and conditions for using Lightning Deals platform." />
    <Navbar />
    <div className="pt-28 section-padding">
      <div className="container-tight max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-semibold text-foreground">Terms & Conditions</h1>
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

export default TermsConditions;

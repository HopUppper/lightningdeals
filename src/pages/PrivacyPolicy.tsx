import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-28 section-padding">
      <div className="container-tight max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title !mt-0 mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: March 8, 2026</p>

          <div className="prose prose-sm max-w-none space-y-8">
            {[
              { title: "Information We Collect", content: "We collect personal information you provide when placing orders, including your name, email address, phone number, and WhatsApp contact details. We also collect order-related data such as products purchased, transaction amounts, and delivery preferences." },
              { title: "How We Use Your Information", content: "Your information is used to process and fulfill orders, communicate order updates via WhatsApp and email, provide customer support, improve our services, and send relevant promotional offers (with your consent). We never sell your personal data to third parties." },
              { title: "Data Security", content: "We implement industry-standard security measures to protect your personal information. All data is stored securely using encrypted databases. Payment processing is handled through secure channels, and we do not store payment card details on our servers." },
              { title: "WhatsApp Communication", content: "By providing your WhatsApp number, you consent to receiving order confirmations, delivery updates, and support messages via WhatsApp. You can opt out of promotional messages at any time by messaging us." },
              { title: "Cookies & Analytics", content: "We use essential cookies to maintain your session and shopping cart. Analytics cookies help us understand how visitors interact with our website to improve the user experience. You can manage cookie preferences through your browser settings." },
              { title: "Your Rights", content: "You have the right to access, correct, or delete your personal data. You may request a copy of your data or ask us to remove your account by contacting our support team. We will respond to all requests within 30 days." },
              { title: "Contact Us", content: "For privacy-related inquiries, contact us at sidhjain9002@gmail.com or reach out via WhatsApp." },
            ].map((s) => (
              <div key={s.title}>
                <h2 className="font-display font-semibold text-foreground text-lg mb-3">{s.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default PrivacyPolicy;

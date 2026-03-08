import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const RefundPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-28 section-padding">
      <div className="container-tight max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title !mt-0 mb-4">Refund Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: March 8, 2026</p>

          <div className="prose prose-sm max-w-none space-y-8">
            {[
              { title: "Refund Eligibility", content: "Refunds are available within 48 hours of purchase if the delivered subscription does not work as described or cannot be activated. To request a refund, contact our support team via WhatsApp or email with your Order ID and a description of the issue." },
              { title: "Refund Process", content: "Once a refund request is received, our team will verify the issue within 24 hours. If approved, the refund will be processed to your original payment method within 5–7 business days." },
              { title: "Non-Refundable Cases", content: "Refunds are not available in the following cases: the subscription has already been activated and used, credentials have been shared with third parties, the request is made after 48 hours of purchase, or the issue is caused by user error or misuse." },
              { title: "Replacement Policy", content: "If a delivered subscription is defective, we may offer a replacement instead of a refund. Replacements are processed within 24 hours and delivered via WhatsApp." },
              { title: "Customer Support", content: "For any refund or replacement queries, reach out to us on WhatsApp or email sidhjain9002@gmail.com. Our support team is available to help resolve issues promptly." },
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

export default RefundPolicy;

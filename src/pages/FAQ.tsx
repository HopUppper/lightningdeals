import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How does delivery work?", a: "After payment, your subscription credentials are delivered directly to your WhatsApp number within 5 minutes. Our team is available 24/7 to assist." },
  { q: "Are the subscriptions authentic?", a: "Yes, all subscriptions are 100% genuine and sourced from authorized resellers. We guarantee the authenticity of every product." },
  { q: "What is the refund policy?", a: "We offer a full refund within 24 hours of purchase if your subscription hasn't been activated. Contact our support team for assistance." },
  { q: "Is payment secure?", a: "Absolutely. We use Razorpay, India's leading payment gateway, which ensures bank-grade security for all transactions." },
  { q: "How long are the subscriptions valid?", a: "Subscription validity varies by product and is clearly mentioned on each product page. Most subscriptions are valid for 1 year." },
  { q: "Can I get a subscription for my team?", a: "Yes! Contact us on WhatsApp for bulk/team pricing. We offer special discounts for team subscriptions." },
  { q: "What if I face issues with my subscription?", a: "Our 24/7 support team is here to help. Reach out via WhatsApp and we'll resolve any issue promptly." },
];

const FAQ = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 section-padding">
      <div className="container-tight max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3">Frequently Asked Questions</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="glass-card px-6 border-none">
                <AccordionTrigger className="font-display font-semibold text-foreground text-left hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default FAQ;

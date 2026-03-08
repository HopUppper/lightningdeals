import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 section-padding">
        <div className="container-tight max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Get in Touch</span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3">Contact Us</h1>
            <p className="text-muted-foreground mt-3">Have a question? We'd love to hear from you.</p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
                    <Input placeholder="Your name" className="bg-background" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                    <Input type="email" placeholder="you@example.com" className="bg-background" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
                  <Input placeholder="How can we help?" className="bg-background" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                  <Textarea placeholder="Your message..." rows={5} className="bg-background" />
                </div>
                <button type="submit" className="btn-primary-gradient w-full py-3">Send Message</button>
              </motion.form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {[
                { icon: MessageCircle, title: "WhatsApp", value: "+91 99999 99999", href: "https://wa.me/919999999999" },
                { icon: Mail, title: "Email", value: "support@lightningdeals.in", href: "mailto:support@lightningdeals.in" },
                { icon: MapPin, title: "Location", value: "India", href: "#" },
              ].map((c) => (
                <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer" className="glass-card p-5 flex items-center gap-4 block">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <c.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{c.title}</div>
                    <div className="text-sm text-muted-foreground">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Send } from "lucide-react";
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
      <SEOHead title="Contact Us — Lightning Deals" description="Get in touch with Lightning Deals for support and inquiries." />
      <Navbar />

      <div className="pt-28 section-padding">
        <div className="container-tight max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
            <span className="section-eyebrow">Get in Touch</span>
            <h1 className="section-title">Contact Us</h1>
            <p className="section-subtitle mx-auto">Have a question? We'd love to hear from you.</p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSubmit} className="lg:col-span-3 glass-card p-8 sm:p-10 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Name</label>
                  <Input placeholder="Your name" className="bg-background" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Email</label>
                  <Input type="email" placeholder="you@example.com" className="bg-background" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Subject</label>
                <Input placeholder="How can we help?" className="bg-background" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Message</label>
                <Textarea placeholder="Your message..." rows={5} className="bg-background" />
              </div>
              <button type="submit" className="btn-gold w-full">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </motion.form>

            {/* Contact Cards */}
            <div className="lg:col-span-2 space-y-4">
              {[
                { icon: MessageCircle, title: "WhatsApp", value: "+91 76959 56938", href: "https://wa.me/917695956938", desc: "Fastest response" },
                { icon: Mail, title: "Email", value: "sidhjain9002@gmail.com", href: "mailto:sidhjain9002@gmail.com", desc: "Within 24 hours" },
                { icon: MapPin, title: "Location", value: "India", href: "#", desc: "Serving nationwide" },
              ].map((c, i) => (
                <motion.a
                  key={c.title}
                  href={c.href}
                  target={c.href !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="glass-card p-6 flex items-center gap-4 block group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
                    <c.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{c.title}</div>
                    <div className="text-sm text-muted-foreground">{c.value}</div>
                    <div className="text-[10px] text-accent mt-0.5">{c.desc}</div>
                  </div>
                </motion.a>
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

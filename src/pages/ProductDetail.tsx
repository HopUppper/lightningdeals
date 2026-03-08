import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Shield, Zap, Clock, Star, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

const productData: Record<string, {
  name: string; desc: string; longDesc: string; price: number; original: number;
  badge: string; color: string; features: string[]; duration: string; delivery: string;
}> = {
  "canva-pro": {
    name: "Canva Pro", desc: "Premium design tool", badge: "80% OFF", price: 199, original: 999,
    color: "hsl(267,60%,55%)", duration: "1 Year", delivery: "WhatsApp (< 5 min)",
    longDesc: "Get full access to Canva Pro with 100M+ premium stock photos, 610K+ templates, Brand Kit, Magic Resize, Background Remover and much more.",
    features: ["100M+ premium stock photos & videos", "610K+ premium templates", "Brand Kit & custom fonts", "Magic Resize for all platforms", "Background Remover", "100GB cloud storage", "Schedule social media posts"],
  },
  "adobe-cc": {
    name: "Adobe Creative Cloud", desc: "Full Adobe suite", badge: "75% OFF", price: 499, original: 1999,
    color: "hsl(0,80%,50%)", duration: "1 Year", delivery: "WhatsApp (< 5 min)",
    longDesc: "Complete access to 20+ Adobe apps including Photoshop, Illustrator, Premiere Pro, After Effects, and more.",
    features: ["Photoshop & Lightroom", "Illustrator & InDesign", "Premiere Pro & After Effects", "Adobe Fonts & Stock", "100GB cloud storage", "Adobe Portfolio", "Cross-device sync"],
  },
  "chatgpt-plus": {
    name: "ChatGPT Plus", desc: "GPT-4 access", badge: "82% OFF", price: 299, original: 1650,
    color: "hsl(160,60%,40%)", duration: "1 Year", delivery: "WhatsApp (< 5 min)",
    longDesc: "Access GPT-4, DALL-E, Advanced Data Analysis, plugins and priority access even during peak hours.",
    features: ["GPT-4 access", "DALL-E image generation", "Advanced Data Analysis", "Plugin support", "Priority access", "Faster response times", "Custom GPTs"],
  },
  "linkedin-premium": {
    name: "LinkedIn Premium", desc: "Professional networking", badge: "83% OFF", price: 199, original: 1200,
    color: "hsl(210,80%,45%)", duration: "1 Year", delivery: "WhatsApp (< 5 min)",
    longDesc: "Stand out and get ahead with InMail messages, advanced search filters, salary insights, and LinkedIn Learning.",
    features: ["15 InMail messages/month", "See who viewed your profile", "Advanced search filters", "Salary insights", "LinkedIn Learning access", "Applicant insights", "Open Profile visibility"],
  },
  "tradingview": {
    name: "TradingView Premium", desc: "Advanced trading charts", badge: "77% OFF", price: 349, original: 1500,
    color: "hsl(210,60%,40%)", duration: "1 Year", delivery: "WhatsApp (< 5 min)",
    longDesc: "Professional-grade charting platform with real-time data, advanced indicators, alerts, and multi-screen layouts.",
    features: ["8 charts per tab", "25 indicators per chart", "400 server-side alerts", "Second-based intervals", "Volume profile indicators", "Custom timeframes", "Priority support"],
  },
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = productData[id || ""];

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground">Product not found</h1>
          <Link to="/categories" className="text-primary hover:underline mt-4 inline-block">Browse all products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const savings = Math.round(((product.original - product.price) / product.original) * 100);

  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 section-padding">
        <div className="container-tight">
          <Link to="/categories" className="text-sm text-primary hover:underline">← Back to Categories</Link>

          <div className="grid lg:grid-cols-2 gap-12 mt-8">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card p-12 flex items-center justify-center">
                <div
                  className="w-32 h-32 rounded-3xl flex items-center justify-center text-primary-foreground font-display font-bold text-5xl"
                  style={{ backgroundColor: product.color }}
                >
                  {product.name[0]}
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { icon: Zap, label: "Instant Delivery" },
                  { icon: Shield, label: "100% Secure" },
                  { icon: Clock, label: "24/7 Support" },
                ].map((t) => (
                  <div key={t.label} className="glass-card p-3 text-center">
                    <t.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">{t.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Badge className="bg-accent text-accent-foreground font-semibold mb-4">{product.badge}</Badge>
              <h1 className="text-3xl font-display font-bold text-foreground">{product.name}</h1>
              <p className="text-muted-foreground mt-3 leading-relaxed">{product.longDesc}</p>

              <div className="flex items-baseline gap-4 mt-6">
                <span className="text-4xl font-display font-bold text-foreground">₹{product.price}</span>
                <span className="text-lg text-muted-foreground line-through">₹{product.original}</span>
                <span className="text-sm font-semibold text-primary">Save {savings}%</span>
              </div>

              <div className="flex gap-6 mt-6 text-sm text-muted-foreground">
                <span><strong className="text-foreground">Duration:</strong> {product.duration}</span>
                <span><strong className="text-foreground">Delivery:</strong> {product.delivery}</span>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary-gradient w-full mt-8 flex items-center justify-center gap-2 text-base py-4"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <div className="mt-8">
                <h3 className="font-display font-semibold text-foreground mb-4">Features Included</h3>
                <div className="space-y-3">
                  {product.features.map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Reviews */}
          <div className="mt-20">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">Customer Reviews</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { name: "Ankit R.", text: `Best price for ${product.name} I've found anywhere. Delivered in 2 minutes!` },
                { name: "Meera S.", text: "Very professional service. Works perfectly and saved me a lot of money." },
              ].map((r) => (
                <div key={r.name} className="glass-card p-6">
                  <div className="flex gap-0.5 mb-3">
                    {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 fill-accent text-accent" />)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">"{r.text}"</p>
                  <span className="text-sm font-semibold text-foreground">{r.name}</span>
                </div>
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

export default ProductDetail;

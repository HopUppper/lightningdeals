import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Briefcase, Palette, Brain, GraduationCap, Megaphone, TrendingUp, Layers } from "lucide-react";

const categories = [
  { slug: "business-tools", name: "Business Tools", icon: Briefcase, count: 8, desc: "LinkedIn Premium, Zoom Pro & more" },
  { slug: "design-tools", name: "Design Tools", icon: Palette, count: 6, desc: "Canva Pro, Adobe CC, Figma & more" },
  { slug: "ai-tools", name: "AI Tools", icon: Brain, count: 5, desc: "ChatGPT Plus, Jasper, Midjourney & more" },
  { slug: "education-tools", name: "Education Tools", icon: GraduationCap, count: 4, desc: "Coursera, Skillshare, Udemy & more" },
  { slug: "marketing-tools", name: "Marketing Tools", icon: Megaphone, count: 5, desc: "SEMrush, Ahrefs, Mailchimp & more" },
  { slug: "trading-finance", name: "Trading & Finance", icon: TrendingUp, count: 4, desc: "TradingView, Zerodha & more" },
  { slug: "productivity-tools", name: "Productivity Tools", icon: Layers, count: 7, desc: "Notion, Grammarly, Todoist & more" },
];

const Categories = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 section-padding">
      <div className="container-tight">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Explore</span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3">Browse by Category</h1>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Find the perfect premium subscription at the best price.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={`/categories/${cat.slug}`} className="glass-card p-6 flex items-start gap-4 group block">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <cat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{cat.desc}</p>
                  <span className="text-xs text-primary font-medium mt-2 inline-block">{cat.count} products →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Categories;

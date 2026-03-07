import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";

const allProducts: Record<string, Array<{
  id: string; name: string; desc: string; price: number; original: number; badge: string; color: string;
}>> = {
  "design-tools": [
    { id: "canva-pro", name: "Canva Pro", desc: "Premium design tool with templates, brand kits & more", price: 199, original: 999, badge: "80% OFF", color: "hsl(267,60%,55%)" },
    { id: "adobe-cc", name: "Adobe Creative Cloud", desc: "Full access to Photoshop, Illustrator, Premiere & more", price: 499, original: 1999, badge: "75% OFF", color: "hsl(0,80%,50%)" },
    { id: "figma-pro", name: "Figma Pro", desc: "Collaborative design tool for teams", price: 249, original: 899, badge: "72% OFF", color: "hsl(13,80%,55%)" },
  ],
  "ai-tools": [
    { id: "chatgpt-plus", name: "ChatGPT Plus", desc: "Access GPT-4, plugins & advanced features", price: 299, original: 1650, badge: "82% OFF", color: "hsl(160,60%,40%)" },
    { id: "midjourney", name: "Midjourney", desc: "AI image generation with stunning quality", price: 399, original: 1500, badge: "73% OFF", color: "hsl(240,50%,55%)" },
  ],
  "business-tools": [
    { id: "linkedin-premium", name: "LinkedIn Premium", desc: "InMail, insights, learning & advanced search", price: 199, original: 1200, badge: "83% OFF", color: "hsl(210,80%,45%)" },
    { id: "zoom-pro", name: "Zoom Pro", desc: "Unlimited meetings, cloud recording & more", price: 149, original: 800, badge: "81% OFF", color: "hsl(210,80%,50%)" },
  ],
  "trading-finance": [
    { id: "tradingview", name: "TradingView Premium", desc: "Advanced charts, alerts & market data", price: 349, original: 1500, badge: "77% OFF", color: "hsl(210,60%,40%)" },
  ],
  "productivity-tools": [
    { id: "notion-plus", name: "Notion Plus", desc: "All-in-one workspace with unlimited blocks", price: 129, original: 600, badge: "78% OFF", color: "hsl(0,0%,15%)" },
    { id: "grammarly", name: "Grammarly Premium", desc: "Advanced grammar, tone & plagiarism checker", price: 149, original: 700, badge: "79% OFF", color: "hsl(152,60%,40%)" },
  ],
  "education-tools": [
    { id: "coursera-plus", name: "Coursera Plus", desc: "7000+ courses from top universities", price: 299, original: 1200, badge: "75% OFF", color: "hsl(210,70%,50%)" },
  ],
  "marketing-tools": [
    { id: "semrush", name: "SEMrush Pro", desc: "SEO, competitor analysis & keyword research", price: 399, original: 1500, badge: "73% OFF", color: "hsl(22,90%,55%)" },
  ],
};

const categoryNames: Record<string, string> = {
  "design-tools": "Design Tools",
  "ai-tools": "AI Tools",
  "business-tools": "Business Tools",
  "trading-finance": "Trading & Finance",
  "productivity-tools": "Productivity Tools",
  "education-tools": "Education Tools",
  "marketing-tools": "Marketing Tools",
};

const CategoryListing = () => {
  const { slug } = useParams<{ slug: string }>();
  const products = allProducts[slug || ""] || [];
  const categoryName = categoryNames[slug || ""] || "Category";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <Link to="/categories" className="text-sm text-primary hover:underline">← All Categories</Link>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4">{categoryName}</h1>
            <p className="text-muted-foreground mt-2">{products.length} subscriptions available at massive discounts</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={`/product/${p.id}`} className="glass-card p-6 block group relative overflow-hidden">
                  <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground font-semibold text-xs">
                    {p.badge}
                  </Badge>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-primary-foreground font-display font-bold text-xl mb-4"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.name[0]}
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-xl font-display font-bold text-foreground">₹{p.price}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{p.original}</span>
                  </div>
                  <div className="mt-4 text-sm font-semibold text-primary">View Details →</div>
                </Link>
              </motion.div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products in this category yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CategoryListing;

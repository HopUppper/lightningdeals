import { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PRIORITY_SLUGS = [
  "ai-tools",
  "design-tools",
  "developer-tools",
  "marketing-tools",
  "productivity-tools",
  "business-collaboration",
];

const iconMap: Record<string, string> = {
  "ai-tools": "⚡",
  "design-tools": "🎨",
  "developer-tools": "🚀",
  "marketing-tools": "📈",
  "productivity-tools": "⚙️",
  "business-collaboration": "💼",
};

const CategoriesPreview = memo(() => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name, slug, description")
        .order("name");

      if (!data) return;

      // Prioritize the 6 selected categories, then fill with others up to 6
      const prioritized = PRIORITY_SLUGS
        .map((slug) => data.find((c) => c.slug === slug))
        .filter(Boolean);
      const remaining = data.filter((c) => !PRIORITY_SLUGS.includes(c.slug));
      const final = [...prioritized, ...remaining].slice(0, 6);
      setCategories(final);
    };
    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="section-padding bg-secondary/20 relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />

      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25 }}
          className="text-center mb-14"
        >
          <span className="section-eyebrow">Explore</span>
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle mx-auto">Find the perfect tools for your needs</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.05, type: "spring", damping: 25 }}
            >
              <Link
                to={`/categories/${cat.slug}`}
                className="glass-card p-7 flex flex-col items-center text-center group h-full"
              >
                <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  {iconMap[cat.slug] || "📦"}
                </span>
                <h3 className="font-display font-semibold text-foreground text-sm group-hover:text-primary transition-colors duration-200">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{cat.description}</p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/categories" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group">
            View All Categories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

CategoriesPreview.displayName = "CategoriesPreview";
export default CategoriesPreview;

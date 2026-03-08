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

const CategoriesPreview = memo(() => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name, slug, description")
          .order("name");
        if (error) throw error;
        if (!data) return;
        const prioritized = PRIORITY_SLUGS
          .map((slug) => data.find((c) => c.slug === slug))
          .filter(Boolean);
        const remaining = data.filter((c) => !PRIORITY_SLUGS.includes(c.slug));
        setCategories([...prioritized, ...remaining].slice(0, 6));
      } catch (e) {
        console.error("Failed to fetch categories:", e);
      }
    };
    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="section-eyebrow">Categories</span>
          <h2 className="section-title">browse by category</h2>
          <p className="section-subtitle mx-auto">Find the perfect tools for your workflow</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/categories/${cat.slug}`}
                className="glass-card p-8 flex flex-col items-start group h-full"
              >
                <h3 className="font-body font-semibold text-foreground text-sm group-hover:text-accent transition-colors duration-300">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed font-body">{cat.description}</p>
                )}
                <div className="mt-auto pt-4 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-accent transition-colors duration-300 font-body">
                  Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

CategoriesPreview.displayName = "CategoriesPreview";
export default CategoriesPreview;

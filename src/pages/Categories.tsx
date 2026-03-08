import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      // Single query — get categories + count via products join
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name, slug, description, icon, products(id)")
        .eq("products.is_active", true)
        .order("name");

      if (!cats) { setCategories([]); setLoading(false); return; }

      setCategories(
        cats.map((c: any) => ({
          ...c,
          count: Array.isArray(c.products) ? c.products.length : 0,
          products: undefined,
        }))
      );
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
            <span className="section-eyebrow">Explore</span>
            <h1 className="section-title">Browse by Category</h1>
            <p className="section-subtitle mx-auto">Find the perfect premium subscription at the best price.</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", damping: 20 }}
                >
                  <Link to={`/categories/${cat.slug}`} className="glass-card p-7 flex items-start gap-5 group block h-full">
                    <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-500 text-xl">
                      {cat.icon || "📦"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-semibold text-foreground text-lg group-hover:text-primary transition-colors duration-300 tracking-tight">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{cat.description || "Premium subscriptions at discounted prices"}</p>
                      <span className="text-xs text-primary font-semibold mt-3 inline-flex items-center gap-1">
                        {cat.count} products
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Categories;

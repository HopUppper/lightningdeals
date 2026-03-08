import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCats = async () => {
      setLoading(true);
      try {
        // Fetch categories separately from product counts to avoid join issues
        const { data: cats, error: catError } = await supabase
          .from("categories")
          .select("id, name, slug, description, icon")
          .order("name");
        if (catError) throw catError;

        // Get product counts per category
        const { data: products, error: prodError } = await supabase
          .from("products")
          .select("category_id")
          .eq("is_active", true);
        if (prodError) throw prodError;

        const countMap: Record<string, number> = {};
        (products ?? []).forEach((p: any) => {
          if (p.category_id) countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
        });

        setCategories(
          (cats ?? []).map((c: any) => ({
            ...c,
            count: countMap[c.id] || 0,
          }))
        );
      } catch (e) {
        console.error("Failed to fetch categories:", e);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const filtered = categories.filter((c) =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase())
  );
  const totalProducts = categories.reduce((s, c) => s + c.count, 0);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Browse Categories — Lightning Deals" description="Explore premium software subscriptions by category at unbeatable prices." />
      <Navbar />

      {/* Hero */}
      <div className="pt-28 section-padding !pb-0">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header !mb-12">
            <span className="section-eyebrow">Explore</span>
            <h1 className="section-title">Browse by Category</h1>
            <p className="section-subtitle mx-auto">
              {totalProducts} premium subscriptions across {categories.length} categories — all at unbeatable prices.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="max-w-md mx-auto mb-16">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/30 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="section-padding !pt-0">
        <div className="container-tight">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card p-8 animate-pulse">
                  <div className="w-14 h-14 rounded-2xl bg-muted mb-5" />
                  <div className="h-5 w-2/3 bg-muted rounded mb-3" />
                  <div className="h-4 w-full bg-muted/60 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-muted/40 rounded" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {search ? "No categories matching your search" : "No categories yet. Check back soon!"}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, type: "spring", damping: 25 }}
                >
                  <Link
                    to={`/categories/${cat.slug}`}
                    className="glass-card p-8 flex flex-col group block h-full relative overflow-hidden"
                  >
                    {/* Glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-accent/8 flex items-center justify-center group-hover:bg-accent/15 group-hover:scale-110 transition-all duration-500 text-2xl">
                          {cat.icon || "📦"}
                        </div>
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
                          {cat.count} {cat.count === 1 ? "product" : "products"}
                        </span>
                      </div>

                      <h3 className="font-display font-semibold text-foreground text-xl group-hover:text-accent transition-colors duration-300 tracking-tight mb-2">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-5">
                        {cat.description || "Premium subscriptions at discounted prices"}
                      </p>

                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                        Browse category <ArrowRight className="w-3.5 h-3.5" />
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

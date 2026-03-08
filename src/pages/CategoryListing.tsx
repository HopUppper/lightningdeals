import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import ProductOfferBadge from "@/components/ProductOfferBadge";

const CategoryListing = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("Category");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch category name
      const { data: cat } = await supabase
        .from("categories")
        .select("name")
        .eq("slug", slug || "")
        .maybeSingle();

      if (cat) setCategoryName(cat.name);

      // Fetch products in this category by joining through category slug
      const { data: prods } = await supabase
        .from("products")
        .select("*, categories!inner(name, slug)")
        .eq("categories.slug", slug || "")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      setProducts(prods ?? []);
      setLoading(false);
    };

    fetchData();
  }, [slug]);

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

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => {
                const discount = p.price_original > 0
                  ? Math.round(((p.price_original - p.price_discounted) / p.price_original) * 100)
                  : 0;

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link to={`/product/${p.slug}`} className="glass-card p-6 block group relative overflow-hidden">
                      <ProductOfferBadge product={p} fallbackDiscount={discount} />
                      <div className="flex items-center gap-3 mb-4">
                        {p.logo_url ? (
                          <img src={p.logo_url} alt={p.name} className="w-14 h-14 rounded-2xl object-contain bg-muted/30 p-1" />
                        ) : (
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-primary-foreground font-display font-bold text-xl"
                            style={{ backgroundColor: p.color || "hsl(var(--primary))" }}
                          >
                            {p.name[0]}
                          </div>
                        )}
                      </div>
                      <h3 className="font-display font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">{p.description}</p>
                      <div className="flex items-center gap-3 mt-4">
                        <span className="text-xl font-display font-bold text-foreground">₹{p.price_discounted}</span>
                        <span className="text-sm text-muted-foreground line-through">₹{p.price_original}</span>
                      </div>
                      <div className="mt-4 text-sm font-semibold text-primary">View Details →</div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && products.length === 0 && (
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

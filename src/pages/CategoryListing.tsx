import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import ProductOfferBadge from "@/components/ProductOfferBadge";

const PAGE_SIZE = 12;

const CategoryListing = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("Category");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(0);

  const fetchPage = useCallback(async (page: number, isInitial: boolean) => {
    if (isInitial) setLoading(true); else setLoadingMore(true);

    if (isInitial) {
      const { data: cat } = await supabase
        .from("categories")
        .select("name")
        .eq("slug", slug || "")
        .maybeSingle();
      if (cat) setCategoryName(cat.name);
    }

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data: prods, count } = await supabase
      .from("products")
      .select("*, categories!inner(name, slug)", { count: "exact" })
      .eq("categories.slug", slug || "")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    const newProducts = prods ?? [];
    if (isInitial) {
      setProducts(newProducts);
    } else {
      setProducts(prev => [...prev, ...newProducts]);
    }
    setTotalCount(count ?? 0);
    setHasMore(from + newProducts.length < (count ?? 0));
    if (isInitial) setLoading(false); else setLoadingMore(false);
  }, [slug]);

  useEffect(() => {
    pageRef.current = 0;
    setProducts([]);
    setHasMore(true);
    fetchPage(0, true);
  }, [slug, fetchPage]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          pageRef.current += 1;
          fetchPage(pageRef.current, false);
        }
      },
      { rootMargin: "200px" }
    );

    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, loading, fetchPage]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <Link to="/categories" className="text-sm text-primary hover:underline">← All Categories</Link>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4">{categoryName}</h1>
            <p className="text-muted-foreground mt-2">
              {loading ? "Loading..." : `${totalCount} subscriptions available at massive discounts`}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
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
                      transition={{ delay: Math.min(i, 11) * 0.05 }}
                    >
                      <Link to={`/product/${p.slug}`} className="glass-card p-6 block group relative overflow-hidden">
                        <ProductOfferBadge product={p} fallbackDiscount={discount} />
                        <div className="flex items-center gap-3 mb-4">
                          {p.logo_url ? (
                            <img src={p.logo_url} alt={p.name} className="w-14 h-14 rounded-2xl object-contain bg-muted/30 p-1" loading="lazy" />
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
                          {p.price_original > 0 && (
                            <span className="text-sm text-muted-foreground line-through">₹{p.price_original}</span>
                          )}
                        </div>
                        <div className="mt-4 text-sm font-semibold text-primary">View Details →</div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Sentinel for infinite scroll */}
              <div ref={sentinelRef} className="h-4" />

              {loadingMore && (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!hasMore && products.length > 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">You've seen all products in this category</p>
              )}
            </>
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

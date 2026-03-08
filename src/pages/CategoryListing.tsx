import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowUpDown, Flame } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import ProductOfferBadge from "@/components/ProductOfferBadge";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 12;

type SortOption = "newest" | "price_low" | "price_high" | "name";

const CategoryListing = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("Category");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(0);

  const getOrderBy = (sort: SortOption) => {
    switch (sort) {
      case "price_low": return { column: "price_discounted" as const, ascending: true };
      case "price_high": return { column: "price_discounted" as const, ascending: false };
      case "name": return { column: "name" as const, ascending: true };
      default: return { column: "created_at" as const, ascending: false };
    }
  };

  const fetchPage = useCallback(async (page: number, isInitial: boolean, sort: SortOption) => {
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
    const order = getOrderBy(sort);

    const { data: prods, count } = await supabase
      .from("products")
      .select("*, categories!inner(name, slug)", { count: "exact" })
      .eq("categories.slug", slug || "")
      .eq("is_active", true)
      .order(order.column, { ascending: order.ascending })
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
    fetchPage(0, true, sortBy);
  }, [slug, fetchPage, sortBy]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          pageRef.current += 1;
          fetchPage(pageRef.current, false, sortBy);
        }
      },
      { rootMargin: "200px" }
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, loading, fetchPage, sortBy]);

  const handleSort = (option: SortOption) => {
    if (option === sortBy) return;
    setSortBy(option);
    pageRef.current = 0;
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "price_low", label: "Price: Low → High" },
    { value: "price_high", label: "Price: High → Low" },
    { value: "name", label: "Name A–Z" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link to="/categories" className="text-sm text-primary hover:underline">← All Categories</Link>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4">{categoryName}</h1>
            <p className="text-muted-foreground mt-2">
              {loading ? "Loading..." : `${totalCount} subscriptions available at massive discounts`}
            </p>
          </motion.div>

          {/* Sort controls */}
          {!loading && products.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mb-8 flex-wrap"
            >
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mr-1">Sort:</span>
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSort(opt.value)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
                    sortBy === opt.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}

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
                      transition={{ delay: Math.min(i % PAGE_SIZE, 11) * 0.04 }}
                    >
                      <Link to={`/product/${p.slug}`} className="glass-card p-6 block group relative overflow-hidden h-full">
                        <ProductOfferBadge product={p} fallbackDiscount={discount} />

                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-4">
                          {p.logo_url ? (
                            <img
                              src={p.logo_url}
                              alt={p.name}
                              className="w-14 h-14 rounded-2xl object-contain bg-muted/30 p-1.5 group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className="w-14 h-14 rounded-2xl flex items-center justify-center text-primary-foreground font-display font-bold text-xl group-hover:scale-110 transition-transform duration-300"
                              style={{ backgroundColor: p.color || "hsl(var(--primary))" }}
                            >
                              {p.name[0]}
                            </div>
                          )}
                        </div>

                        {/* Name + description */}
                        <h3 className="font-display font-semibold text-foreground text-lg group-hover:text-primary transition-colors duration-200">
                          {p.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">{p.description}</p>

                        {/* Duration tag */}
                        <div className="flex items-center gap-1.5 mt-3">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{p.duration}</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mt-3">
                          {p.price_discounted > 0 ? (
                            <>
                              <span className="text-xl font-display font-bold text-foreground">₹{p.price_discounted}</span>
                              {p.price_original > 0 && (
                                <span className="text-sm text-muted-foreground line-through">₹{p.price_original}</span>
                              )}
                            </>
                          ) : (
                            <span className="text-sm font-medium text-primary">Contact for price</span>
                          )}
                        </div>

                        {/* Hover CTA */}
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform duration-200">
                            View Details →
                          </span>
                          {p.offer_badge && (
                            <Flame className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div ref={sentinelRef} className="h-4" />

              {loadingMore && (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
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

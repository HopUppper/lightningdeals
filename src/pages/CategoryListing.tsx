import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback, useRef, memo } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowUpDown, Flame } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import ProductOfferBadge from "@/components/ProductOfferBadge";
import ProductLogo from "@/components/ProductLogo";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 12;
type SortOption = "newest" | "price_low" | "price_high" | "name";

const ProductCard = memo(({ p, i }: { p: any; i: number }) => {
  const discount = p.price_original > 0
    ? Math.round(((p.price_original - p.price_discounted) / p.price_original) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(i % PAGE_SIZE, 11) * 0.03, type: "spring", damping: 25 }}
    >
      <Link to={`/product/${p.slug}`} className="glass-card p-7 block group relative overflow-hidden h-full">
        <ProductOfferBadge product={p} fallbackDiscount={discount} />
        <div className="flex items-center gap-4 mb-5">
          <div className="group-hover:scale-105 transition-transform duration-300 will-change-transform">
            <ProductLogo name={p.name} logoUrl={p.logo_url} color={p.color} size="w-14 h-14" fontSize="text-xl" />
          </div>
        </div>
        <h3 className="font-display font-semibold text-foreground text-lg group-hover:text-primary transition-colors duration-200 tracking-tight">{p.name}</h3>
        <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed line-clamp-2">{p.description}</p>
        <div className="flex items-center gap-1.5 mt-4">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{p.duration}</span>
        </div>
        <div className="flex items-baseline gap-2.5 mt-4">
          {p.price_discounted > 0 ? (
            <>
              <span className="text-xl font-display font-bold text-foreground">₹{p.price_discounted}</span>
              {p.price_original > 0 && <span className="text-sm text-muted-foreground line-through">₹{p.price_original}</span>}
            </>
          ) : (
            <span className="text-sm font-medium text-primary">Contact for price</span>
          )}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">View Details →</span>
          {p.offer_badge && <Flame className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />}
        </div>
      </Link>
    </motion.div>
  );
});

ProductCard.displayName = "CategoryProductCard";

const CardSkeleton = () => (
  <div className="glass-card p-7">
    <div className="flex items-center gap-4 mb-5">
      <Skeleton className="w-14 h-14 rounded-2xl" />
    </div>
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <Skeleton className="h-4 w-1/4 mb-4" />
    <Skeleton className="h-6 w-1/3" />
  </div>
);

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
      const { data: cat } = await supabase.from("categories").select("name").eq("slug", slug || "").maybeSingle();
      if (cat) setCategoryName(cat.name);
    }

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const order = getOrderBy(sort);

    const { data: prods, count } = await supabase
      .from("products")
      .select("id, name, slug, description, price_original, price_discounted, duration, logo_url, color, offer_badge, categories!inner(name, slug)", { count: "exact" })
      .eq("categories.slug", slug || "")
      .eq("is_active", true)
      .order(order.column, { ascending: order.ascending })
      .range(from, to);

    const newProducts = prods ?? [];
    if (isInitial) setProducts(newProducts); else setProducts(prev => [...prev, ...newProducts]);
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

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "price_low", label: "Price: Low → High" },
    { value: "price_high", label: "Price: High → Low" },
    { value: "name", label: "Name A–Z" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <Link to="/categories" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">← All Categories</Link>
            <h1 className="section-title !mt-5">{categoryName}</h1>
            <p className="section-subtitle !mt-2">{loading ? "Loading..." : `${totalCount} subscriptions available at massive discounts`}</p>
          </motion.div>

          {!loading && products.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2.5 mb-10 flex-wrap">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mr-1">Sort:</span>
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { if (opt.value !== sortBy) { setSortBy(opt.value); pageRef.current = 0; } }}
                  className={`text-xs px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    sortBy === opt.value ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
              </div>

              <div ref={sentinelRef} className="h-4" />

              {loadingMore && (
                <div className="flex justify-center py-10">
                  <div className="w-6 h-6 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!hasMore && products.length > 0 && (
                <p className="text-center text-sm text-muted-foreground py-10">You've seen all products in this category</p>
              )}
            </>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-24">
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

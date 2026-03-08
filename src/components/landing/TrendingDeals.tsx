import { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, ArrowRight, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import ProductLogo from "@/components/ProductLogo";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCard = memo(({ p, i }: { p: any; i: number }) => {
  const discount = p.price_original > 0
    ? Math.round(((p.price_original - p.price_discounted) / p.price_original) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: i * 0.04, type: "spring", damping: 25, stiffness: 120 }}
    >
      <Link to={`/product/${p.slug}`} className="glass-card p-6 block group relative overflow-hidden h-full">
        <div className="absolute top-4 right-4 z-10">
          {p.offer_badge ? (
            <Badge className="bg-accent text-accent-foreground font-semibold text-[10px] shadow-sm">{p.offer_badge}</Badge>
          ) : discount > 0 ? (
            <Badge className="bg-accent text-accent-foreground font-semibold text-[10px] shadow-sm">{discount}% OFF</Badge>
          ) : (
            <Badge className="bg-primary/10 text-primary font-semibold text-[10px] border border-primary/20">Trending</Badge>
          )}
        </div>

        <div className="mb-5 group-hover:scale-105 transition-transform duration-300 will-change-transform">
          <ProductLogo name={p.name} logoUrl={p.logo_url} color={p.color} />
        </div>

        <h3 className="font-display font-semibold text-foreground text-base group-hover:text-primary transition-colors duration-200 tracking-tight">{p.name}</h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">{p.description}</p>

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

        <div className="mt-5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
          View Details →
        </div>
      </Link>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

const CardSkeleton = () => (
  <div className="glass-card p-6 h-full">
    <Skeleton className="w-12 h-12 rounded-2xl mb-5" />
    <Skeleton className="h-5 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <Skeleton className="h-4 w-1/3 mb-4" />
    <Skeleton className="h-6 w-1/2" />
  </div>
);

const TrendingDeals = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, description, price_original, price_discounted, duration, logo_url, color, offer_badge")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(8);
        if (error) throw error;
        setProducts(data ?? []);
      } catch (e) {
        console.error("Failed to fetch trending deals:", e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/3 rounded-full blur-[160px] pointer-events-none" />

      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25 }}
          className="flex items-end justify-between mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-accent" />
              <span className="section-eyebrow text-accent">Trending Now</span>
            </div>
            <h2 className="section-title !mt-0">Trending Deals</h2>
            <p className="section-subtitle !mt-2">Our most popular subscriptions this week</p>
          </div>
          <Link to="/categories" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            : products.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)
          }
        </div>

        <div className="sm:hidden mt-10 text-center">
          <Link to="/categories" className="btn-primary-gradient inline-flex items-center gap-2 text-sm">
            View All Deals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingDeals;

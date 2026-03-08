import { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { queryPublic } from "@/lib/supabaseRest";
import ProductLogo from "@/components/ProductLogo";
import { credEase, staggerContainer } from "@/components/animations/CredAnimations";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: credEase, delay: i * 0.06 },
  }),
};

const ProductCard = memo(({ p, i }: { p: any; i: number }) => {
  const discount = p.price_original > 0
    ? Math.round(((p.price_original - p.price_discounted) / p.price_original) * 100)
    : 0;

  return (
    <motion.div variants={cardVariants} custom={i}>
      <Link to={`/product/${p.slug}`} className="glass-card p-6 block group relative h-full hover-lift">
        {discount > 0 && (
          <span className="absolute top-4 right-4 text-[11px] font-medium text-accent font-body">
            {discount}% off
          </span>
        )}

        <div className="mb-5 group-hover:scale-105 transition-transform duration-500 will-change-transform">
          <ProductLogo name={p.name} logoUrl={p.logo_url} color={p.color} />
        </div>

        <h3 className="font-body font-semibold text-foreground text-sm tracking-tight group-hover:text-accent transition-colors duration-300">
          {p.name}
        </h3>
        <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed line-clamp-2 font-body">
          {p.description}
        </p>

        <div className="flex items-baseline gap-2.5 mt-5">
          <span className="text-lg font-body font-bold text-foreground">₹{p.price_discounted}</span>
          {p.price_original > p.price_discounted && (
            <span className="text-xs text-muted-foreground line-through font-body">₹{p.price_original}</span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 font-body">
          View details <ArrowRight className="w-3 h-3" />
        </div>
      </Link>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

const CardSkeleton = () => (
  <div className="glass-card p-6 h-full">
    <div className="w-12 h-12 rounded-xl bg-muted animate-shimmer mb-5" />
    <div className="h-4 w-3/4 bg-muted rounded animate-shimmer mb-3" />
    <div className="h-3 w-full bg-muted rounded animate-shimmer mb-2" />
    <div className="h-3 w-2/3 bg-muted rounded animate-shimmer mb-5" />
    <div className="h-5 w-1/3 bg-muted rounded animate-shimmer" />
  </div>
);

const container = staggerContainer(0.06);

const TrendingDeals = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data, error } = await queryPublic({
          table: "products",
          select: "id,name,slug,description,price_original,price_discounted,duration,logo_url,color,offer_badge",
          filters: { is_active: "eq.true" },
          order: "created_at.desc",
          limit: 8,
        });
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
    <section className="section-padding relative overflow-hidden">
      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: credEase }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <span className="section-eyebrow">Trending</span>
            <h2 className="section-title !mt-4">popular this week</h2>
          </div>
          <Link
            to="/categories"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group font-body"
          >
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            : products.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)
          }
        </motion.div>

        <div className="sm:hidden mt-12 text-center">
          <Link to="/categories" className="btn-primary !text-sm">
            View All Deals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingDeals;

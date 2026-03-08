import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, ArrowRight, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import ProductLogo from "@/components/ProductLogo";

const TrendingDeals = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      const { data } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(8);
      setProducts(data ?? []);
      setLoading(false);
    };
    fetchTrending();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-background">
        <div className="container-tight">
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-accent" />
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Trending Now</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              🔥 Trending Deals
            </h2>
            <p className="text-muted-foreground mt-2">Our most popular subscriptions this week</p>
          </div>
          <Link
            to="/categories"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p, i) => {
            const discount = p.price_original > 0
              ? Math.round(((p.price_original - p.price_discounted) / p.price_original) * 100)
              : 0;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/product/${p.slug}`}
                  className="glass-card p-5 block group relative overflow-hidden h-full"
                >
                  {/* Trending badge */}
                  <div className="absolute top-3 right-3 z-10">
                    {p.offer_badge ? (
                      <Badge className="bg-accent text-accent-foreground font-semibold text-[10px] shadow-sm">
                        {p.offer_badge}
                      </Badge>
                    ) : discount > 0 ? (
                      <Badge className="bg-accent text-accent-foreground font-semibold text-[10px] shadow-sm">
                        {discount}% OFF
                      </Badge>
                    ) : (
                      <Badge className="bg-primary/15 text-primary font-semibold text-[10px]">
                        Trending
                      </Badge>
                    )}
                  </div>

                  {/* Logo */}
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ProductLogo name={p.name} logoUrl={p.logo_url} color={p.color} />
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-semibold text-foreground text-base group-hover:text-primary transition-colors duration-200">
                    {p.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                    {p.description}
                  </p>

                  {/* Duration */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{p.duration}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-3">
                    {p.price_discounted > 0 ? (
                      <>
                        <span className="text-lg font-display font-bold text-foreground">₹{p.price_discounted}</span>
                        {p.price_original > 0 && (
                          <span className="text-xs text-muted-foreground line-through">₹{p.price_original}</span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm font-medium text-primary">Contact for price</span>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-4 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    View Details →
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile view all */}
        <div className="sm:hidden mt-8 text-center">
          <Link to="/categories" className="btn-primary-gradient inline-flex items-center gap-2 text-sm">
            View All Deals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingDeals;

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Heart, Package, X, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import SEOHead from "@/components/SEOHead";

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from("wishlist")
      .select("*, products(id, name, slug, logo_url, color, price_original, price_discounted, description, duration, delivery)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setWishlist(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const removeFromWishlist = async (wishlistId: string) => {
    const { error } = await supabase.from("wishlist").delete().eq("id", wishlistId);
    if (error) { toast.error("Failed to remove"); return; }
    setWishlist((prev) => prev.filter((w) => w.id !== wishlistId));
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (item: any) => {
    if (!item.products) return;
    addItem({
      id: item.products.id,
      name: item.products.name,
      price: item.products.price_discounted,
      originalPrice: item.products.price_original,
      image: item.products.logo_url || "",
      duration: item.products.duration || "1 Year",
      delivery: item.products.delivery || "WhatsApp (< 5 min)",
    });
    toast.success("Added to cart");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="My Wishlist — Lightning Deals" description="Your saved products and deals" />
      <Navbar />
      <main className="pt-28 pb-20 px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="section-eyebrow mb-3">My Wishlist</p>
          <h1 className="font-display text-foreground mb-2">saved deals</h1>
          <p className="text-muted-foreground font-body mb-10">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
          </p>

          {wishlist.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2 font-body text-lg">Your wishlist is empty</p>
              <p className="text-sm text-muted-foreground mb-8 font-body">Save products you love and come back when you're ready</p>
              <Link to="/categories" className="btn-primary">Browse Deals</Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wishlist.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-card p-5 group flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <Link to={`/product/${item.products?.slug}`} className="flex items-center gap-3 flex-1 min-w-0">
                      {item.products?.logo_url ? (
                        <img src={item.products.logo_url} alt="" className="w-12 h-12 rounded-xl object-contain bg-secondary p-2 shrink-0" loading="lazy" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-body font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                          {item.products?.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-body line-clamp-1 mt-0.5">{item.products?.description}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-display text-xl text-foreground">₹{item.products?.price_discounted}</span>
                    {item.products?.price_original > item.products?.price_discounted && (
                      <>
                        <span className="text-sm text-muted-foreground line-through font-body">₹{item.products?.price_original}</span>
                        <span className="text-xs text-accent font-semibold font-body">
                          {Math.round(((item.products.price_original - item.products.price_discounted) / item.products.price_original) * 100)}% off
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 gap-2 btn-primary-gradient text-sm"
                      size="sm"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                    </Button>
                    <Link to={`/product/${item.products?.slug}`}>
                      <Button variant="outline" size="sm" className="gap-1 border-border text-muted-foreground hover:text-foreground rounded-full">
                        View <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Wishlist;

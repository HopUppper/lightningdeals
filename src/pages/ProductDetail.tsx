import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Shield, Zap, Clock, Star, Check, MessageCircle, Heart, ArrowLeft, GitCompareArrows } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import CountdownTimer from "@/components/CountdownTimer";
import ProductLogo from "@/components/ProductLogo";
import { useCompare } from "@/contexts/CompareContext";

const WHATSAPP_NUMBER = "917695956938";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        let { data } = await supabase
          .from("products")
          .select("*, categories(name, slug)")
          .eq("slug", id || "")
          .eq("is_active", true)
          .maybeSingle();

        if (!data) {
          const res = await supabase
            .from("products")
            .select("*, categories(name, slug)")
            .eq("id", id || "")
            .eq("is_active", true)
            .maybeSingle();
          data = res.data;
        }

        setProduct(data);

        if (data) {
          // Fetch reviews
          const { data: reviewsData } = await supabase
            .from("reviews").select("*, profiles(name)").eq("product_id", data.id).order("created_at", { ascending: false });
          setReviews(reviewsData ?? []);

          // Check wishlist
          if (user) {
            const { data: wl } = await supabase
              .from("wishlist").select("id").eq("user_id", user.id).eq("product_id", data.id).maybeSingle();
            setWishlisted(!!wl);
          }

          // Fetch related products from same category
          if (data.category_id) {
            const { data: related } = await supabase
              .from("products")
              .select("id, name, slug, description, price_original, price_discounted, duration, logo_url, color, offer_badge")
              .eq("category_id", data.category_id)
              .eq("is_active", true)
              .neq("id", data.id)
              .limit(4);
            setRelatedProducts(related ?? []);
          }
        }
      } catch (e) {
        console.error("Failed to fetch product:", e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, user]);

  const toggleWishlist = useCallback(async () => {
    if (!user) { toast.error("Please login to save to wishlist"); return; }
    if (!product) return;
    setWishlistLoading(true);
    try {
      if (wishlisted) {
        await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", product.id);
        setWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await supabase.from("wishlist").insert({ user_id: user.id, product_id: product.id });
        setWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch { toast.error("Failed to update wishlist"); }
    finally { setWishlistLoading(false); }
  }, [user, product, wishlisted]);

  const submitReview = async () => {
    if (!user) { toast.error("Please login to leave a review"); return; }
    if (!product) return;
    setSubmittingReview(true);
    const { error } = await supabase.from("reviews").upsert({
      user_id: user.id,
      product_id: product.id,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    }, { onConflict: "user_id,product_id" });
    if (error) { toast.error("Failed to submit review"); setSubmittingReview(false); return; }
    const { data } = await supabase.from("reviews").select("*, profiles(name)").eq("product_id", product.id).order("created_at", { ascending: false });
    setReviews(data ?? []);
    setReviewForm({ rating: 5, comment: "" });
    setSubmittingReview(false);
    toast.success("Review submitted!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-36 flex justify-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-36 text-center">
          <h2 className="font-display text-foreground">Product not found</h2>
          <Link to="/categories" className="text-primary hover:text-primary/80 mt-4 inline-block text-sm">Browse all products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const savings = product.price_original > 0
    ? Math.round(((product.price_original - product.price_discounted) / product.price_original) * 100)
    : 0;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleAddToCart = () => {
    addItem({
      id: product.id, name: product.name, price: product.price_discounted,
      original: product.price_original, color: product.color || "", logoUrl: product.logo_url || "",
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Hello Lightning Deals! ⚡\n\nI would like to order:\n\n📦 *Product:* ${product.name}\n⏱ *Duration:* ${product.duration || "1 Year"}\n💰 *Price:* ₹${product.price_discounted}\n🔗 *Link:* ${window.location.href}\n\nPlease guide me with the payment process. 🙏`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const features: string[] = product.features || [];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.name} — Lightning Deals | ₹${product.price_discounted}`}
        description={product.description || `Get ${product.name} at ₹${product.price_discounted} (${savings}% off). Instant delivery via WhatsApp.`}
        keywords={`${product.name}, premium subscription, discount, Lightning Deals`}
        url={`${window.location.origin}/products/${product.slug}`}
        ogImage={product.logo_url || undefined}
      />
      <Navbar />
      <div className="pt-28 section-padding">
        <div className="container-tight">
          <Link to="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Categories
          </Link>

          <div className="grid lg:grid-cols-2 gap-16 mt-10">
            {/* Left - Product Image */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="glass-card p-16 flex items-center justify-center relative overflow-hidden aspect-square">
                {savings > 0 && (
                  <span className="absolute top-4 right-4 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                    {savings}% off
                  </span>
                )}
                <ProductLogo name={product.name} logoUrl={product.logo_url} color={product.color} size="w-36 h-36" fontSize="text-6xl" />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: Zap, label: "Instant Delivery" },
                  { icon: Shield, label: "100% Secure" },
                  { icon: Clock, label: "24/7 Support" },
                ].map((t) => (
                  <div key={t.label} className="glass-card p-4 text-center">
                    <t.icon className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
                    <span className="text-[11px] text-muted-foreground">{t.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              {product.categories?.name && (
                <Link to={`/categories/${product.categories.slug}`} className="text-xs text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                  {product.categories.name}
                </Link>
              )}
              <h1 className="!text-3xl sm:!text-4xl font-display text-foreground mt-2">{product.name}</h1>
              {avgRating && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(Number(avgRating)) ? "fill-accent text-accent" : "text-muted"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{avgRating} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
                </div>
              )}
              <p className="text-muted-foreground mt-5 leading-relaxed">{product.long_description || product.description}</p>
              <div className="flex items-baseline gap-4 mt-8">
                <span className="text-4xl font-display text-foreground">₹{product.price_discounted}</span>
                {product.price_original > product.price_discounted && (
                  <span className="text-lg text-muted-foreground line-through">₹{product.price_original}</span>
                )}
              </div>
              {product.offer_label && <p className="mt-3 text-sm font-medium text-accent">{product.offer_label}</p>}
              {product.offer_expires_at && <div className="mt-4"><CountdownTimer expiresAt={product.offer_expires_at} /></div>}
              <div className="flex gap-6 mt-6 text-sm text-muted-foreground">
                <span><strong className="text-foreground">Duration:</strong> {product.duration || "1 Year"}</span>
                <span><strong className="text-foreground">Delivery:</strong> {product.delivery || "WhatsApp"}</span>
              </div>

              <div className="flex gap-3 mt-10">
                <button onClick={handleAddToCart} className="btn-primary flex-1 gap-2">
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <button onClick={handleWhatsAppOrder} className="btn-gold flex-1 gap-2">
                  <MessageCircle className="w-4 h-4" /> Buy via WhatsApp
                </button>
                <button
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                  className={`p-4 rounded-full border transition-all duration-300 ${
                    wishlisted ? "bg-accent/10 border-accent/30 text-accent" : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                  }`}
                  title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? "fill-accent" : ""}`} />
                </button>
              </div>

              {features.length > 0 && (
                <div className="mt-12">
                  <h3 className="font-semibold text-foreground mb-5">Features Included</h3>
                  <div className="space-y-3">
                    {features.map((f) => (
                      <div key={f} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border border-accent/30 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-24 border-t border-border pt-16">
              <div className="mb-10">
                <span className="section-eyebrow">Similar</span>
                <h2 className="section-title !mt-3">You might also like</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProducts.map((p, i) => {
                  const disc = p.price_original > 0
                    ? Math.round(((p.price_original - p.price_discounted) / p.price_original) * 100)
                    : 0;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link to={`/product/${p.slug}`} className="glass-card p-6 block group h-full hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="group-hover:scale-105 transition-transform">
                            <ProductLogo name={p.name} logoUrl={p.logo_url} color={p.color} size="w-12 h-12" fontSize="text-lg" />
                          </div>
                          {disc > 0 && (
                            <span className="text-[10px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">{disc}% off</span>
                          )}
                        </div>
                        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors truncate">{p.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="font-display font-bold text-foreground">₹{p.price_discounted}</span>
                          {p.price_original > p.price_discounted && (
                            <span className="text-xs text-muted-foreground line-through">₹{p.price_original}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[11px] text-muted-foreground">{p.duration}</span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mt-24 border-t border-border pt-16">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="section-eyebrow">Reviews</span>
                <h2 className="section-title !mt-3">Customer Reviews</h2>
              </div>
              {avgRating && (
                <div className="text-right">
                  <p className="text-3xl font-display text-foreground">{avgRating}</p>
                  <p className="text-xs text-muted-foreground">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
                </div>
              )}
            </div>

            {user && (
              <div className="glass-card p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-4 text-sm">Write a Review</h3>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} onClick={() => setReviewForm((f) => ({ ...f, rating: s }))} className="p-1">
                      <Star className={`w-5 h-5 transition-colors ${s <= reviewForm.rating ? "fill-accent text-accent" : "text-muted hover:text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                  placeholder="Share your experience..."
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none h-24"
                />
                <button onClick={submitReview} disabled={submittingReview} className="btn-primary !py-2.5 !px-6 !text-sm mt-3">
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            )}

            {reviews.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="glass-card p-6">
                    <div className="flex gap-0.5 mb-3">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "fill-accent text-accent" : "text-muted"}`} />
                      ))}
                    </div>
                    {r.comment && <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{r.comment}"</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{r.profiles?.name || "User"}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <Star className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No reviews yet. {user ? "Be the first to review!" : "Login to leave a review."}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;

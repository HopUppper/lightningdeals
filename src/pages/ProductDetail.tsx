import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Shield, Zap, Clock, Star, Check, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import ProductOfferBadge from "@/components/ProductOfferBadge";
import SEOHead from "@/components/SEOHead";
import CountdownTimer from "@/components/CountdownTimer";
import ProductLogo from "@/components/ProductLogo";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
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
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-36 flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-36 text-center">
          <h1 className="font-display font-bold text-foreground">Product not found</h1>
          <Link to="/categories" className="text-primary hover:underline mt-4 inline-block text-sm">Browse all products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const savings = product.price_original > 0
    ? Math.round(((product.price_original - product.price_discounted) / product.price_original) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price_discounted,
      original: product.price_original,
      color: product.color || "",
      logoUrl: product.logo_url || "",
    });
    toast.success(`${product.name} added to cart!`);
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
          <Link to="/categories" className="text-sm text-primary hover:underline font-medium">← Back to Categories</Link>

          <div className="grid lg:grid-cols-2 gap-16 mt-10">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card p-16 flex items-center justify-center relative overflow-hidden">
                <ProductOfferBadge product={product} fallbackDiscount={savings} />
                <ProductLogo name={product.name} logoUrl={product.logo_url} color={product.color} size="w-36 h-36" fontSize="text-6xl" />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { icon: Zap, label: "Instant Delivery" },
                  { icon: Shield, label: "100% Secure" },
                  { icon: Clock, label: "24/7 Support" },
                ].map((t) => (
                  <div key={t.label} className="glass-card p-4 text-center">
                    <t.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <span className="text-xs text-muted-foreground font-medium">{t.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="!text-3xl sm:!text-4xl font-display font-bold text-foreground tracking-tight">{product.name}</h1>
              <p className="text-muted-foreground mt-4 leading-relaxed text-base">{product.long_description || product.description}</p>

              <div className="flex items-baseline gap-4 mt-8">
                <span className="text-4xl sm:text-5xl font-display font-bold text-foreground tracking-tight">₹{product.price_discounted}</span>
                <span className="text-lg text-muted-foreground line-through">₹{product.price_original}</span>
                {savings > 0 && <span className="text-sm font-semibold text-primary">Save {savings}%</span>}
              </div>

              {product.offer_label && (
                <p className="mt-3 text-sm font-medium text-accent">{product.offer_label}</p>
              )}

              {product.offer_expires_at && (
                <div className="mt-4">
                  <CountdownTimer expiresAt={product.offer_expires_at} />
                </div>
              )}

              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-accent-foreground font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> Only 12 subscriptions left today
                </span>
              </div>

              <div className="flex gap-8 mt-8 text-sm text-muted-foreground">
                <span><strong className="text-foreground">Duration:</strong> {product.duration || "1 Year"}</span>
                <span><strong className="text-foreground">Delivery:</strong> {product.delivery || "WhatsApp"}</span>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary-gradient w-full mt-10 flex items-center justify-center gap-2.5 text-base py-4"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              {features.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-display font-semibold text-foreground mb-5 text-lg">Features Included</h3>
                  <div className="space-y-3.5">
                    {features.map((f) => (
                      <div key={f} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Reviews */}
          <div className="mt-24">
            <h2 className="font-display font-bold text-foreground mb-10">Customer Reviews</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { name: "Ankit R.", text: `Best price for ${product.name} I've found anywhere. Delivered in 2 minutes!` },
                { name: "Meera S.", text: "Very professional service. Works perfectly and saved me a lot of money." },
              ].map((r) => (
                <div key={r.name} className="glass-card p-7">
                  <div className="flex gap-0.5 mb-4">
                    {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 fill-accent text-accent" />)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{r.text}"</p>
                  <span className="text-sm font-semibold text-foreground">{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;

import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import ProductLogo from "@/components/ProductLogo";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  color: string | null;
  price_discounted: number;
  price_original: number;
  category_name: string | null;
}

const GlobalSearch = memo(({ onClose }: { onClose?: () => void }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [trendingProducts, setTrendingProducts] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && trendingProducts.length === 0) {
      supabase
        .from("products")
        .select("id, name, slug, description, logo_url, color, price_discounted, price_original, categories(name)")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(6)
        .then(({ data }) => {
          if (data) {
            setTrendingProducts(
              data.map((p: any) => ({ ...p, category_name: p.categories?.name ?? null }))
            );
          }
        });
    }
  }, [isOpen, trendingProducts.length]);

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    const term = `%${searchQuery.trim()}%`;
    const { data } = await supabase
      .from("products")
      .select("id, name, slug, description, logo_url, color, price_discounted, price_original, categories(name)")
      .eq("is_active", true)
      .or(`name.ilike.${term},description.ilike.${term}`)
      .order("name")
      .limit(8);
    setResults((data ?? []).map((p: any) => ({ ...p, category_name: p.categories?.name ?? null })));
    setSelectedIndex(-1);
    setLoading(false);
  }, []);

  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => searchProducts(value), 200);
    },
    [searchProducts]
  );

  const handleSelect = useCallback(
    (slug: string) => { setIsOpen(false); setQuery(""); setResults([]); onClose?.(); navigate(`/product/${slug}`); },
    [navigate, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = query.trim() ? results : trendingProducts;
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, items.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, -1)); }
      else if (e.key === "Enter" && selectedIndex >= 0 && items[selectedIndex]) { e.preventDefault(); handleSelect(items[selectedIndex].slug); }
      else if (e.key === "Escape") { setIsOpen(false); onClose?.(); }
    },
    [query, results, trendingProducts, selectedIndex, handleSelect, onClose]
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const displayResults = query.trim() ? results : trendingProducts;
  const showNoResults = query.trim() && !loading && results.length === 0;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="flex items-center gap-2 h-8 px-3 rounded-full border border-border bg-secondary/50 hover:bg-secondary hover:border-muted-foreground/20 text-muted-foreground transition-all duration-300 text-sm focus:outline-none"
      >
        <Search className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden lg:inline text-xs text-muted-foreground/60">Search...</span>
        <kbd className="hidden lg:inline-flex items-center px-1 py-px rounded text-[9px] font-mono text-muted-foreground/40 bg-background border border-border ml-1">⌘K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[max(20px,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 w-[min(520px,calc(100vw-32px))] z-[101] bg-card border border-border rounded-xl shadow-[var(--shadow-elevated)] overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none font-body"
                  autoComplete="off"
                />
                {query && (
                  <button onClick={() => { setQuery(""); setResults([]); }} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-secondary hover:bg-muted transition-colors font-body">
                  ESC
                </button>
              </div>

              <div className="max-h-[360px] overflow-y-auto">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {!loading && displayResults.length > 0 && (
                  <div className="py-2">
                    {!query.trim() && (
                      <p className="px-5 py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 font-body">
                        <TrendingUp className="w-3 h-3" /> Trending
                      </p>
                    )}
                    {displayResults.map((product, i) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelect(product.slug)}
                        className={`w-full flex items-center gap-3.5 px-5 py-3 text-left transition-colors duration-200 ${
                          selectedIndex === i ? "bg-secondary text-foreground" : "hover:bg-secondary/60 text-foreground"
                        }`}
                      >
                        <ProductLogo name={product.name} logoUrl={product.logo_url} color={product.color} size="w-8 h-8" fontSize="text-xs" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate font-body">{product.name}</p>
                          {product.category_name && <p className="text-xs text-muted-foreground truncate font-body">{product.category_name}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold font-body">₹{product.price_discounted}</p>
                          {product.price_original > product.price_discounted && (
                            <p className="text-[10px] text-muted-foreground line-through font-body">₹{product.price_original}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {showNoResults && (
                  <div className="py-10 px-5 text-center">
                    <p className="text-sm text-muted-foreground font-body">No results for "{query}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

GlobalSearch.displayName = "GlobalSearch";
export default GlobalSearch;

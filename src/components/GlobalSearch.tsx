import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, TrendingUp, Sparkles, Palette, Code2, BarChart3 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import ProductLogo from "@/components/ProductLogo";

const TRENDING_TAGS = [
  { label: "🔥 Trending", query: "" },
  { label: "⚡ AI Tools", query: "AI" },
  { label: "🎨 Design Tools", query: "Design" },
  { label: "🚀 Developer Tools", query: "Developer" },
  { label: "📈 Marketing Tools", query: "Marketing" },
];

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

  // Fetch trending on first open
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
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const term = `%${searchQuery.trim()}%`;

    const { data } = await supabase
      .from("products")
      .select("id, name, slug, description, logo_url, color, price_discounted, price_original, categories(name)")
      .eq("is_active", true)
      .or(`name.ilike.${term},description.ilike.${term}`)
      .order("name")
      .limit(8);

    const mapped = (data ?? []).map((p: any) => ({
      ...p,
      category_name: p.categories?.name ?? null,
    }));

    setResults(mapped);
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
    (slug: string) => {
      setIsOpen(false);
      setQuery("");
      setResults([]);
      onClose?.();
      navigate(`/product/${slug}`);
    },
    [navigate, onClose]
  );

  const handleTagClick = useCallback(
    (tagQuery: string) => {
      if (tagQuery) {
        setQuery(tagQuery);
        searchProducts(tagQuery);
      }
    },
    [searchProducts]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = query.trim() ? results : trendingProducts;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter" && selectedIndex >= 0 && items[selectedIndex]) {
        e.preventDefault();
        handleSelect(items[selectedIndex].slug);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        onClose?.();
      }
    },
    [query, results, trendingProducts, selectedIndex, handleSelect, onClose]
  );

  // Click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const displayResults = query.trim() ? results : trendingProducts;
  const showNoResults = query.trim() && !loading && results.length === 0;

  return (
    <div ref={containerRef} className="relative">
      {/* Search trigger button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="flex items-center gap-2 h-9 px-2.5 lg:px-3 rounded-lg border border-border/50 bg-secondary/40 hover:bg-secondary/80 hover:border-border text-muted-foreground transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <Search className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden lg:inline text-xs text-muted-foreground/70">Search...</span>
        <kbd className="hidden lg:inline-flex items-center px-1 py-px rounded text-[9px] font-mono text-muted-foreground/50 bg-background/60 border border-border/40 ml-1">
          ⌘K
        </kbd>
      </button>

      {/* Search overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
              onClick={() => setIsOpen(false)}
            />

            {/* Search panel */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[max(16px,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 w-[min(560px,calc(100vw-32px))] z-[101] bg-card border border-border/60 rounded-2xl shadow-[var(--shadow-elevated)] overflow-hidden"
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products, categories, tools..."
                  className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
                  autoComplete="off"
                />
                {query && (
                  <button onClick={() => { setQuery(""); setResults([]); }} className="p-1 rounded-lg hover:bg-secondary/60 transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-xs text-muted-foreground px-2 py-1 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors">
                  ESC
                </button>
              </div>

              {/* Trending tags */}
              {!query.trim() && (
                <div className="px-5 py-3 border-b border-border/30 flex items-center gap-2 flex-wrap">
                  {TRENDING_TAGS.map((tag) => (
                    <button
                      key={tag.label}
                      onClick={() => handleTagClick(tag.query || "")}
                      className="text-xs px-3 py-1.5 rounded-full bg-secondary/70 hover:bg-primary/10 hover:text-primary text-muted-foreground font-medium transition-all duration-200"
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Results */}
              <div className="max-h-[360px] overflow-y-auto">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {!loading && displayResults.length > 0 && (
                  <div className="py-2">
                    {!query.trim() && (
                      <p className="px-5 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3" /> Trending Now
                      </p>
                    )}
                    {query.trim() && (
                      <p className="px-5 py-2 text-xs font-medium text-muted-foreground">
                        {results.length} result{results.length !== 1 ? "s" : ""}
                      </p>
                    )}
                    {displayResults.map((product, i) => (
                      <motion.button
                        key={product.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}
                        onClick={() => handleSelect(product.slug)}
                        className={`w-full flex items-center gap-3.5 px-5 py-3 text-left transition-colors duration-150 ${
                          selectedIndex === i ? "bg-primary/8 text-foreground" : "hover:bg-secondary/60 text-foreground"
                        }`}
                      >
                        <ProductLogo
                          name={product.name}
                          logoUrl={product.logo_url}
                          color={product.color}
                          size="w-9 h-9"
                          fontSize="text-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          {product.category_name && (
                            <p className="text-xs text-muted-foreground truncate">{product.category_name}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold">₹{product.price_discounted}</p>
                          {product.price_original > product.price_discounted && (
                            <p className="text-[10px] text-muted-foreground line-through">₹{product.price_original}</p>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {showNoResults && (
                  <div className="py-10 px-5 text-center">
                    <p className="text-sm text-muted-foreground mb-4">No results found for "{query}"</p>
                    <p className="text-xs text-muted-foreground mb-3">Try searching for:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["AI tools", "Design software", "Automation tools", "Developer tools"].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleInputChange(s)}
                          className="text-xs px-3 py-1.5 rounded-full bg-secondary/70 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
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

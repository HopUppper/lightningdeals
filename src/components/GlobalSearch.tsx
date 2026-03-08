import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, TrendingUp, Tag, ArrowRight } from "lucide-react";
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

interface CategoryResult {
  id: string;
  name: string;
  slug: string;
}

const GlobalSearch = memo(({ onClose }: { onClose?: () => void }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [categoryResults, setCategoryResults] = useState<CategoryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [trendingProducts, setTrendingProducts] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ld-recent-searches");
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {}
  }, []);

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("ld-recent-searches", JSON.stringify(updated));
  };

  useEffect(() => {
    if (isOpen && trendingProducts.length === 0) {
      supabase
        .from("products")
        .select("id, name, slug, description, logo_url, color, price_discounted, price_original, categories(name)")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(5)
        .then(({ data }) => {
          if (data) setTrendingProducts(data.map((p: any) => ({ ...p, category_name: p.categories?.name ?? null })));
        });
    }
  }, [isOpen, trendingProducts.length]);

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) { setResults([]); setCategoryResults([]); setLoading(false); return; }
    setLoading(true);
    const term = `%${searchQuery.trim()}%`;

    const [prodRes, catRes] = await Promise.all([
      supabase
        .from("products")
        .select("id, name, slug, description, logo_url, color, price_discounted, price_original, categories(name)")
        .eq("is_active", true)
        .or(`name.ilike.${term},description.ilike.${term}`)
        .order("name")
        .limit(6),
      supabase
        .from("categories")
        .select("id, name, slug")
        .ilike("name", term)
        .limit(3),
    ]);

    setResults((prodRes.data ?? []).map((p: any) => ({ ...p, category_name: p.categories?.name ?? null })));
    setCategoryResults(catRes.data ?? []);
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

  const handleSelectProduct = useCallback(
    (slug: string, name: string) => {
      saveRecentSearch(name);
      setIsOpen(false);
      setQuery("");
      setResults([]);
      setCategoryResults([]);
      onClose?.();
      navigate(`/product/${slug}`);
    },
    [navigate, onClose, recentSearches]
  );

  const handleSelectCategory = useCallback(
    (slug: string) => {
      setIsOpen(false);
      setQuery("");
      setResults([]);
      setCategoryResults([]);
      onClose?.();
      navigate(`/categories/${slug}`);
    },
    [navigate, onClose]
  );

  const handleRecentSearch = (term: string) => {
    setQuery(term);
    searchProducts(term);
  };

  const totalItems = query.trim() ? results.length + categoryResults.length : trendingProducts.length;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, totalItems - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, -1)); }
      else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        if (query.trim()) {
          if (selectedIndex < categoryResults.length) {
            handleSelectCategory(categoryResults[selectedIndex].slug);
          } else {
            const prodIdx = selectedIndex - categoryResults.length;
            if (results[prodIdx]) handleSelectProduct(results[prodIdx].slug, results[prodIdx].name);
          }
        } else {
          if (trendingProducts[selectedIndex]) handleSelectProduct(trendingProducts[selectedIndex].slug, trendingProducts[selectedIndex].name);
        }
      }
      else if (e.key === "Escape") { setIsOpen(false); onClose?.(); }
    },
    [query, results, categoryResults, trendingProducts, selectedIndex, totalItems, handleSelectProduct, handleSelectCategory, onClose]
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

  const showNoResults = query.trim() && !loading && results.length === 0 && categoryResults.length === 0;
  const showTrending = !query.trim() && trendingProducts.length > 0;
  const showRecent = !query.trim() && recentSearches.length > 0;

  let runningIndex = 0;

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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[max(20px,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 w-[min(560px,calc(100vw-32px))] z-[101] bg-card border border-border rounded-xl shadow-[var(--shadow-elevated)] overflow-hidden"
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products, categories..."
                  className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none font-body"
                  autoComplete="off"
                />
                {query && (
                  <button onClick={() => { setQuery(""); setResults([]); setCategoryResults([]); }} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-secondary hover:bg-muted transition-colors font-body">
                  ESC
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {!loading && (
                  <div className="py-2">
                    {/* Recent Searches */}
                    {showRecent && (
                      <>
                        <p className="px-5 py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider font-body">
                          Recent
                        </p>
                        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
                          {recentSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => handleRecentSearch(term)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors font-body"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Category matches */}
                    {query.trim() && categoryResults.length > 0 && (
                      <>
                        <p className="px-5 py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 font-body">
                          <Tag className="w-3 h-3" /> Categories
                        </p>
                        {categoryResults.map((cat) => {
                          const idx = runningIndex++;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => handleSelectCategory(cat.slug)}
                              className={`w-full flex items-center gap-3.5 px-5 py-3 text-left transition-colors duration-200 ${
                                selectedIndex === idx ? "bg-secondary text-foreground" : "hover:bg-secondary/60 text-foreground"
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                <Tag className="w-3.5 h-3.5 text-accent" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate font-body">{cat.name}</p>
                                <p className="text-xs text-muted-foreground font-body">Category</p>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          );
                        })}
                      </>
                    )}

                    {/* Product results / trending */}
                    {(query.trim() ? results.length > 0 : showTrending) && (
                      <>
                        <p className="px-5 py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 font-body">
                          {query.trim() ? (
                            <><Search className="w-3 h-3" /> Products</>
                          ) : (
                            <><TrendingUp className="w-3 h-3" /> Trending</>
                          )}
                        </p>
                        {(query.trim() ? results : trendingProducts).map((product) => {
                          const idx = query.trim() ? runningIndex++ : runningIndex++;
                          const disc = product.price_original > product.price_discounted
                            ? Math.round(((product.price_original - product.price_discounted) / product.price_original) * 100)
                            : 0;
                          return (
                            <button
                              key={product.id}
                              onClick={() => handleSelectProduct(product.slug, product.name)}
                              className={`w-full flex items-center gap-3.5 px-5 py-3 text-left transition-colors duration-200 ${
                                selectedIndex === idx ? "bg-secondary text-foreground" : "hover:bg-secondary/60 text-foreground"
                              }`}
                            >
                              <ProductLogo name={product.name} logoUrl={product.logo_url} color={product.color} size="w-8 h-8" fontSize="text-xs" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate font-body">{product.name}</p>
                                {product.category_name && <p className="text-xs text-muted-foreground truncate font-body">{product.category_name}</p>}
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm font-semibold font-body">₹{product.price_discounted}</p>
                                {disc > 0 && (
                                  <p className="text-[10px] text-accent font-medium font-body">{disc}% off</p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </>
                    )}

                    {showNoResults && (
                      <div className="py-10 px-5 text-center">
                        <p className="text-sm text-muted-foreground font-body">No results for "{query}"</p>
                        <p className="text-xs text-muted-foreground/60 mt-1 font-body">Try a different search term</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-5 py-2.5 border-t border-border flex items-center gap-4 text-[10px] text-muted-foreground/50 font-body">
                <span><kbd className="px-1 py-0.5 rounded bg-secondary text-[9px]">↑↓</kbd> Navigate</span>
                <span><kbd className="px-1 py-0.5 rounded bg-secondary text-[9px]">↵</kbd> Select</span>
                <span><kbd className="px-1 py-0.5 rounded bg-secondary text-[9px]">ESC</kbd> Close</span>
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

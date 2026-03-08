import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, Check, Minus, GitCompareArrows } from "lucide-react";
import { useCompare } from "@/contexts/CompareContext";
import ProductLogo from "@/components/ProductLogo";
import { Link } from "react-router-dom";

const CompareDrawer = () => {
  const { items, removeFromCompare, clearCompare, isOpen, setIsOpen } = useCompare();

  if (items.length === 0) return null;

  return (
    <>
      {/* Floating bar */}
      <AnimatePresence>
        {!isOpen && items.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-3 px-5 py-3 rounded-full bg-accent text-accent-foreground shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <GitCompareArrows className="w-4 h-4" />
              <span className="text-sm font-medium">Compare ({items.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full comparison drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[90]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[91] bg-card border-t border-border rounded-t-2xl max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <GitCompareArrows className="w-5 h-5 text-accent" />
                  <h2 className="font-display font-semibold text-foreground text-lg">Compare Products</h2>
                  <span className="text-xs text-muted-foreground">({items.length}/3)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={clearCompare} className="text-xs text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary">
                    Clear All
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-xs text-muted-foreground font-medium uppercase tracking-wider p-3 w-32">Feature</th>
                        {items.map((p) => (
                          <th key={p.id} className="p-3 min-w-[200px]">
                            <div className="glass-card p-4 text-center relative group">
                              <button
                                onClick={() => removeFromCompare(p.id)}
                                className="absolute top-2 right-2 p-1 rounded-full hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-3 h-3 text-muted-foreground" />
                              </button>
                              <ProductLogo name={p.name} logoUrl={p.logo_url} color={p.color} size="w-12 h-12 mx-auto" fontSize="text-lg" />
                              <Link to={`/product/${p.slug}`} onClick={() => setIsOpen(false)} className="block mt-3">
                                <p className="font-display font-semibold text-foreground text-sm hover:text-accent transition-colors">{p.name}</p>
                              </Link>
                              {p.category_name && <p className="text-[10px] text-muted-foreground mt-1">{p.category_name}</p>}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Price */}
                      <CompareRow label="Price">
                        {items.map((p) => (
                          <td key={p.id} className="p-3 text-center">
                            <span className="font-display font-bold text-foreground text-lg">₹{p.price_discounted}</span>
                            {p.price_original > p.price_discounted && (
                              <span className="text-xs text-muted-foreground line-through ml-2">₹{p.price_original}</span>
                            )}
                          </td>
                        ))}
                      </CompareRow>

                      {/* Savings */}
                      <CompareRow label="Savings">
                        {items.map((p) => {
                          const pct = p.price_original > 0 ? Math.round(((p.price_original - p.price_discounted) / p.price_original) * 100) : 0;
                          return (
                            <td key={p.id} className="p-3 text-center">
                              <span className="text-sm font-medium text-accent">{pct}% off</span>
                            </td>
                          );
                        })}
                      </CompareRow>

                      {/* Duration */}
                      <CompareRow label="Duration">
                        {items.map((p) => (
                          <td key={p.id} className="p-3 text-center text-sm text-muted-foreground">{p.duration || "1 Year"}</td>
                        ))}
                      </CompareRow>

                      {/* Delivery */}
                      <CompareRow label="Delivery">
                        {items.map((p) => (
                          <td key={p.id} className="p-3 text-center text-sm text-muted-foreground">{p.delivery || "WhatsApp"}</td>
                        ))}
                      </CompareRow>

                      {/* Features */}
                      <CompareRow label="Features">
                        {items.map((p) => (
                          <td key={p.id} className="p-3">
                            <div className="space-y-1.5">
                              {(p.features || []).slice(0, 5).map((f) => (
                                <div key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Check className="w-3 h-3 text-accent shrink-0" />
                                  <span className="truncate">{f}</span>
                                </div>
                              ))}
                              {(p.features || []).length === 0 && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Minus className="w-3 h-3" />
                                  <span>No details listed</span>
                                </div>
                              )}
                            </div>
                          </td>
                        ))}
                      </CompareRow>

                      {/* Action */}
                      <tr>
                        <td className="p-3" />
                        {items.map((p) => (
                          <td key={p.id} className="p-3 text-center">
                            <Link
                              to={`/product/${p.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="btn-gold !py-2.5 !px-5 !text-xs inline-flex"
                            >
                              View Details
                            </Link>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const CompareRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <tr className="border-t border-border/30">
    <td className="p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider align-top">{label}</td>
    {children}
  </tr>
);

export default CompareDrawer;

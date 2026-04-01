import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductImageUpload from "./ProductImageUpload";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProductForm {
  name: string;
  slug: string;
  description: string;
  long_description: string;
  price_original: number;
  price_discounted: number;
  buying_price: number;
  color: string;
  logo_url: string;
  duration: string;
  delivery: string;
  features: string;
  category_id: string;
  is_active: boolean;
  offer_badge: string;
  offer_label: string;
  offer_expires_at: string;
}

export const emptyForm: ProductForm = {
  name: "", slug: "", description: "", long_description: "",
  price_original: 0, price_discounted: 0, buying_price: 0, color: "#22c55e",
  logo_url: "", duration: "1 Year", delivery: "WhatsApp (< 5 min)",
  features: "", category_id: "", is_active: true,
  offer_badge: "", offer_label: "", offer_expires_at: "",
};

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ProductForm;
  setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
  editingId: string | null;
  categories: any[];
  onSave: () => void;
}

const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary";

const badgePresets = ["", "Limited Offer", "Hot Deal", "Best Seller", "New", "50% OFF", "80% OFF", "90% OFF"];

const ProductFormDialog = ({ open, onOpenChange, form, setForm, editingId, categories, onSave }: ProductFormDialogProps) => {
  const [aiLoading, setAiLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const autoSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : autoSlug(name),
    }));
  };

  const discountPercent = form.price_original > 0 && form.price_discounted > 0 && form.price_discounted < form.price_original
    ? Math.round(((form.price_original - form.price_discounted) / form.price_original) * 100)
    : 0;

  const generateAIDescription = async () => {
    if (!form.name) {
      toast.error("Enter a product name first");
      return;
    }
    setAiLoading(true);
    try {
      const categoryName = categories.find(c => c.id === form.category_id)?.name || "";
      const { data, error } = await supabase.functions.invoke("generate-product-description", {
        body: {
          productName: form.name,
          category: categoryName,
          priceOriginal: form.price_original,
          priceDiscounted: form.price_discounted,
          duration: form.duration,
          features: form.features,
        },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      setForm(prev => ({
        ...prev,
        description: data.short || prev.description,
        long_description: data.long || prev.long_description,
      }));
      toast.success("AI descriptions generated!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to generate descriptions");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{editingId ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Image Upload */}
          <ProductImageUpload
            value={form.logo_url}
            onChange={(url) => setForm((prev) => ({ ...prev, logo_url: url }))}
          />

          {/* Name & Slug */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Product Name *</label>
              <input name="name" value={form.name} onChange={handleNameChange} className={inputClass} placeholder="e.g. Netflix Premium" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Slug *</label>
              <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} placeholder="auto-generated" />
            </div>
          </div>

          {/* Description + AI Generate */}
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground">Short Description</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateAIDescription}
              disabled={aiLoading || !form.name}
              className="gap-1.5 h-7 text-xs"
            >
              {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {aiLoading ? "Generating..." : "AI Generate"}
            </Button>
          </div>
          <input name="description" value={form.description} onChange={handleChange} className={inputClass} placeholder="Brief one-liner about the product" />
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Detailed Description</label>
            <textarea name="long_description" value={form.long_description} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Full product details shown on the product page" />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Original Price (₹) *</label>
              <input name="price_original" type="number" value={form.price_original} onChange={handleChange} className={inputClass} min={0} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Discounted Price (₹) *</label>
              <input name="price_discounted" type="number" value={form.price_discounted} onChange={handleChange} className={inputClass} min={0} />
            </div>
          </div>
          {discountPercent > 0 && (
            <p className="text-xs text-primary">💰 {discountPercent}% discount</p>
          )}

          {/* Offer & Badge Section */}
          <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 space-y-3">
            <p className="text-xs font-semibold text-accent-foreground/80 uppercase tracking-wider">🏷️ Offer & Badge</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Badge</label>
                <select name="offer_badge" value={form.offer_badge} onChange={handleChange} className={inputClass}>
                  {badgePresets.map((b) => (
                    <option key={b} value={b}>{b || "None"}</option>
                  ))}
                </select>
                {discountPercent > 0 && !form.offer_badge && (
                  <button
                    type="button"
                    className="text-[10px] text-primary hover:underline mt-1"
                    onClick={() => setForm(prev => ({ ...prev, offer_badge: `${discountPercent}% OFF` }))}
                  >
                    Auto-set "{discountPercent}% OFF"
                  </button>
                )}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Label</label>
                <input name="offer_label" value={form.offer_label} onChange={handleChange} className={inputClass} placeholder="e.g. Flash Sale" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Offer Expires At</label>
              <input
                name="offer_expires_at"
                type="datetime-local"
                value={form.offer_expires_at}
                onChange={handleChange}
                className={inputClass}
              />
              {form.offer_expires_at && (
                <button
                  type="button"
                  className="text-[10px] text-destructive hover:underline mt-1"
                  onClick={() => setForm(prev => ({ ...prev, offer_expires_at: "" }))}
                >
                  Clear expiry
                </button>
              )}
            </div>
            {/* Badge preview */}
            {form.offer_badge && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">Preview:</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                  {form.offer_badge}
                </span>
                {form.offer_label && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                    {form.offer_label}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Category & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} className={inputClass}>
                <option value="">None</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Duration</label>
              <select name="duration" value={form.duration} onChange={handleChange} className={inputClass}>
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
                <option value="Lifetime">Lifetime</option>
              </select>
            </div>
          </div>

          {/* Color & Delivery */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Brand Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={form.color} onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))} className="w-8 h-8 rounded border-0 cursor-pointer" />
                <input name="color" value={form.color} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Delivery Method</label>
              <select name="delivery" value={form.delivery} onChange={handleChange} className={inputClass}>
                <option value="WhatsApp (< 5 min)">WhatsApp (&lt; 5 min)</option>
                <option value="Email (< 10 min)">Email (&lt; 10 min)</option>
                <option value="Email (< 1 hour)">Email (&lt; 1 hour)</option>
                <option value="Manual (< 24 hours)">Manual (&lt; 24 hours)</option>
              </select>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Features (one per line)</label>
            <textarea name="features" value={form.features} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-border"
            />
            Active (visible to customers)
          </label>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={onSave} className="flex-1">{editingId ? "Update" : "Create"} Product</Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;

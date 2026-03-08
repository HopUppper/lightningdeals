import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductImageUpload from "./ProductImageUpload";

export interface ProductForm {
  name: string;
  slug: string;
  description: string;
  long_description: string;
  price_original: number;
  price_discounted: number;
  color: string;
  logo_url: string;
  duration: string;
  delivery: string;
  features: string;
  category_id: string;
  is_active: boolean;
}

export const emptyForm: ProductForm = {
  name: "", slug: "", description: "", long_description: "",
  price_original: 0, price_discounted: 0, color: "#22c55e",
  logo_url: "", duration: "1 Year", delivery: "WhatsApp (< 5 min)",
  features: "", category_id: "", is_active: true,
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

const ProductFormDialog = ({ open, onOpenChange, form, setForm, editingId, categories, onSave }: ProductFormDialogProps) => {
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

          {/* Description */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Short Description</label>
            <input name="description" value={form.description} onChange={handleChange} className={inputClass} placeholder="Brief one-liner about the product" />
          </div>
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
          {form.price_original > 0 && form.price_discounted > 0 && form.price_discounted < form.price_original && (
            <p className="text-xs text-primary">
              💰 {Math.round(((form.price_original - form.price_discounted) / form.price_original) * 100)}% discount
            </p>
          )}

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

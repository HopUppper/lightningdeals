import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit2, Trash2, Search, Check, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProductFormDialog, { ProductForm, emptyForm } from "./ProductFormDialog";

interface Props {
  autoOpenNew?: boolean;
  onNewHandled?: () => void;
}

const AdminProducts = ({ autoOpenNew, onNewHandled }: Props) => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [search, setSearch] = useState("");

  // Inline editing state
  const [inlineEdit, setInlineEdit] = useState<{ id: string; field: string; value: string } | null>(null);
  const inlineRef = useRef<HTMLInputElement>(null);

  // Quick image upload
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [pRes, cRes] = await Promise.all([
      supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);
    setProducts(pRes.data ?? []);
    setCategories(cRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (autoOpenNew) {
      openNew();
      onNewHandled?.();
    }
  }, [autoOpenNew]);

  useEffect(() => {
    if (inlineEdit && inlineRef.current) {
      inlineRef.current.focus();
      inlineRef.current.select();
    }
  }, [inlineEdit]);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const toLocalDatetime = (iso: string | null) => {
    if (!iso) return "";
    return new Date(iso).toISOString().slice(0, 16);
  };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      name: p.name, slug: p.slug, description: p.description || "",
      long_description: p.long_description || "",
      price_original: p.price_original, price_discounted: p.price_discounted,
      buying_price: p.buying_price || 0,
      color: p.color || "#22c55e", logo_url: p.logo_url || "",
      duration: p.duration || "1 Year", delivery: p.delivery || "WhatsApp (< 5 min)",
      features: (p.features || []).join("\n"), category_id: p.category_id || "",
      is_active: p.is_active,
      offer_badge: p.offer_badge || "", offer_label: p.offer_label || "",
      offer_expires_at: toLocalDatetime(p.offer_expires_at),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) { toast.error("Name and slug are required"); return; }
    const payload: any = {
      name: form.name, slug: form.slug, description: form.description,
      long_description: form.long_description, price_original: form.price_original,
      price_discounted: form.price_discounted, color: form.color, logo_url: form.logo_url,
      duration: form.duration, delivery: form.delivery,
      features: form.features.split("\n").filter(Boolean),
      category_id: form.category_id || null, is_active: form.is_active,
      offer_badge: form.offer_badge || "", offer_label: form.offer_label || "",
      offer_expires_at: form.offer_expires_at ? new Date(form.offer_expires_at).toISOString() : null,
    };

    if (editingId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingId);
      if (error) { toast.error("Failed to update product"); return; }
      toast.success("Product updated");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast.error("Failed to create product"); return; }
      toast.success("Product created");
    }
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Product deleted");
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Inline price/name save
  const saveInlineEdit = async () => {
    if (!inlineEdit) return;
    const { id, field, value } = inlineEdit;
    const numericFields = ["price_original", "price_discounted"];
    const updateVal = numericFields.includes(field) ? Number(value) : value;

    const { error } = await supabase.from("products").update({ [field]: updateVal } as any).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }

    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, [field]: updateVal } : p));
    setInlineEdit(null);
    toast.success("Updated");
  };

  // Quick image upload
  const handleQuickImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingFor) return;

    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      toast.error("Select an image under 5MB");
      return;
    }

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(fileName, file, { upsert: true });
    if (error) { toast.error("Upload failed"); setUploadingFor(null); return; }

    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
    const url = urlData.publicUrl;

    await supabase.from("products").update({ logo_url: url } as any).eq("id", uploadingFor);
    setProducts((prev) => prev.map((p) => p.id === uploadingFor ? { ...p, logo_url: url } : p));
    setUploadingFor(null);
    toast.success("Image updated");
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const filtered = products.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.name?.toLowerCase().includes(s) || p.slug?.toLowerCase().includes(s) || p.categories?.name?.toLowerCase().includes(s);
  });

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl font-display font-bold text-foreground">Products ({products.length})</h2>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-52"
            />
          </div>
          <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Add Product</Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Product</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Category</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Duration</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Price</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors group">
                  {/* Product with logo */}
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => { setUploadingFor(p.id); imageInputRef.current?.click(); }}
                        className="relative shrink-0 group/img"
                        title="Click to change image"
                      >
                        {p.logo_url ? (
                          <img src={p.logo_url} alt="" className="w-9 h-9 rounded-lg object-contain bg-muted/30 p-0.5" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center">
                            <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-background/60 rounded-lg opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload className="w-3.5 h-3.5 text-foreground" />
                        </div>
                      </button>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm truncate max-w-[180px]">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 text-muted-foreground text-xs">{p.categories?.name || "—"}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.duration || "1 Year"}</td>

                  {/* Inline editable price */}
                  <td className="p-3">
                    {inlineEdit?.id === p.id && inlineEdit.field === "price_discounted" ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">₹</span>
                        <input
                          ref={inlineRef}
                          type="number"
                          value={inlineEdit.value}
                          onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
                          onKeyDown={(e) => { if (e.key === "Enter") saveInlineEdit(); if (e.key === "Escape") setInlineEdit(null); }}
                          className="w-20 px-1.5 py-0.5 text-sm rounded border border-primary bg-background text-foreground focus:outline-none"
                        />
                        <button onClick={saveInlineEdit} className="text-primary hover:text-primary/80"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setInlineEdit(null)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setInlineEdit({ id: p.id, field: "price_discounted", value: String(p.price_discounted) })}
                        className="text-left hover:bg-primary/5 rounded px-1 py-0.5 -mx-1 transition-colors"
                        title="Click to edit price"
                      >
                        <span className="text-muted-foreground line-through text-[10px] mr-1">₹{p.price_original}</span>
                        <span className="font-display font-bold text-foreground">₹{p.price_discounted}</span>
                      </button>
                    )}
                  </td>

                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.is_active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {p.is_active ? "Active" : "Draft"}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex gap-0.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)} title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(p.id)} title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">
                  {search ? "No products matching your search" : "No products yet"}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden file input for quick image uploads */}
      <input ref={imageInputRef} type="file" accept="image/*" onChange={handleQuickImageUpload} className="hidden" />

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        form={form}
        setForm={setForm}
        editingId={editingId}
        categories={categories}
        onSave={handleSave}
      />
    </div>
  );
};

export default AdminProducts;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

const emptyForm: CategoryForm = { name: "", slug: "", description: "", icon: "" };

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});

  const fetchData = async () => {
    setLoading(true);
    const [cRes, pRes] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("products").select("category_id"),
    ]);
    setCategories(cRes.data ?? []);
    
    const counts: Record<string, number> = {};
    (pRes.data ?? []).forEach((p) => {
      if (p.category_id) counts[p.category_id] = (counts[p.category_id] || 0) + 1;
    });
    setProductCounts(counts);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };

  const openEdit = (c: any) => {
    setEditingId(c.id);
    setForm({ name: c.name, slug: c.slug, description: c.description || "", icon: c.icon || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) { toast.error("Name and slug required"); return; }
    const payload = { name: form.name, slug: form.slug, description: form.description, icon: form.icon };

    if (editingId) {
      const { error } = await supabase.from("categories").update(payload).eq("id", editingId);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Category updated");
    } else {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) { toast.error("Failed to create"); return; }
      toast.success("Category created");
    }
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products in it will become uncategorized.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Category deleted");
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground">Categories ({categories.length})</h2>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Add Category</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="glass-card p-5 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div>
                {c.icon && <span className="text-2xl mb-2 block">{c.icon}</span>}
                <h3 className="font-display font-semibold text-foreground">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.slug}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {c.description && <p className="text-sm text-muted-foreground mb-3 flex-1">{c.description}</p>}
            <div className="text-xs text-muted-foreground mt-auto pt-2 border-t border-border/50">
              {productCounts[c.id] || 0} products
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full glass-card p-8 text-center text-muted-foreground">
            No categories yet. Create one to organize your products.
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{editingId ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Slug *</label>
              <input name="slug" value={form.slug} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. design-tools" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Icon (emoji)</label>
              <input name="icon" value={form.icon} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="🎨" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="flex-1">{editingId ? "Update" : "Create"} Category</Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;

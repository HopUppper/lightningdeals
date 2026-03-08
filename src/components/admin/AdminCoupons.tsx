import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Tag, Percent, DollarSign } from "lucide-react";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_amount: "",
    max_uses: "",
    expires_at: "",
  });

  const fetchCoupons = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });
    setCoupons(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async () => {
    if (!form.code || !form.discount_value) {
      toast.error("Code and discount value are required");
      return;
    }

    const { error } = await supabase.from("coupons").insert({
      code: form.code.toUpperCase().trim(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : 0,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      expires_at: form.expires_at || null,
    } as any);

    if (error) {
      toast.error(error.message.includes("duplicate") ? "Coupon code already exists" : "Failed to create coupon");
    } else {
      toast.success("Coupon created");
      setShowForm(false);
      setForm({ code: "", discount_type: "percentage", discount_value: "", min_order_amount: "", max_uses: "", expires_at: "" });
      fetchCoupons();
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await supabase.from("coupons").update({ is_active: !isActive } as any).eq("id", id);
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: !isActive } : c)));
    toast.success(`Coupon ${!isActive ? "activated" : "deactivated"}`);
  };

  const deleteCoupon = async (id: string) => {
    await supabase.from("coupons").delete().eq("id", id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success("Coupon deleted");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground">Coupons ({coupons.length})</h2>
        <Button onClick={() => setShowForm(true)} size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Create Coupon
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No coupons yet</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {coupons.map((coupon) => {
            const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
            const isMaxed = coupon.max_uses && coupon.used_count >= coupon.max_uses;
            return (
              <div key={coupon.id} className={`glass-card p-4 flex items-center justify-between ${!coupon.is_active || isExpired || isMaxed ? "opacity-60" : ""}`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {coupon.discount_type === "percentage" ? <Percent className="w-5 h-5 text-primary" /> : <DollarSign className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground tracking-wider">{coupon.code}</p>
                    <p className="text-xs text-muted-foreground">
                      {coupon.discount_type === "percentage" ? `${coupon.discount_value}% off` : `₹${coupon.discount_value} off`}
                      {coupon.min_order_amount > 0 && ` · Min ₹${coupon.min_order_amount}`}
                      {coupon.max_uses && ` · ${coupon.used_count}/${coupon.max_uses} used`}
                      {coupon.expires_at && ` · Expires ${new Date(coupon.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleActive(coupon.id, coupon.is_active)}>
                    {coupon.is_active ? "Disable" : "Enable"}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCoupon(coupon.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Coupon Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Create Coupon</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Code *</label>
              <input
                value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="SAVE20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Type</label>
                <select
                  value={form.discount_type}
                  onChange={(e) => setForm((p) => ({ ...p, discount_type: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Value *</label>
                <input
                  type="number"
                  value={form.discount_value}
                  onChange={(e) => setForm((p) => ({ ...p, discount_value: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={form.discount_type === "percentage" ? "20" : "100"}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Min Order ₹</label>
                <input
                  type="number"
                  value={form.min_order_amount}
                  onChange={(e) => setForm((p) => ({ ...p, min_order_amount: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Max Uses</label>
                <input
                  type="number"
                  value={form.max_uses}
                  onChange={(e) => setForm((p) => ({ ...p, max_uses: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Unlimited"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Expires At</label>
              <input
                type="datetime-local"
                value={form.expires_at}
                onChange={(e) => setForm((p) => ({ ...p, expires_at: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button onClick={handleCreate} className="w-full">Create Coupon</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCoupons;

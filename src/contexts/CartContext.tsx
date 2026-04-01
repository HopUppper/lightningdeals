import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  original: number;
  color: string;
  logoUrl?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

const STORAGE_KEY = "lightning-deals-cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUserId = session?.user?.id ?? null;
      setUserId(newUserId);
      if (!newUserId) setSynced(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // When user logs in, merge localStorage cart with DB cart, then sync
  useEffect(() => {
    if (!userId || synced) return;

    const syncCart = async () => {
      try {
        // Fetch DB cart with product details
        const { data: dbItems } = await supabase
          .from("cart_items")
          .select("product_id, quantity, products(name, price_discounted, price_original, color, logo_url)")
          .eq("user_id", userId);

        const dbCart: CartItem[] = (dbItems ?? []).map((item: any) => ({
          id: item.product_id,
          name: item.products?.name ?? "",
          price: Number(item.products?.price_discounted ?? 0),
          original: Number(item.products?.price_original ?? 0),
          color: item.products?.color ?? "",
          logoUrl: item.products?.logo_url ?? "",
          quantity: item.quantity,
        }));

        // Merge: local items take priority for quantity, add any DB-only items
        const localItems = [...items];
        const merged = new Map<string, CartItem>();
        
        // Add DB items first
        dbCart.forEach((item) => merged.set(item.id, item));
        
        // Local items override (they're more recent)
        localItems.forEach((item) => {
          const existing = merged.get(item.id);
          if (existing) {
            merged.set(item.id, { ...item, quantity: item.quantity + existing.quantity });
          } else {
            merged.set(item.id, item);
          }
        });

        const mergedItems = Array.from(merged.values());
        setItems(mergedItems);

        // Upsert all merged items to DB
        if (mergedItems.length > 0) {
          for (const item of mergedItems) {
            await supabase.from("cart_items").upsert(
              { user_id: userId, product_id: item.id, quantity: item.quantity },
              { onConflict: "user_id,product_id" }
            );
          }
        }

        // Remove DB items not in merged set
        const mergedIds = new Set(mergedItems.map((i) => i.id));
        const dbOnlyIds = (dbItems ?? [])
          .map((i: any) => i.product_id)
          .filter((id: string) => !mergedIds.has(id));
        if (dbOnlyIds.length > 0) {
          await supabase.from("cart_items").delete().eq("user_id", userId).in("product_id", dbOnlyIds);
        }

        setSynced(true);
      } catch (e) {
        console.error("Cart sync failed:", e);
        setSynced(true); // Don't retry forever
      }
    };

    syncCart();
  }, [userId, synced]);

  // Persist to localStorage always
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Helper to sync a single item change to DB
  const syncToDb = useCallback(async (productId: string, quantity: number) => {
    if (!userId) return;
    try {
      if (quantity <= 0) {
        await supabase.from("cart_items").delete().eq("user_id", userId).eq("product_id", productId);
      } else {
        await supabase.from("cart_items").upsert(
          { user_id: userId, product_id: productId, quantity },
          { onConflict: "user_id,product_id" }
        );
      }
    } catch (e) {
      console.error("Cart DB sync error:", e);
    }
  }, [userId]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const newQty = existing ? existing.quantity + 1 : 1;
      syncToDb(item.id, newQty);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: newQty } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    syncToDb(id, 0);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeItem(id);
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
    syncToDb(id, quantity);
  };

  const clearCart = () => {
    const oldItems = items;
    setItems([]);
    if (userId) {
      oldItems.forEach((item) => syncToDb(item.id, 0));
    }
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

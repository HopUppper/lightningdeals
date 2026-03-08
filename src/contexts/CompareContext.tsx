import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CompareProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_original: number;
  price_discounted: number;
  duration: string | null;
  delivery: string | null;
  features: string[] | null;
  logo_url: string | null;
  color: string | null;
  category_name: string | null;
}

interface CompareContextType {
  items: CompareProduct[];
  addToCompare: (product: CompareProduct) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
};

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CompareProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCompare = useCallback((product: CompareProduct) => {
    setItems((prev) => {
      if (prev.length >= 3) return prev;
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setItems([]);
    setIsOpen(false);
  }, []);

  const isInCompare = useCallback((id: string) => items.some((p) => p.id === id), [items]);

  return (
    <CompareContext.Provider value={{ items, addToCompare, removeFromCompare, clearCompare, isInCompare, isOpen, setIsOpen }}>
      {children}
    </CompareContext.Provider>
  );
};

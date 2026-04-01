import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "ld-recently-viewed";
const MAX_ITEMS = 10;

export interface RecentProduct {
  id: string;
  name: string;
  slug: string;
  price_discounted: number;
  price_original: number;
  logo_url: string | null;
  color: string | null;
  duration: string | null;
}

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentProduct[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = useCallback((product: RecentProduct) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  return { recentlyViewed, addToRecentlyViewed };
};

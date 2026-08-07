'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('luxe_wishlist');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('luxe_wishlist', JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (product: Product) => {
    setItems(prev => prev.some(p => p.id === product.id) ? prev : [...prev, product]);
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(p => p.id !== productId));
  };

  const isWishlisted = (productId: string) => items.some(p => p.id === productId);

  const toggleItem = (product: Product) => {
    if (isWishlisted(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isWishlisted, toggleItem, totalItems }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}

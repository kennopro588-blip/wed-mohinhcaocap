'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, color: string, size: string) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('luxe_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('luxe_cart', JSON.stringify(items));
    } catch {}
  }, [items]);

  const getKey = (productId: string, color: string, size: string) =>
    `${productId}-${color}-${size}`;

  const addItem = (product: Product, color: string, size: string) => {
    setItems(prev => {
      const key = getKey(product.id, color, size);
      const existing = prev.find(
        i => getKey(i.product.id, i.selectedColor, i.selectedSize) === key
      );
      if (existing) {
        return prev.map(i =>
          getKey(i.product.id, i.selectedColor, i.selectedSize) === key
            ? { ...i, quantity: Math.min(i.quantity + 1, product.stockCount) }
            : i
        );
      }
      return [...prev, { product, quantity: 1, selectedColor: color, selectedSize: size }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string, color: string, size: string) => {
    const key = getKey(productId, color, size);
    setItems(prev => prev.filter(
      i => getKey(i.product.id, i.selectedColor, i.selectedSize) !== key
    ));
  };

  const updateQuantity = (productId: string, color: string, size: string, quantity: number) => {
    const key = getKey(productId, color, size);
    if (quantity <= 0) {
      removeItem(productId, color, size);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        getKey(i.product.id, i.selectedColor, i.selectedSize) === key
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);
  const toggleCart = () => setIsOpen(prev => !prev);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, isOpen, addItem, removeItem, updateQuantity,
      clearCart, toggleCart, openCart, closeCart,
      totalItems, subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

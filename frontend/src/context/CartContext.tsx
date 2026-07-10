'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (courseId: string) => void;
  clearCart: () => void;
  hasItem: (courseId: string) => boolean;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.courseId === item.courseId)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((courseId: string) => {
    setItems((prev) => prev.filter((i) => i.courseId !== courseId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const hasItem = useCallback(
    (courseId: string) => items.some((i) => i.courseId === courseId),
    [items]
  );

  const total = items.reduce((sum, i) => sum + i.price, 0);
  const count = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, hasItem, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};

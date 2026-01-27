'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import CartDrawer from '@/components/protected/cart/cart';

interface CartContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return (
    <CartContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      <CartDrawer open={isOpen} onClose={close} />
    </CartContext.Provider>
  );
}

export function useCartDrawer() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartDrawer must be used within a CartProvider');
  }
  return context;
} 
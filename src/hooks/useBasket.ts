import { useState } from 'react';
import type { BasketItem, Product } from '../types';

export function useBasket() {
  const [items, setItems] = useState<BasketItem[]>([]);

  function addItem(produit: Product, quantite = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.produit.id === produit.id);
      if (existing) {
        return prev.map((i) =>
          i.produit.id === produit.id
            ? { ...i, quantite: Math.min(i.quantite + quantite, produit.quantite) }
            : i
        );
      }
      return [...prev, { produit, quantite }];
    });
  }

  function removeItem(produitId: string) {
    setItems((prev) => prev.filter((i) => i.produit.id !== produitId));
  }

  function updateQuantity(produitId: string, quantite: number) {
    if (quantite <= 0) {
      removeItem(produitId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.produit.id === produitId ? { ...i, quantite } : i))
    );
  }

  function clearBasket() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.produit.prix * i.quantite, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantite, 0);

  return { items, addItem, removeItem, updateQuantity, clearBasket, total, itemCount };
}

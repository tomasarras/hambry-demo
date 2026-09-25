"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "hambry_cart";

const EMPTY_CART = { restaurantId: null, restaurantName: null, restaurantSlug: null, deliveryFee: 0, items: [] };

const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_CART;
    return { ...EMPTY_CART, ...JSON.parse(raw) };
  } catch {
    return EMPTY_CART;
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(EMPTY_CART);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(loadCart());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, loaded]);

  // Returns true if adding this item requires switching restaurants first
  // (the cart, like the real app, only ever holds one restaurant's items).
  function wouldSwitchRestaurant(restaurant) {
    return cart.items.length > 0 && cart.restaurantId && cart.restaurantId !== restaurant.id;
  }

  function addItem(restaurant, menuItem, qty = 1) {
    setCart((prev) => {
      const base =
        prev.restaurantId && prev.restaurantId !== restaurant.id
          ? { ...EMPTY_CART }
          : prev;
      const existing = base.items.find((i) => i.menuItemId === menuItem.id);
      const items = existing
        ? base.items.map((i) => (i.menuItemId === menuItem.id ? { ...i, qty: i.qty + qty } : i))
        : [...base.items, { menuItemId: menuItem.id, name: menuItem.name, price: menuItem.price, qty }];
      return {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantSlug: restaurant.slug,
        deliveryFee: restaurant.deliveryFee,
        items,
      };
    });
  }

  function updateQty(menuItemId, qty) {
    setCart((prev) => {
      const items = prev.items
        .map((i) => (i.menuItemId === menuItemId ? { ...i, qty: Math.max(0, qty) } : i))
        .filter((i) => i.qty > 0);
      return items.length === 0 ? EMPTY_CART : { ...prev, items };
    });
  }

  function removeItem(menuItemId) {
    updateQty(menuItemId, 0);
  }

  function clearCart() {
    setCart(EMPTY_CART);
  }

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = cart.items.length > 0 ? subtotal + cart.deliveryFee : 0;
  const itemCount = cart.items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, loaded, addItem, updateQty, removeItem, clearCart, wouldSwitchRestaurant, subtotal, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

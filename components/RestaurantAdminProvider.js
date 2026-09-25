"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "hambry_restaurant_admin";

const RestaurantAdminContext = createContext(null);

export function RestaurantAdminProvider({ children }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRestaurant(raw ? JSON.parse(raw) : null);
    } catch {
      setRestaurant(null);
    }
    setLoaded(true);
  }, []);

  function enterAs(restaurant) {
    const compact = { id: restaurant.id, name: restaurant.name, slug: restaurant.slug };
    setRestaurant(compact);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
  }

  function exitAdmin() {
    setRestaurant(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <RestaurantAdminContext.Provider value={{ restaurant, loaded, enterAs, exitAdmin }}>
      {children}
    </RestaurantAdminContext.Provider>
  );
}

export function useRestaurantAdmin() {
  return useContext(RestaurantAdminContext);
}

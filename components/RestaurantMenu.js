"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatCurrency } from "@/lib/format";

export default function RestaurantMenu({ restaurant, categories }) {
  const { cart, addItem, updateQty, wouldSwitchRestaurant } = useCart();
  const [pendingItem, setPendingItem] = useState(null);

  function qtyInCart(menuItemId) {
    return cart.items.find((i) => i.menuItemId === menuItemId)?.qty || 0;
  }

  function handleAdd(item) {
    if (wouldSwitchRestaurant(restaurant)) {
      setPendingItem(item);
      return;
    }
    addItem(restaurant, item, 1);
  }

  function confirmSwitch() {
    addItem(restaurant, pendingItem, 1);
    setPendingItem(null);
  }

  const disabled = !restaurant.isOpen;

  return (
    <div className="mt-8 space-y-10">
      {pendingItem && (
        <div className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-md flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-lg sm:inset-x-auto sm:right-6">
          <p className="text-sm">
            Tu carrito tiene productos de <strong>{cart.restaurantName}</strong>. Si agregás este plato, se vacía y
            empieza un pedido nuevo en <strong>{restaurant.name}</strong>.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPendingItem(null)}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-black/60 hover:bg-black/5"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmSwitch}
              className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground"
            >
              Vaciar y agregar
            </button>
          </div>
        </div>
      )}

      {categories.map((category) => (
        <div key={category.id}>
          <h2 className="text-lg font-bold">{category.name}</h2>
          <ul className="mt-3 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
            {category.items.map((item) => {
              const qty = qtyInCart(item.id);
              return (
                <li key={item.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium ${!item.available ? "text-black/40" : ""}`}>{item.name}</p>
                    {item.description && <p className="mt-0.5 text-sm text-black/50">{item.description}</p>}
                    <p className="mt-1 text-sm font-semibold">{formatCurrency(item.price)}</p>
                    {!item.available && <p className="mt-1 text-xs font-medium text-red-600">No disponible</p>}
                  </div>

                  {item.available && !disabled ? (
                    qty > 0 ? (
                      <div className="flex shrink-0 items-center gap-2 rounded-full border border-black/15 px-1 py-1">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, qty - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-black/5"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center text-sm font-semibold">{qty}</span>
                        <button
                          type="button"
                          onClick={() => handleAdd(item)}
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-black/5"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAdd(item)}
                        className="shrink-0 flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground"
                      >
                        <Plus size={14} />
                        Agregar
                      </button>
                    )
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

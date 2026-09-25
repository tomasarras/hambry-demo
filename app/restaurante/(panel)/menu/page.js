"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Plus } from "lucide-react";
import { useRestaurantAdmin } from "@/components/RestaurantAdminProvider";
import { formatCurrency } from "@/lib/format";

export default function RestaurantMenuPage() {
  const { restaurant } = useRestaurantAdmin();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!restaurant) return;
    setLoading(true);
    const res = await fetch(`/api/menu-items?restaurantId=${restaurant.id}`);
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant]);

  async function toggleAvailable(item) {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i)));
    await fetch(`/api/menu-items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !item.available }),
    });
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este plato?")) return;
    await fetch(`/api/menu-items/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Menú</h1>
        <Link
          href="/restaurante/menu/nuevo"
          className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus size={16} />
          Nuevo plato
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-black/10 bg-white">
        {loading && <p className="p-4 text-sm text-black/40">Cargando…</p>}
        {!loading && items.length === 0 && <p className="p-4 text-sm text-black/40">Todavía no hay platos.</p>}
        <ul className="divide-y divide-black/10">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.name}</p>
                <p className="text-sm text-black/50">
                  {item.category?.name || "Sin categoría"} · {formatCurrency(item.price)}
                </p>
              </div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-black/60">
                <input type="checkbox" checked={item.available} onChange={() => toggleAvailable(item)} />
                Disponible
              </label>
              <Link href={`/restaurante/menu/${item.id}`} className="text-sm font-semibold text-black/70 hover:underline">
                Editar
              </Link>
              <button type="button" onClick={() => handleDelete(item.id)} className="text-black/40 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useRestaurantAdmin } from "@/components/RestaurantAdminProvider";

export default function CategoriasPage() {
  const { restaurant } = useRestaurantAdmin();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    if (!restaurant) return;
    const res = await fetch(`/api/menu-categories?restaurantId=${restaurant.id}`);
    setCategories(await res.json());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant]);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/menu-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, order: categories.length, restaurantId: restaurant.id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "No se pudo crear la categoría");
    } else {
      setName("");
      await load();
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta categoría? Los platos que la usan quedan sin categoría.")) return;
    await fetch(`/api/menu-categories/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Categorías</h1>

      <form onSubmit={handleAdd} className="mt-6 flex max-w-md gap-2">
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la categoría"
          className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Agregar
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <ul className="mt-6 max-w-md divide-y divide-black/10 rounded-xl border border-black/10 bg-white">
        {categories.length === 0 && <li className="p-4 text-sm text-black/40">Todavía no hay categorías.</li>}
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between p-4">
            <span className="font-medium">{c.name}</span>
            <button type="button" onClick={() => handleDelete(c.id)} className="text-black/40 hover:text-red-600">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useRestaurantAdmin } from "@/components/RestaurantAdminProvider";

export default function MenuItemForm({ item }) {
  const router = useRouter();
  const { restaurant } = useRestaurantAdmin();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price ?? "",
    categoryId: item?.categoryId || "",
    available: item?.available ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!restaurant) return;
    fetch(`/api/menu-categories?restaurantId=${restaurant.id}`)
      .then((res) => res.json())
      .then(setCategories);
  }, [restaurant]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        categoryId: form.categoryId || null,
        available: form.available,
        restaurantId: restaurant.id,
      };
      const res = await fetch(item ? `/api/menu-items/${item.id}` : "/api/menu-items", {
        method: item ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar el plato");
      router.push("/restaurante/menu");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4 rounded-2xl border border-black/10 bg-white p-5">
      <div>
        <label className="text-sm font-medium">Nombre</label>
        <input
          required
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Descripción (opcional)</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Precio (ARS)</label>
          <input
            required
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Categoría</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={form.available}
          onChange={(e) => setForm({ ...form, available: e.target.checked })}
        />
        Disponible
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-60"
      >
        {saving && <Loader2 size={16} className="animate-spin" />}
        Guardar
      </button>
    </form>
  );
}

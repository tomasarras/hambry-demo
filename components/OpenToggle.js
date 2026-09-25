"use client";

import { useEffect, useState } from "react";

export default function OpenToggle({ restaurantId }) {
  const [isOpen, setIsOpen] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}`)
      .then((res) => res.json())
      .then((data) => setIsOpen(data.isOpen));
  }, [restaurantId]);

  async function toggle() {
    const next = !isOpen;
    setSaving(true);
    setIsOpen(next);
    await fetch(`/api/restaurants/${restaurantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOpen: next }),
    });
    setSaving(false);
  }

  if (isOpen === null) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={saving}
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold disabled:opacity-60 ${
        isOpen ? "bg-green-100 text-green-700" : "bg-black/10 text-black/60"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${isOpen ? "bg-green-600" : "bg-black/40"}`} />
      {isOpen ? "Abierto" : "Cerrado"}
    </button>
  );
}

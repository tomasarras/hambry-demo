"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRestaurantAdmin } from "@/components/RestaurantAdminProvider";
import { STATUS_LABELS } from "@/lib/orderStatus";

const HIGHLIGHT_STATUSES = ["RECEIVED", "CONFIRMED", "PREPARING", "ON_THE_WAY", "DELIVERED"];

export default function RestaurantDashboardPage() {
  const { restaurant } = useRestaurantAdmin();
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    if (!restaurant) return;
    fetch(`/api/orders?restaurantId=${restaurant.id}`)
      .then((res) => res.json())
      .then((orders) => {
        const next = Object.fromEntries(HIGHLIGHT_STATUSES.map((s) => [s, 0]));
        for (const order of orders) {
          if (next[order.status] !== undefined) next[order.status] += 1;
        }
        setCounts(next);
      });
  }, [restaurant]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Hola, {restaurant?.name}</h1>
      <p className="text-sm text-black/50">Este es el resumen de tu restaurante.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {HIGHLIGHT_STATUSES.map((status) => (
          <div key={status} className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-2xl font-bold">{counts ? counts[status] : "–"}</p>
            <p className="text-sm text-black/50">{STATUS_LABELS[status]}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/restaurante/pedidos" className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
          Ver pedidos
        </Link>
        <Link href="/restaurante/menu" className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/5">
          Gestionar menú
        </Link>
      </div>
    </div>
  );
}

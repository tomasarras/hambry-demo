"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import { getMyOrderIds } from "@/lib/myOrders";
import { formatCurrency, formatDate } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/orderStatus";

export default function MisPedidosPage() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    async function load() {
      const ids = getMyOrderIds();
      const results = await Promise.all(
        ids.map((id) => fetch(`/api/orders/${id}`).then((res) => (res.ok ? res.json() : null))),
      );
      setOrders(results.filter(Boolean));
    }
    load();
  }, []);

  return (
    <>
      <StoreHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold">Mis pedidos</h1>

        {orders === null && <p className="mt-6 text-sm text-black/40">Cargando…</p>}

        {orders?.length === 0 && (
          <div className="mt-10 text-center text-sm text-black/50">
            <p>Todavía no hiciste ningún pedido en este navegador.</p>
            <Link href="/inicio" className="mt-3 inline-block font-semibold text-accent hover:underline">
              Ver restaurantes
            </Link>
          </div>
        )}

        {orders?.length > 0 && (
          <ul className="mt-6 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
            {orders.map((order) => (
              <li key={order.id}>
                <Link href={`/pedido/${order.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-black/[0.02]">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{order.restaurant.name}</p>
                    <p className="text-sm text-black/50">
                      {formatDate(order.createdAt)} · {formatCurrency(order.total)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold">
                    {STATUS_LABELS[order.status]}
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-black/30" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

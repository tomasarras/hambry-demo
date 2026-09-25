"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bike, LogOut, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";

const POLL_MS = 5000;

export default function RepartidorPage() {
  const [orders, setOrders] = useState([]);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetch("/api/orders?status=PREPARING,ON_THE_WAY");
      if (cancelled) return;
      setOrders(await res.json());
    }

    load();
    const interval = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  async function advance(orderId, nextStatus) {
    setBusyId(orderId);
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, actor: "courier" }),
    });
    const updated = await res.json();
    setOrders((prev) =>
      nextStatus === "DELIVERED" ? prev.filter((o) => o.id !== orderId) : prev.map((o) => (o.id === orderId ? updated : o)),
    );
    setBusyId(null);
  }

  const ready = orders.filter((o) => o.status === "PREPARING");
  const delivering = orders.filter((o) => o.status === "ON_THE_WAY");

  return (
    <div className="min-h-screen">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Bike size={22} />
            Repartidor
          </div>
          <Link href="/" className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-black/60 hover:bg-black/5">
            <LogOut size={16} />
            Salir
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <section>
          <h2 className="text-lg font-bold">Listos para retirar ({ready.length})</h2>
          {ready.length === 0 ? (
            <p className="mt-2 text-sm text-black/40">No hay pedidos listos por ahora.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {ready.map((order) => (
                <li key={order.id} className="rounded-2xl border border-black/10 bg-white p-4">
                  <OrderSummary order={order} />
                  <button
                    type="button"
                    disabled={busyId === order.id}
                    onClick={() => advance(order.id, "ON_THE_WAY")}
                    className="mt-3 flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground disabled:opacity-60"
                  >
                    {busyId === order.id && <Loader2 size={14} className="animate-spin" />}
                    Salir a entregar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold">En camino ({delivering.length})</h2>
          {delivering.length === 0 ? (
            <p className="mt-2 text-sm text-black/40">No estás entregando ningún pedido.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {delivering.map((order) => (
                <li key={order.id} className="rounded-2xl border border-black/10 bg-white p-4">
                  <OrderSummary order={order} />
                  <button
                    type="button"
                    disabled={busyId === order.id}
                    onClick={() => advance(order.id, "DELIVERED")}
                    className="mt-3 flex items-center gap-2 rounded-full bg-black px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {busyId === order.id && <Loader2 size={14} className="animate-spin" />}
                    Marcar entregado
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function OrderSummary({ order }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="font-semibold">{order.restaurant.name}</p>
        <p className="text-sm text-black/50">→ {order.customerName}, {order.address}</p>
        <p className="text-xs text-black/40">{order.items.reduce((sum, i) => sum + i.quantity, 0)} productos</p>
      </div>
      <p className="font-bold">{formatCurrency(order.total)}</p>
    </div>
  );
}

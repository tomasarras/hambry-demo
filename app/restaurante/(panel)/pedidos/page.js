"use client";

import { useEffect, useState } from "react";
import { useRestaurantAdmin } from "@/components/RestaurantAdminProvider";
import { STATUS_LABELS, RESTAURANT_TRANSITIONS } from "@/lib/orderStatus";
import { formatCurrency, formatDate } from "@/lib/format";

const TABS = ["RECEIVED", "CONFIRMED", "PREPARING", "ON_THE_WAY", "DELIVERED", "CANCELLED"];

const ACTION_LABELS = { CONFIRMED: "Confirmar", PREPARING: "Empezar a preparar", CANCELLED: "Cancelar" };

const POLL_MS = 5000;

export default function RestaurantOrdersPage() {
  const { restaurant } = useRestaurantAdmin();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("RECEIVED");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!restaurant) return;
    let cancelled = false;

    async function load() {
      const res = await fetch(`/api/orders?restaurantId=${restaurant.id}`);
      if (cancelled) return;
      setOrders(await res.json());
    }

    load();
    const interval = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [restaurant]);

  async function advance(orderId, nextStatus) {
    setBusyId(orderId);
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, actor: "restaurant" }),
    });
    const updated = await res.json();
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    setBusyId(null);
  }

  const visible = orders.filter((o) => o.status === tab);

  return (
    <div>
      <h1 className="text-2xl font-bold">Pedidos</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {TABS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setTab(status)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
              tab === status ? "border-black bg-black text-white" : "border-black/15 hover:border-black"
            }`}
          >
            {STATUS_LABELS[status]} ({orders.filter((o) => o.status === status).length})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-sm text-black/40">No hay pedidos en este estado.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((order) => {
            const actions = RESTAURANT_TRANSITIONS[order.status] || [];
            return (
              <li key={order.id} className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-sm text-black/50">{order.address}</p>
                    <p className="text-xs text-black/40">{formatDate(order.createdAt)}</p>
                  </div>
                  <p className="font-bold">{formatCurrency(order.total)}</p>
                </div>

                <ul className="mt-3 space-y-0.5 text-sm text-black/70">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity}× {item.itemName}
                    </li>
                  ))}
                </ul>
                {order.notes && <p className="mt-2 text-sm italic text-black/50">&quot;{order.notes}&quot;</p>}

                {actions.length > 0 && (
                  <div className="mt-4 flex gap-2">
                    {actions.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={busyId === order.id}
                        onClick={() => advance(order.id, status)}
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold disabled:opacity-60 ${
                          status === "CANCELLED" ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-accent text-accent-foreground"
                        }`}
                      >
                        {ACTION_LABELS[status]}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

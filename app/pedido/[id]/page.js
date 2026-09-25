"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import StoreHeader from "@/components/StoreHeader";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import { formatCurrency, formatDate } from "@/lib/format";

// Simulated real-time tracking: no websockets in this demo, just a short
// poll — cheap and good enough since a restaurant/courier action is the
// only thing that ever changes an order's status.
const POLL_MS = 4000;

export default function PedidoPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetch(`/api/orders/${id}`);
      if (cancelled) return;
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      setOrder(await res.json());
    }

    load();
    const interval = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id]);

  if (notFound) {
    return (
      <>
        <StoreHeader />
        <main className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6">
          <p className="text-sm text-black/50">No encontramos ese pedido.</p>
          <Link href="/inicio" className="mt-3 inline-block font-semibold text-accent hover:underline">
            Ver restaurantes
          </Link>
        </main>
      </>
    );
  }

  if (!order) return null;

  return (
    <>
      <StoreHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="text-sm text-black/50">Pedido en {order.restaurant.name}</p>
        <h1 className="text-2xl font-bold">Seguimiento del pedido</h1>
        <p className="mt-1 text-xs text-black/40">Hecho el {formatDate(order.createdAt)}</p>

        <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
          <OrderStatusTimeline status={order.status} />
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="font-semibold">Detalle</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.quantity}× {item.itemName}
                </span>
                <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 border-t border-black/10 pt-3 text-sm">
            <div className="flex justify-between text-black/60">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-black/60">
              <span>Envío</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
          <div className="mt-4 border-t border-black/10 pt-4 text-sm text-black/60">
            <p>{order.customerName}</p>
            <p>{order.address}</p>
            {order.phone && <p>{order.phone}</p>}
            {order.notes && <p className="mt-1 italic">&quot;{order.notes}&quot;</p>}
          </div>
        </div>
      </main>
    </>
  );
}

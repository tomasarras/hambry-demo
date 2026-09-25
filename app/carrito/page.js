"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import { useCart } from "@/components/CartProvider";
import { addMyOrder } from "@/lib/myOrders";
import { formatCurrency } from "@/lib/format";

export default function CarritoPage() {
  const router = useRouter();
  const { cart, loaded, updateQty, removeItem, clearCart, subtotal, total } = useCart();
  const [form, setForm] = useState({ customerName: "", address: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loaded) return null;

  const empty = cart.items.length === 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: cart.restaurantId,
          items: cart.items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.qty })),
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo confirmar el pedido");
      addMyOrder(data.id);
      clearCart();
      router.push(`/pedido/${data.id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <>
      <StoreHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold">Tu carrito</h1>

        {empty ? (
          <div className="mt-10 text-center text-sm text-black/50">
            <p>Todavía no agregaste nada.</p>
            <Link href="/inicio" className="mt-3 inline-block font-semibold text-accent hover:underline">
              Ver restaurantes
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-1 text-sm text-black/50">Pedido de {cart.restaurantName}</p>

            <ul className="mt-6 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
              {cart.items.map((item) => (
                <li key={item.menuItemId} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-black/50">{formatCurrency(item.price)} c/u</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 rounded-full border border-black/15 px-1 py-1">
                    <button
                      type="button"
                      onClick={() => updateQty(item.menuItemId, item.qty - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-black/5"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-4 text-center text-sm font-semibold">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.menuItemId, item.qty + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-black/5"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.menuItemId)}
                    className="shrink-0 text-black/40 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-1 rounded-2xl border border-black/10 bg-white p-4 text-sm">
              <div className="flex justify-between text-black/60">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-black/60">
                <span>Envío</span>
                <span>{formatCurrency(cart.deliveryFee)}</span>
              </div>
              <div className="flex justify-between pt-1 text-base font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-black/10 bg-white p-5">
              <h2 className="font-semibold">Datos de entrega</h2>
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <input
                  required
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Dirección</label>
                <input
                  required
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Calle, número, piso/depto"
                  className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Teléfono (opcional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Notas para el repartidor (opcional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Confirmar pedido · {formatCurrency(total)}
              </button>
            </form>
          </>
        )}
      </main>
    </>
  );
}

"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ClipboardList, UtensilsCrossed, LayoutGrid, LogOut } from "lucide-react";
import { useRestaurantAdmin } from "@/components/RestaurantAdminProvider";
import OpenToggle from "@/components/OpenToggle";

const NAV = [
  { href: "/restaurante/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/restaurante/menu", label: "Menú", icon: UtensilsCrossed },
  { href: "/restaurante/categorias", label: "Categorías", icon: LayoutGrid },
];

export default function RestaurantPanelLayout({ children }) {
  const { restaurant, loaded, exitAdmin } = useRestaurantAdmin();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loaded && !restaurant) router.replace("/restaurante/ingresar");
  }, [loaded, restaurant, router]);

  if (!loaded || !restaurant) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-black/40">Cargando…</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/restaurante" className="text-lg font-bold">
            {restaurant.name} <span className="font-normal text-black/50">panel</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm font-medium">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
                  pathname.startsWith(href) ? "bg-black text-white" : "hover:bg-black/5"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <OpenToggle restaurantId={restaurant.id} />
            <button
              type="button"
              onClick={() => {
                exitAdmin();
                router.push("/");
              }}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-black/60 hover:bg-black/5"
            >
              <LogOut size={16} />
              Salir
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StoreHeader from "@/components/StoreHeader";
import RestaurantCard from "@/components/RestaurantCard";
import { RESTAURANTS } from "@/lib/demoData.mjs";

export const dynamic = "force-dynamic";

const CUISINES = [...new Set(RESTAURANTS.map((r) => r.cuisine))];

export default async function InicioPage({ searchParams }) {
  const { cocina, q } = await searchParams;

  const restaurants = await prisma.restaurant.findMany({
    where: {
      cuisine: cocina || undefined,
      name: q ? { contains: q, mode: "insensitive" } : undefined,
    },
    orderBy: [{ isOpen: "desc" }, { name: "asc" }],
  });

  return (
    <>
      <StoreHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold">¿Qué se te antoja hoy?</h1>

        <form className="mt-4 max-w-md" action="/inicio">
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Buscar restaurantes..."
            className="w-full rounded-full border border-black/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/inicio"
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              !cocina ? "border-black bg-black text-white" : "border-black/15 hover:border-black"
            }`}
          >
            Todos
          </Link>
          {CUISINES.map((c) => (
            <Link
              key={c}
              href={`/inicio?cocina=${encodeURIComponent(c)}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                cocina === c ? "border-black bg-black text-white" : "border-black/15 hover:border-black"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {restaurants.length === 0 ? (
          <p className="mt-10 text-sm text-black/40">No encontramos restaurantes con esa búsqueda.</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

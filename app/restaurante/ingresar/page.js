"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";
import FoodImage from "@/components/FoodImage";
import { restaurantImageSrc } from "@/lib/images";
import { useRestaurantAdmin } from "@/components/RestaurantAdminProvider";

// No real login: this is just "which restaurant am I" for the demo, since
// unlike vestra-demo (a single store) Hambry is a multi-vendor marketplace
// and the admin panel needs to know which restaurant it's managing.
export default function IngresarPage() {
  const router = useRouter();
  const { enterAs } = useRestaurantAdmin();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/restaurants")
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      });
  }, []);

  function handleSelect(restaurant) {
    enterAs(restaurant);
    router.push("/restaurante");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
          <Store size={20} />
        </span>
        <div>
          <h1 className="text-xl font-bold">Ingresar como restaurante</h1>
          <p className="text-sm text-black/50">Elegí qué restaurante querés gestionar.</p>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-black/40">Cargando…</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {restaurants.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => handleSelect(r)}
                className="flex w-full items-center gap-3 rounded-2xl border border-black/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <FoodImage
                  src={restaurantImageSrc(r.slug)}
                  alt={r.name}
                  cuisine={r.cuisine}
                  className="h-12 w-12 shrink-0 rounded-xl"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{r.name}</p>
                  <p className="text-sm text-black/50">{r.cuisine}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

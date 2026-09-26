import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Star, Clock, Bike } from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import FoodImage from "@/components/FoodImage";
import RestaurantMenu from "@/components/RestaurantMenu";
import { formatCurrency } from "@/lib/format";
import { restaurantImageSrc } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function RestaurantPage({ params }) {
  const { slug } = await params;
  const restaurant = await prisma.restaurant.findUnique({ where: { slug } });
  if (!restaurant) notFound();

  const categories = await prisma.menuCategory.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { order: "asc" },
    include: { items: { orderBy: { createdAt: "asc" } } },
  });
  const categoriesWithItems = categories.filter((c) => c.items.length > 0);

  return (
    <>
      <StoreHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex items-center gap-4">
          <FoodImage
            src={restaurantImageSrc(restaurant.slug)}
            alt={restaurant.name}
            cuisine={restaurant.cuisine}
            className="h-20 w-20 shrink-0 rounded-2xl"
          />
          <div>
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <p className="text-sm text-black/50">{restaurant.cuisine}</p>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-black/60">
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                {restaurant.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {restaurant.etaMinutes} min
              </span>
              <span className="flex items-center gap-1">
                <Bike size={14} />
                {formatCurrency(restaurant.deliveryFee)}
              </span>
            </div>
          </div>
        </div>

        {restaurant.description && <p className="mt-4 text-sm text-black/60">{restaurant.description}</p>}

        {!restaurant.isOpen && (
          <p className="mt-4 rounded-xl bg-black/5 px-4 py-3 text-sm font-medium text-black/70">
            Este restaurante está cerrado en este momento — no podés hacer pedidos hasta que vuelva a abrir.
          </p>
        )}

        <RestaurantMenu restaurant={restaurant} categories={categoriesWithItems} />
      </main>
    </>
  );
}

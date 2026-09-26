import Link from "next/link";
import { Star, Clock, Bike } from "lucide-react";
import FoodImage from "@/components/FoodImage";
import { restaurantImageSrc } from "@/lib/images";
import { formatCurrency } from "@/lib/format";

export default function RestaurantCard({ restaurant }) {
  const closed = !restaurant.isOpen;

  return (
    <Link
      href={`/restaurantes/${restaurant.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        closed ? "opacity-60" : ""
      }`}
    >
      <div className="relative h-32 w-full">
        <FoodImage
          src={restaurantImageSrc(restaurant.slug)}
          alt={restaurant.name}
          cuisine={restaurant.cuisine}
          className="h-full w-full"
        />
        {closed && (
          <span className="absolute right-2 top-2 rounded-full bg-black/80 px-2.5 py-1 text-xs font-semibold text-white">
            Cerrado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="font-semibold">{restaurant.name}</p>
        <p className="text-sm text-black/50">{restaurant.cuisine}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-black/60">
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
    </Link>
  );
}

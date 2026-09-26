import { slugify } from "@/lib/format";

// Static, pre-generated images for the fixed demo catalog (see lib/demoData.mjs) —
// live under public/images/, keyed by slug so a menu item added later through the
// admin panel (which has no upload flow) simply has no file here and falls back
// to CuisineIcon in <FoodImage>.
export function restaurantImageSrc(slug) {
  return `/images/restaurants/${slug}.jpg`;
}

export function menuItemImageSrc(restaurantSlug, itemName) {
  return `/images/items/${restaurantSlug}/${slugify(itemName)}.jpg`;
}

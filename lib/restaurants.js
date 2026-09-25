export function serializeRestaurant(restaurant) {
  return {
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    cuisine: restaurant.cuisine,
    description: restaurant.description,
    deliveryFee: restaurant.deliveryFee,
    etaMinutes: restaurant.etaMinutes,
    rating: restaurant.rating,
    isOpen: restaurant.isOpen,
  };
}

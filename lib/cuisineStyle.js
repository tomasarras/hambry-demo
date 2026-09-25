import { Pizza, Fish, Beef, Soup, Salad, Croissant, UtensilsCrossed } from "lucide-react";

// No seeded stock photography in this demo (see AGENTS.md) — every
// restaurant/menu placeholder renders a cuisine-appropriate icon on a
// cuisine-colored background instead of a broken <img>.
const STYLES = {
  Pizzas: { icon: Pizza, className: "bg-orange-100 text-orange-700" },
  Sushi: { icon: Fish, className: "bg-teal-100 text-teal-700" },
  Hamburguesas: { icon: Beef, className: "bg-amber-100 text-amber-700" },
  "Comida china": { icon: Soup, className: "bg-red-100 text-red-700" },
  Saludable: { icon: Salad, className: "bg-green-100 text-green-700" },
  "Panadería y postres": { icon: Croissant, className: "bg-pink-100 text-pink-700" },
};

const DEFAULT_STYLE = { icon: UtensilsCrossed, className: "bg-black/5 text-black/50" };

export function getCuisineStyle(cuisine) {
  return STYLES[cuisine] || DEFAULT_STYLE;
}

// Central definition of the order lifecycle — imported by the tracking
// timeline, the restaurant order queue, and the courier ("repartidor")
// board, so all three always agree on labels, order, and legal transitions.

export const STATUS_FLOW = ["RECEIVED", "CONFIRMED", "PREPARING", "ON_THE_WAY", "DELIVERED"];

export const STATUS_LABELS = {
  RECEIVED: "Recibido",
  CONFIRMED: "Confirmado",
  PREPARING: "En preparación",
  ON_THE_WAY: "En camino",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export const STATUS_DESCRIPTIONS = {
  RECEIVED: "El restaurante todavía no vio tu pedido.",
  CONFIRMED: "El restaurante confirmó tu pedido.",
  PREPARING: "Se está cocinando.",
  ON_THE_WAY: "Un repartidor lo está llevando.",
  DELIVERED: "Pedido entregado.",
  CANCELLED: "El restaurante canceló el pedido.",
};

// Who is allowed to move an order from a given status to the next one.
// The restaurant owns RECEIVED→CONFIRMED→PREPARING (and can cancel up to
// CONFIRMED); the courier owns PREPARING→ON_THE_WAY→DELIVERED.
export const RESTAURANT_TRANSITIONS = {
  RECEIVED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
};

export const COURIER_TRANSITIONS = {
  PREPARING: ["ON_THE_WAY"],
  ON_THE_WAY: ["DELIVERED"],
};

export function isValidTransition(from, to) {
  const allowed = { ...RESTAURANT_TRANSITIONS, ...COURIER_TRANSITIONS };
  return Boolean(allowed[from]?.includes(to));
}

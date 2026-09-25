import { prisma } from "@/lib/prisma";
import { RESTAURANT_TRANSITIONS, COURIER_TRANSITIONS } from "@/lib/orderStatus";

export class OrderError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function serializeOrder(order) {
  return {
    id: order.id,
    restaurantId: order.restaurantId,
    restaurant: order.restaurant
      ? { id: order.restaurant.id, name: order.restaurant.name, slug: order.restaurant.slug }
      : undefined,
    status: order.status,
    customerName: order.customerName,
    address: order.address,
    phone: order.phone,
    notes: order.notes,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items.map((item) => ({
      id: item.id,
      menuItemId: item.menuItemId,
      itemName: item.itemName,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    })),
  };
}

const ORDER_INCLUDE = { items: true, restaurant: true };

// Creates a simulated order: re-fetches current prices/availability
// server-side (never trusts client-sent prices) and snapshots them onto
// each OrderItem so later menu edits don't corrupt past order history.
export async function createOrder({ restaurantId, items, customerName, address, phone, notes }) {
  if (!restaurantId) throw new OrderError("Falta el restaurante", 400);
  if (!Array.isArray(items) || items.length === 0) throw new OrderError("El carrito está vacío", 400);
  if (!customerName?.trim()) throw new OrderError("Falta el nombre", 400);
  if (!address?.trim()) throw new OrderError("Falta la dirección de entrega", 400);

  return prisma.$transaction(async (tx) => {
    const restaurant = await tx.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) throw new OrderError("El restaurante ya no existe", 400);
    if (!restaurant.isOpen) throw new OrderError("El restaurante está cerrado en este momento", 400);

    const menuItemIds = [...new Set(items.map((i) => i.menuItemId))];
    const menuItems = await tx.menuItem.findMany({ where: { id: { in: menuItemIds }, restaurantId } });
    const menuItemById = new Map(menuItems.map((m) => [m.id, m]));

    const orderItems = items.map((item) => {
      const menuItem = menuItemById.get(item.menuItemId);
      if (!menuItem) throw new OrderError("Un plato del carrito ya no existe", 400);
      if (!menuItem.available) throw new OrderError(`"${menuItem.name}" ya no está disponible`, 400);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      return {
        menuItemId: menuItem.id,
        itemName: menuItem.name,
        unitPrice: menuItem.price,
        quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const deliveryFee = restaurant.deliveryFee;
    const total = subtotal + deliveryFee;

    const order = await tx.order.create({
      data: {
        restaurantId,
        customerName: customerName.trim(),
        address: address.trim(),
        phone: phone?.trim() || null,
        notes: notes?.trim() || null,
        subtotal,
        deliveryFee,
        total,
        items: { create: orderItems },
      },
      include: ORDER_INCLUDE,
    });

    return serializeOrder(order);
  });
}

export async function getOrder(id) {
  const order = await prisma.order.findUnique({ where: { id }, include: ORDER_INCLUDE });
  if (!order) throw new OrderError("Pedido no encontrado", 404);
  return serializeOrder(order);
}

export async function listOrders({ restaurantId, statuses }) {
  const orders = await prisma.order.findMany({
    where: {
      restaurantId: restaurantId || undefined,
      status: statuses ? { in: statuses } : undefined,
    },
    include: ORDER_INCLUDE,
    orderBy: { createdAt: "asc" },
  });
  return orders.map(serializeOrder);
}

// actor is "restaurant" or "courier" — each only owns half of the status
// flow (see lib/orderStatus.js), so a courier can't jump an order straight
// to CONFIRMED and a restaurant can't mark it ON_THE_WAY.
export async function updateOrderStatus(id, nextStatus, actor) {
  const transitions = actor === "courier" ? COURIER_TRANSITIONS : RESTAURANT_TRANSITIONS;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new OrderError("Pedido no encontrado", 404);

  const allowed = transitions[order.status] || [];
  if (!allowed.includes(nextStatus)) {
    throw new OrderError(`No se puede pasar de "${order.status}" a "${nextStatus}"`, 400);
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status: nextStatus },
    include: ORDER_INCLUDE,
  });
  return serializeOrder(updated);
}

export class MenuItemError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function serializeMenuItem(item) {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    available: item.available,
    restaurantId: item.restaurantId,
    categoryId: item.categoryId,
    category: item.category ? { id: item.category.id, name: item.category.name } : null,
    createdAt: item.createdAt,
  };
}

export function validateMenuItemInput(data) {
  const name = (data.name || "").trim();
  if (!name) throw new MenuItemError("Falta el nombre del plato", 400);
  const price = Number(data.price);
  if (!Number.isFinite(price) || price < 0) throw new MenuItemError("El precio no es válido", 400);
  if (!data.restaurantId) throw new MenuItemError("Falta el restaurante", 400);
  return {
    name,
    description: data.description ? String(data.description).trim() : null,
    price: Math.round(price),
    available: data.available !== false,
    restaurantId: data.restaurantId,
    categoryId: data.categoryId || null,
  };
}

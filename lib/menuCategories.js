export class MenuCategoryError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function serializeMenuCategory(category) {
  return {
    id: category.id,
    name: category.name,
    order: category.order,
    restaurantId: category.restaurantId,
  };
}

export function validateMenuCategoryInput(data) {
  const name = (data.name || "").trim();
  if (!name) throw new MenuCategoryError("Falta el nombre de la categoría", 400);
  if (!data.restaurantId) throw new MenuCategoryError("Falta el restaurante", 400);
  return {
    name,
    order: Number.isFinite(Number(data.order)) ? Number(data.order) : 0,
    restaurantId: data.restaurantId,
  };
}

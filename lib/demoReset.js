import { prisma } from "@/lib/prisma";
import { RESTAURANTS, MENU } from "@/lib/demoData.mjs";

// Botón "Restablecer demo": borra todo (transaccional) y vuelve a sembrar el
// catálogo base de restaurantes/menús, para que cualquiera pueda romper la
// demo probando pedidos y vuelva a un estado conocido.
export async function resetDemoData() {
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.menuItem.deleteMany(),
    prisma.menuCategory.deleteMany(),
    prisma.restaurant.deleteMany(),
  ]);

  for (const r of RESTAURANTS) {
    const restaurant = await prisma.restaurant.create({
      data: {
        name: r.name,
        slug: r.slug,
        cuisine: r.cuisine,
        description: r.description,
        deliveryFee: r.deliveryFee,
        etaMinutes: r.etaMinutes,
        rating: r.rating,
      },
    });

    const menu = MENU[r.slug];
    const categoryByName = {};
    for (const [index, name] of menu.categories.entries()) {
      categoryByName[name] = await prisma.menuCategory.create({
        data: { name, order: index, restaurantId: restaurant.id },
      });
    }

    for (const item of menu.items) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description || null,
          price: item.price,
          restaurantId: restaurant.id,
          categoryId: categoryByName[item.category]?.id || null,
        },
      });
    }
  }
}

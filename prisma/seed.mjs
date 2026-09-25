import { PrismaClient } from "@prisma/client";
import { RESTAURANTS, MENU } from "../lib/demoData.mjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding restaurants...");
  for (const r of RESTAURANTS) {
    const restaurant = await prisma.restaurant.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
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
      let category = await prisma.menuCategory.findFirst({ where: { name, restaurantId: restaurant.id } });
      if (!category) {
        category = await prisma.menuCategory.create({ data: { name, order: index, restaurantId: restaurant.id } });
      }
      categoryByName[name] = category;
    }

    for (const item of menu.items) {
      const existing = await prisma.menuItem.findFirst({ where: { name: item.name, restaurantId: restaurant.id } });
      if (existing) continue;
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

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

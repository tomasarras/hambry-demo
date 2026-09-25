import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeMenuItem, validateMenuItemInput, MenuItemError } from "@/lib/menuItems";

const ITEM_INCLUDE = { category: true };

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurantId");
  if (!restaurantId) return NextResponse.json({ error: "Falta restaurantId" }, { status: 400 });

  const items = await prisma.menuItem.findMany({
    where: { restaurantId },
    include: ITEM_INCLUDE,
    orderBy: [{ category: { order: "asc" } }, { createdAt: "asc" }],
  });
  return NextResponse.json(items.map(serializeMenuItem));
}

export async function POST(request) {
  const data = await request.json();
  try {
    const input = validateMenuItemInput(data);
    const item = await prisma.menuItem.create({ data: input, include: ITEM_INCLUDE });
    return NextResponse.json(serializeMenuItem(item), { status: 201 });
  } catch (err) {
    if (err instanceof MenuItemError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

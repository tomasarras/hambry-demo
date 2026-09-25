import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeMenuCategory, validateMenuCategoryInput, MenuCategoryError } from "@/lib/menuCategories";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurantId");
  if (!restaurantId) return NextResponse.json({ error: "Falta restaurantId" }, { status: 400 });

  const categories = await prisma.menuCategory.findMany({ where: { restaurantId }, orderBy: { order: "asc" } });
  return NextResponse.json(categories.map(serializeMenuCategory));
}

export async function POST(request) {
  const data = await request.json();
  try {
    const input = validateMenuCategoryInput(data);
    const category = await prisma.menuCategory.create({ data: input });
    return NextResponse.json(serializeMenuCategory(category), { status: 201 });
  } catch (err) {
    if (err instanceof MenuCategoryError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

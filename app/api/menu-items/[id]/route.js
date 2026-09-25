import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeMenuItem, validateMenuItemInput, MenuItemError } from "@/lib/menuItems";

const ITEM_INCLUDE = { category: true };

export async function GET(request, { params }) {
  const { id } = await params;
  const item = await prisma.menuItem.findUnique({ where: { id }, include: ITEM_INCLUDE });
  if (!item) return NextResponse.json({ error: "Plato no encontrado" }, { status: 404 });
  return NextResponse.json(serializeMenuItem(item));
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const data = await request.json();
  try {
    // Partial update: available-only toggles don't carry name/price, so
    // only validate+overwrite the fields actually present in the body.
    const patch = {};
    if (data.name !== undefined || data.price !== undefined || data.restaurantId !== undefined) {
      const existing = await prisma.menuItem.findUnique({ where: { id } });
      if (!existing) return NextResponse.json({ error: "Plato no encontrado" }, { status: 404 });
      const input = validateMenuItemInput({ ...existing, ...data });
      Object.assign(patch, input);
    }
    if (data.available !== undefined) patch.available = Boolean(data.available);

    const item = await prisma.menuItem.update({ where: { id }, data: patch, include: ITEM_INCLUDE });
    return NextResponse.json(serializeMenuItem(item));
  } catch (err) {
    if (err instanceof MenuItemError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

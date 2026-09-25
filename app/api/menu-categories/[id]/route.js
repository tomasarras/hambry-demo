import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeMenuCategory, validateMenuCategoryInput, MenuCategoryError } from "@/lib/menuCategories";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const data = await request.json();
  try {
    const existing = await prisma.menuCategory.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
    const input = validateMenuCategoryInput({ ...existing, ...data });
    const category = await prisma.menuCategory.update({ where: { id }, data: input });
    return NextResponse.json(serializeMenuCategory(category));
  } catch (err) {
    if (err instanceof MenuCategoryError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

// Items in this category fall back to "sin categoría" (categoryId: null)
// rather than being deleted — see schema.prisma's onDelete: SetNull.
export async function DELETE(request, { params }) {
  const { id } = await params;
  await prisma.menuCategory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

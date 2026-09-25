import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeRestaurant } from "@/lib/restaurants";

export async function GET(request, { params }) {
  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) return NextResponse.json({ error: "Restaurante no encontrado" }, { status: 404 });
  return NextResponse.json(serializeRestaurant(restaurant));
}

// Only isOpen is editable here — the demo doesn't offer restaurant
// creation/deletion through the UI, just the "open/closed" toggle a
// restaurant owner flips from their dashboard header.
export async function PATCH(request, { params }) {
  const { id } = await params;
  const data = await request.json();
  const restaurant = await prisma.restaurant.update({
    where: { id },
    data: { isOpen: Boolean(data.isOpen) },
  });
  return NextResponse.json(serializeRestaurant(restaurant));
}

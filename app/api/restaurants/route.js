import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeRestaurant } from "@/lib/restaurants";

export async function GET() {
  const restaurants = await prisma.restaurant.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(restaurants.map(serializeRestaurant));
}

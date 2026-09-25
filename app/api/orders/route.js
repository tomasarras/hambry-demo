import { NextResponse } from "next/server";
import { createOrder, listOrders, OrderError } from "@/lib/orders";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurantId") || undefined;
  const statusParam = searchParams.get("status");
  const statuses = statusParam ? statusParam.split(",") : undefined;

  const orders = await listOrders({ restaurantId, statuses });
  return NextResponse.json(orders);
}

export async function POST(request) {
  const data = await request.json();
  try {
    const order = await createOrder({
      restaurantId: data.restaurantId,
      items: data.items,
      customerName: data.customerName,
      address: data.address,
      phone: data.phone,
      notes: data.notes,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    if (err instanceof OrderError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

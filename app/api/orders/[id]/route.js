import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus, OrderError } from "@/lib/orders";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const order = await getOrder(id);
    return NextResponse.json(order);
  } catch (err) {
    if (err instanceof OrderError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const data = await request.json();
  try {
    const order = await updateOrderStatus(id, data.status, data.actor);
    return NextResponse.json(order);
  } catch (err) {
    if (err instanceof OrderError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

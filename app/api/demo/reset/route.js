import { NextResponse } from "next/server";
import { resetDemoData } from "@/lib/demoReset";

export async function POST() {
  await resetDemoData();
  return NextResponse.json({ ok: true });
}

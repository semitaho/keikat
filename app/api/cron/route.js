import { NextResponse } from "next/server";

export async function GET() {
  console.log("MENTIIN NYT TÄNNE AINAKIN!");
  return NextResponse.json({ ok: true });
}

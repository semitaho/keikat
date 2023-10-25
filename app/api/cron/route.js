import { NextResponse } from "next/server";

export async function GET(req, res) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).end("Unauthorized");
  }
  console.log("MENTIIN NYT TÄNNE AINAKIN!");
  return NextResponse.json({ ok: true });
}

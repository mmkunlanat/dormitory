// app/api/admin/bills/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      include: { user: true },
      orderBy: { month: "desc" },
    });

    const formatted = bills.map(b => ({
      id: b.id,
      userName: b.user.name,
      room: b.user.room,
      month: b.month,
      rent: b.rent,
      water: b.water,
      electric: b.electric,
      total: b.total,
      status: b.status,   // PENDING | UPLOADED | CONFIRMED | REJECTED
      slipUrl: b.slipUrl,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch bills" }, { status: 500 });
  }
}

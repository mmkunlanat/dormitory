// app/api/admin/bills/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, month, rent, water, electric } = await req.json();

    if (!userId || !month || rent == null || water == null || electric == null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // สร้างบิลจริง
    const bill = await prisma.bill.create({
      data: {
        userId,
        month,
        rent,
        water,
        electric,
        total: rent + water + electric,
        status: "PENDING",
      },
    });

    return NextResponse.json(bill, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create bill" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      where: { status: "PENDING" },
      include: { user: true },
      orderBy: { month: "desc" },
    });

    return NextResponse.json(bills);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "ไม่สามารถดึงข้อมูลบิลได้" }, { status: 500 });
  }
}

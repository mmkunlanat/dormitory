import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { billId, status } = await req.json();

    if (!billId || !status) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    const updatedBill = await prisma.bill.update({
      where: { id: billId },
      data: { status },
    });

    return NextResponse.json(updatedBill);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "อัปเดตบิลไม่สำเร็จ" }, { status: 500 });
  }
}

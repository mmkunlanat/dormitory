import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // import Prisma Client ของคุณ

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { room, month, rent, water, electric } = body;

    if (!room || !month || rent == null || water == null || electric == null) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลครบถ้วน" }, { status: 400 });
    }

    // สร้างบิลใหม่
    const newBill = await prisma.bill.create({
      data: {
        room,
        month,
        rent,
        water,
        electricity: electric,
        paid: false, // เริ่มต้นเป็นยังไม่ชำระ
      },
    });

    return NextResponse.json(newBill);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "ไม่สามารถสร้างบิลได้" }, { status: 500 });
  }
}

// app/api/admin/bills/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, month, rent, water, electric } = data;

    // ตรวจสอบข้อมูลครบ
    if (!userId || !month || rent == null || water == null || electric == null) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลครบทุกช่อง" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าผู้เช่ามีจริง
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบผู้เช่านี้" },
        { status: 404 }
      );
    }

    // คำนวณรวมทั้งหมด
    const total = Number(rent) + Number(water) + Number(electric);

    // สร้างบิล
    const bill = await prisma.bill.create({
      data: {
        userId: Number(userId),
        month,
        rent: Number(rent),
        water: Number(water),
        electric: Number(electric),
        total,
        status: "PENDING",
      },
    });

    return NextResponse.json(bill, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างบิล" },
      { status: 500 }
    );
  }
}

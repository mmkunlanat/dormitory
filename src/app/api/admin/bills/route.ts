import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// กำหนด Status เริ่มต้น
const INITIAL_STATUS = "PENDING";

export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bills);
  } catch (err) {
    console.error("API Error fetching bills:", err);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลบิลได้" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. ดึงข้อมูลจาก Request Body
    const data = await request.json();
    const {
      userId,
      month,
      rent,
      water,
      electric,
      total
    } = data;

    // 2. ตรวจสอบความถูกต้องของข้อมูลเบื้องต้น
    if (!userId || !month || total === undefined) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลสำคัญให้ครบถ้วน (ผู้เช่า, เดือน, ยอดรวม)" },
        { status: 400 }
      );
    }

    // 3. สร้างบิลใหม่ในฐานข้อมูล
    const newBill = await prisma.bill.create({
      data: {
        userId: userId, // MongoDB ObjectId string
        month: month,
        rent: Number(rent) || 0,
        water: Number(water) || 0,
        electric: Number(electric) || 0,
        total: Number(total),
        status: INITIAL_STATUS,
      },
      include: { user: true },
    });

    // 4. ส่ง Response สำเร็จกลับไป
    return NextResponse.json(
      {
        message: "สร้างบิลสำเร็จ",
        bill: newBill
      },
      { status: 201 }
    );

  } catch (err) {
    console.error("API Error during bill creation:", err);
    return NextResponse.json(
      { error: "ไม่สามารถสร้างบิลได้: ข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}

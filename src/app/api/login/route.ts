import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();

    // Hash รหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง User ลง MongoDB
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || "user", // ถ้าไม่ส่งมาจะเป็น user ธรรมดา
        room: "Temp",         // ใส่ห้องมั่วๆ ไปก่อน
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
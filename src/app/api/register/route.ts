// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // รับค่าจากหน้าเว็บ/Postman
    const { email, password, name, role } = await req.json();

    // เช็คว่ามีข้อมูลสำคัญครบไหม
    if (!email || !password) {
        return NextResponse.json({ error: "กรุณากรอก Email และ Password" }, { status: 400 });
    }

    // Hash รหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง User
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        
        // --- จุดที่แก้: ใส่ค่า default ให้ name ถ้าไม่ได้ส่งมา ---
        name: name || "ไม่ระบุชื่อ", 
        
        role: role || "user", 
        room: "Temp",        
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
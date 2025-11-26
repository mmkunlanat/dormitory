// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";

// POST /api/register - Register new user
export async function POST(req: Request) {
  try {
    const { email, password, name, role, room, phone } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "กรุณากรอก Email และ Password" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อ" },
        { status: 400 }
      );
    }

    // เช็คว่า email ซ้ำหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email นี้ถูกใช้งานแล้ว" },
        { status: 409 }
      );
    }

    // Hash รหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง User
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || "user",
        room: room || "Temp",
        phone: phone || null,
      },
    });

    // สร้าง JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email!,
      role: user.role,
      name: user.name,
    });

    // ส่งข้อมูลกลับโดยไม่รวม password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: "สมัครสมาชิกสำเร็จ",
      token,
      user: userWithoutPassword,
    });

  } catch (error: any) {
    console.error("Register Error:", error);

    // จัดการ Prisma error
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email นี้ถูกใช้งานแล้ว" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก" },
      { status: 500 }
    );
  }
}
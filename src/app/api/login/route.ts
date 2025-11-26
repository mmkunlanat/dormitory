import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";

// POST /api/login - Login user with JWT
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "กรุณากรอก Email และ Password" },
        { status: 400 }
      );
    }

    // ค้นหา User จาก email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // เช็คว่ามี user หรือไม่
    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบผู้ใช้งานนี้" },
        { status: 404 }
      );
    }

    // เช็คว่ามี password หรือไม่
    if (!user.password) {
      return NextResponse.json(
        { error: "ผู้ใช้งานนี้ไม่มีรหัสผ่าน" },
        { status: 400 }
      );
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "รหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // สร้าง JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email!,
      role: user.role,
      name: user.name,
    });

    // Login สำเร็จ - ส่งข้อมูล user และ token กลับไป (ไม่ส่ง password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: userWithoutPassword,
    });

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
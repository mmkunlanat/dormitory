import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth-middleware";
import prisma from "@/lib/prisma";

// GET /api/me - Get current user info (Protected route)
export async function GET(req: NextRequest) {
  try {
    // Get user from JWT token
    const tokenUser = getUserFromRequest(req);

    if (!tokenUser) {
      return NextResponse.json(
        { error: "ไม่ได้รับอนุญาต - กรุณา Login ก่อน" },
        { status: 401 }
      );
    }

    // Fetch full user data from database
    const user = await prisma.user.findUnique({
      where: { id: tokenUser.userId },
      select: {
        id: true,
        name: true,
        email: true,
        room: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error: any) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: error.message || "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

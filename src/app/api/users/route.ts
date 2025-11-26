import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { room: 'asc' },
    });
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลผู้เช่าได้" },
      { status: 500 }
    );
  }
}

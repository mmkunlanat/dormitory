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

// POST /api/users
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, room, phone, status } = body;

    if (!name || !room) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อและห้อง" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        room,
        phone,
        status: status || "ACTIVE",
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "ไม่สามารถสร้างผู้เช่าได้" },
      { status: 500 }
    );
  }
}

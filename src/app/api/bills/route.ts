import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

// GET /api/bills - ดึงบิลทั้งหมดของผู้ใช้ (ต้องมี userId ใน query)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "กรุณาระบุ userId" },
                { status: 400 }
            );
        }

        // Validate ObjectId format
        if (!isValidObjectId(userId)) {
            return NextResponse.json(
                { error: "รูปแบบ userId ไม่ถูกต้อง (ต้องเป็น MongoDB ObjectId)" },
                { status: 400 }
            );
        }

        const bills = await prisma.bill.findMany({
            where: { userId },
            include: {
                user: {
                    select: { id: true, name: true, room: true },
                },
                payments: true,
            },
            orderBy: { month: "desc" },
        });

        return NextResponse.json(bills);
    } catch (error) {
        console.error("Error fetching bills:", error);
        return NextResponse.json(
            { error: "ไม่สามารถดึงข้อมูลบิลได้" },
            { status: 500 }
        );
    }
}

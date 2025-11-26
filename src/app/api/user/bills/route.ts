import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/user/bills - ดึงบิลทั้งหมด
export async function GET(req: Request) {
    try {
        // Fetch all bills with related data
        const bills = await prisma.bill.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        room: true,
                        phone: true,
                        email: true,
                    },
                },
                payments: {
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { month: "desc" },
        });

        return NextResponse.json({
            success: true,
            bills,
            total: bills.length,
        });

    } catch (error: any) {
        console.error("Error fetching bills:", error);
        return NextResponse.json(
            {
                success: false,
                error: "ไม่สามารถดึงข้อมูลบิลได้",
                message: error.message,
            },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/test-user - สร้างหรือดึง test user สำหรับการทดสอบ
export async function GET() {
    try {
        // ลองหา test user ที่มีอยู่แล้ว
        let testUser = await prisma.user.findFirst({
            where: { room: "TEST-001" },
        });

        // ถ้าไม่มี ให้สร้างใหม่
        if (!testUser) {
            testUser = await prisma.user.create({
                data: {
                    name: "Test User",
                    room: "TEST-001",
                    phone: "0812345678",
                    email: "test@example.com",
                    status: "ACTIVE",
                },
            });
        }

        return NextResponse.json({
            userId: testUser.id,
            user: testUser,
        });
    } catch (error: any) {
        console.error("Error getting test user:", error);
        return NextResponse.json(
            { error: "ไม่สามารถสร้าง test user ได้", details: error.message },
            { status: 500 }
        );
    }
}

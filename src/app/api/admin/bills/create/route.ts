// โค้ดที่แก้ไขแล้ว
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Types
interface CreateBillRequest {
    userId: number;
    month: string;
    rent: number;
    water: number;
    electric: number;
}

export async function POST(req: NextRequest) {
    let data: Partial<CreateBillRequest> = {}; // ประกาศตัวแปรเพื่อใช้ใน try/catch

    try {
        // 1. ดึงข้อมูลจาก Request Body
        // 💡 การใช้ req.json() มีความเสี่ยงที่จะเกิด Error ถ้า Body ไม่ใช่ JSON ที่ถูกต้อง
        data = await req.json();
        const { userId, month, rent, water, electric } = data;

        // 2. Validation - ตรวจสอบข้อมูลครบถ้วน
        // ใช้ typeof เพื่อตรวจสอบค่าที่ส่งมาให้ถูกต้อง (เช่น rent/water/electric ต้องไม่ใช่ undefined/null และต้องเป็นตัวเลข)
        if (
            !userId || 
            !month || 
            typeof rent !== 'number' || 
            typeof water !== 'number' || 
            typeof electric !== 'number'
        ) {
            return NextResponse.json(
                { 
                    success: false,
                    error: "กรุณากรอกข้อมูลครบถ้วนและถูกต้องตามรูปแบบ",
                    details: "userId (number), month (string), rent, water, electric (number) are required" 
                },
                { status: 400 }
            );
        }

        // 3. Validation - ตรวจสอบค่าตัวเลข
        // ค่า rentNum, waterNum, electricNum ไม่จำเป็นต้องประกาศใหม่ เพราะเราตรวจสอบ type เป็น number แล้ว
        const rentNum = rent;
        const waterNum = water;
        const electricNum = electric;

        if (rentNum < 0 || waterNum < 0 || electricNum < 0) {
            return NextResponse.json(
                { 
                    success: false,
                    error: "ค่าใช้จ่ายต้องไม่ติดลบ" 
                },
                { status: 400 }
            );
        }

        if (rentNum === 0) {
            return NextResponse.json(
                { 
                    success: false,
                    error: "ค่าห้องต้องมากกว่า 0" 
                },
                { status: 400 }
            );
        }

        // 4. Validation - ตรวจสอบรูปแบบเดือน (YYYY-MM)
        const monthRegex = /^\d{4}-\d{2}$/;
        if (!monthRegex.test(month)) {
            return NextResponse.json(
                { 
                    success: false,
                    error: "รูปแบบเดือนไม่ถูกต้อง (ต้องเป็น YYYY-MM)" 
                },
                { status: 400 }
            );
        }

        // 5. ตรวจสอบว่าผู้เช่ามีจริงและยังอยู่
        // 💡 ตรวจสอบว่า userId เป็น Number ก่อนส่งให้ Prisma
        const numericUserId = Number(userId);

        if (isNaN(numericUserId) || numericUserId <= 0) {
             return NextResponse.json(
                { success: false, error: "ID ผู้เช่าไม่ถูกต้อง" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ 
            where: { id: numericUserId } 
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "ไม่พบผู้เช่านี้ในระบบ" },
                { status: 404 }
            );
        }

        // ตรวจสอบสถานะผู้เช่า (สมมติว่า user object มี status field)
        if (user.status === "INACTIVE") {
            return NextResponse.json(
                { success: false, error: "ผู้เช่านี้ได้ย้ายออกแล้ว ไม่สามารถสร้างบิลได้" },
                { status: 400 }
            );
        }

        // 6. ตรวจสอบว่ามีบิลในเดือนนี้สำหรับผู้เช่านี้แล้วหรือไม่
        const existingBill = await prisma.bill.findFirst({
            where: {
                userId: numericUserId,
                month: month,
            },
        });

        if (existingBill) {
            return NextResponse.json(
                { 
                    success: false,
                    error: `มีบิลสำหรับเดือน ${month} ของผู้เช่านี้อยู่แล้ว`,
                    existingBillId: existingBill.id 
                },
                { status: 409 } // Conflict
            );
        }

        // 7. คำนวณยอดรวม
        const total = rentNum + waterNum + electricNum;

        // 8. สร้างบิล
        const bill = await prisma.bill.create({
            data: {
                userId: numericUserId,
                month,
                rent: rentNum,
                water: waterNum,
                electric: electricNum,
                total,
                status: "PENDING",
            },
            include: {
                user: {
                    select: { id: true, name: true, room: true },
                },
            },
        });

        // 9. Log การสร้างบิล (optional)
        console.log(`✅ Created bill #${bill.id} for user ${user.name} (${user.room}) - Month: ${month} - Total: ${total} THB`);

        return NextResponse.json(
            { 
                success: true, 
                message: "สร้างบิลเรียบร้อยแล้ว",
                bill 
            }, 
            { status: 201 }
        );

    } catch (err: any) {
        // 💡 จัดการ Error เฉพาะ: ถ้า req.json() ล้มเหลว จะถูกจับที่นี่
        if (err instanceof SyntaxError && err.message.includes('JSON')) {
             console.error("❌ Create Bill API Error: Invalid JSON body received");
             return NextResponse.json(
                { success: false, error: "รูปแบบข้อมูลที่ส่งมาไม่ถูกต้อง (ไม่ใช่ JSON)" },
                { status: 400 }
            );
        }

        console.error("❌ Create Bill API Error:", err);

        // จัดการ Prisma errors (P2002: Unique constraint failed, P2003: Foreign key constraint failed)
        if (err.code === "P2002") {
            return NextResponse.json(
                { success: false, error: "มีบิลนี้อยู่ในระบบแล้ว (Unique constraint failed)" },
                { status: 409 }
            );
        }

        if (err.code === "P2003") {
            return NextResponse.json(
                { success: false, error: "ข้อมูลผู้เช่าไม่ถูกต้อง (Foreign key constraint failed)" },
                { status: 400 }
            );
        }

        // Generic error
        return NextResponse.json(
            { 
                success: false,
                error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ในการสร้างบิล",
                details: process.env.NODE_ENV === "development" ? err.message : undefined
            },
            { status: 500 }
        );
    }
}
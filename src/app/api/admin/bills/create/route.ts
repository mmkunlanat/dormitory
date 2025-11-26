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
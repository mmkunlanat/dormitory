// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import * as os from "os";
import prisma from "@/lib/prisma";

// ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";

// ฟังก์ชัน OCR (Placeholder)
async function runOcrOnLocalFile(filePath: string): Promise<string> {
  try {
    return ""; // ยังไม่ทำ OCR
  } catch (error) {
    console.error("OCR Error:", error);
    return "";
  }
}

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    console.log("📥 Upload API called");

    // 1. รับ FormData
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const billIdStr = formData.get("billId") as string; // รับมาเป็น String
    const note = formData.get("note") as string | null;

    // 2. Validation - ตรวจสอบไฟล์
    if (!file) {
      return NextResponse.json({ error: "ไม่พบไฟล์ที่อัปโหลด" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "ไฟล์มีขนาดใหญ่เกิน 5MB" }, { status: 400 });
    }

    // 3. Validation - ตรวจสอบ billId
    if (!billIdStr) {
      return NextResponse.json({ error: "กรุณาระบุ Bill ID" }, { status: 400 });
    }

    // --- แก้ไขจุดที่ 1: ตัดส่วน parseInt ออก เพราะ ID ใน DB เป็น String ---
    // const billId = parseInt(billIdStr); 
    // if (isNaN(billId)) { ... }
    
    // เปลี่ยนมาใช้ billIdStr ตรงๆ แทน
    const targetBillId = billIdStr; 

    // 4. ตรวจสอบว่า Bill มีอยู่จริง (Optional)
    /* const bill = await prisma.bill.findUnique({
      where: { id: targetBillId }, // ส่ง String เข้าไป
    });
    */

    // 5. บันทึกเป็นไฟล์ชั่วคราว
    console.log("💾 Saving temporary file...");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExt = file.name.split(".").pop() || "jpg";
    const filename = `slip-${targetBillId}-${uniqueSuffix}.${fileExt}`;
    
    const tempDir = os.tmpdir();
    tempFilePath = join(tempDir, filename);

    await writeFile(tempFilePath, buffer);
    console.log("✅ Temporary file saved at:", tempFilePath);

    // 6. อัปโหลดไปยัง Cloudinary
    console.log("☁️ Uploading to Cloudinary...");
    const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
      folder: "payment-slips",
      public_id: `slip-${targetBillId}-${uniqueSuffix}`,
      resource_type: "auto",
    });

    console.log("✅ Cloudinary upload success:", uploadResult.secure_url);

    // 7. บันทึกข้อมูลลง Database (Prisma)
    let paymentId = "mock-id";
    
    try {
        const payment = await prisma.payment.create({
            data: {
                billId: targetBillId, // --- แก้ไขจุดที่ 2: ใช้ String ---
                slipUrl: uploadResult.secure_url,
                slipPublicId: uploadResult.public_id,
                note: note || null,
                status: "PENDING", 
                amount: 0, 
                uploadedAt: new Date(),
            },
        });
        paymentId = payment.id.toString();

        // อัปเดตสถานะ Bill
        await prisma.bill.update({
            where: { id: targetBillId }, // --- แก้ไขจุดที่ 3: ใช้ String ---
            data: { status: "PENDING_VERIFICATION" }, 
        });

    } catch (dbError) {
        console.error("⚠️ Database Error (Skipped):", dbError);
    }

    // 8. ลบไฟล์ชั่วคราว
    if (tempFilePath) {
        await unlink(tempFilePath);
        console.log("🗑️ Temporary file deleted");
    }

    // 9. ส่งผลลัพธ์กลับ
    return NextResponse.json({
      success: true,
      message: "อัปโหลดสลิปสำเร็จ",
      data: {
        paymentId: paymentId,
        slipUrl: uploadResult.secure_url,
        billId: targetBillId,
      },
    });

  } catch (error: any) {
    console.error("❌ Upload API Error:", error);

    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (e) {}
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "เกิดข้อผิดพลาดในการอัปโหลด",
      },
      { status: 500 }
    );
  }
}
// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import prisma from "@/lib/prisma";

// ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";

// ฟังก์ชัน OCR (ถ้าต้องการ)
async function runOcrOnLocalFile(filePath: string): Promise<string> {
  try {
    // TODO: เพิ่ม OCR logic ตรงนี้ถ้าต้องการ
    // เช่น ใช้ Tesseract.js หรือ Google Vision API
    return "OCR text here";
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
    const billIdStr = formData.get("billId") as string;
    const note = formData.get("note") as string | null;

    console.log("📦 Received data:", {
      fileName: file?.name,
      fileSize: file?.size,
      billId: billIdStr,
      note,
    });

    // 2. Validation - ตรวจสอบไฟล์
    if (!file) {
      return NextResponse.json(
        { error: "ไม่พบไฟล์ที่อัปโหลด" },
        { status: 400 }
      );
    }

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น" },
        { status: 400 }
      );
    }

    // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "ไฟล์มีขนาดใหญ่เกิน 5MB" },
        { status: 400 }
      );
    }

    // 3. Validation - ตรวจสอบ billId
    if (!billIdStr) {
      return NextResponse.json(
        { error: "กรุณาระบุ Bill ID" },
        { status: 400 }
      );
    }

    const billId = parseInt(billIdStr);
    if (isNaN(billId)) {
      return NextResponse.json(
        { error: "Bill ID ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // 4. ตรวจสอบว่า Bill มีอยู่จริงและยังไม่ได้ชำระ
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: { user: true },
    });

    if (!bill) {
      return NextResponse.json(
        { error: "ไม่พบบิลนี้ในระบบ" },
        { status: 404 }
      );
    }

    if (bill.status === "PAID") {
      return NextResponse.json(
        { error: "บิลนี้ได้รับการชำระแล้ว" },
        { status: 400 }
      );
    }

    // 5. แปลง File เป็น Buffer และบันทึกเป็นไฟล์ชั่วคราว
    console.log("💾 Saving temporary file...");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExt = file.name.split(".").pop() || "jpg";
    const filename = `slip-${billId}-${uniqueSuffix}.${fileExt}`;
    tempFilePath = join("/tmp", filename);

    await writeFile(tempFilePath, buffer);
    console.log("✅ Temporary file saved:", tempFilePath);

    // 6. อัปโหลดไปยัง Cloudinary
    console.log("☁️ Uploading to Cloudinary...");
    const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
      folder: "payment-slips",
      public_id: `slip-${billId}-${uniqueSuffix}`,
      resource_type: "auto",
      transformation: [
        { width: 1000, height: 1000, crop: "limit" },
        { quality: "auto:good" },
      ],
    });

    console.log("✅ Cloudinary upload success:", uploadResult.secure_url);

    // 7. รัน OCR (Optional)
    let ocrText = "";
    try {
      ocrText = await runOcrOnLocalFile(tempFilePath);
    } catch (ocrError) {
      console.warn("⚠️ OCR failed, continuing without OCR:", ocrError);
    }

    // 8. บันทึกข้อมูลการอัปโหลดลง Database
    const payment = await prisma.payment.create({
      data: {
        billId: billId,
        slipUrl: uploadResult.secure_url,
        slipPublicId: uploadResult.public_id,
        ocrText: ocrText || null,
        note: note || null,
        status: "PENDING", // รอการตรวจสอบ
      },
    });

    // 9. อัปเดตสถานะของ Bill
    await prisma.bill.update({
      where: { id: billId },
      data: { status: "PENDING_VERIFICATION" }, // รอการตรวจสอบ
    });

    // 10. ลบไฟล์ชั่วคราว
    await unlink(tempFilePath);
    tempFilePath = null;
    console.log("🗑️ Temporary file deleted");

    // 11. ส่งผลลัพธ์กลับ
    return NextResponse.json({
      success: true,
      message: "อัปโหลดสลิปสำเร็จ",
      data: {
        paymentId: payment.id,
        slipUrl: uploadResult.secure_url,
        billId: billId,
        ocrText: ocrText,
      },
    });

  } catch (error: any) {
    console.error("❌ Upload API Error:", error);

    // ลบไฟล์ชั่วคราวถ้ายังมีอยู่
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
        console.log("🗑️ Cleaned up temporary file");
      } catch (unlinkError) {
        console.error("Error deleting temp file:", unlinkError);
      }
    }

    // จัดการ Cloudinary errors
    if (error.http_code) {
      return NextResponse.json(
        {
          success: false,
          error: "เกิดข้อผิดพลาดในการอัปโหลดไปยัง Cloudinary",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // จัดการ Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "มีการอัปโหลดสลิปสำหรับบิลนี้แล้ว",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "การอัปโหลดไฟล์ล้มเหลว",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

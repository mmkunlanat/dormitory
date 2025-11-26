// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import * as os from "os";
import { MongoClient, GridFSBucket } from "mongodb";
import prisma from "@/lib/prisma";
import { DATABASE_URL } from "@/lib/env";

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
  let client: MongoClient | null = null;

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

    // เปลี่ยนมาใช้ billIdStr ตรงๆ แทน
    const targetBillId = billIdStr;

    // 4. บันทึกเป็นไฟล์ชั่วคราว
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

    // 5. เชื่อมต่อกับ MongoDB Atlas
    console.log("🔗 Connecting to MongoDB Atlas...");
    console.log("Database URL:", DATABASE_URL);
    client = new MongoClient(DATABASE_URL!);
    await client.connect();
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: "payment-slips" });

    // 6. อัปโหลดไฟล์ไปยัง MongoDB GridFS
    console.log("📤 Uploading to MongoDB GridFS...");
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        billId: targetBillId,
        note: note,
        uploadedAt: new Date(),
        contentType: file.type,
      },
    });

    // Read the file and pipe to GridFS
    const fs = require('fs');
    const fileStream = fs.createReadStream(tempFilePath);
    
    await new Promise((resolve, reject) => {
      fileStream.pipe(uploadStream)
        .on('error', reject)
        .on('finish', resolve);
    });

    const fileId = uploadStream.id;
    console.log("✅ MongoDB upload success with file ID:", fileId);

    // 7. สร้าง URL สำหรับเข้าถึงไฟล์ (API endpoint ที่จะสร้างต่อไป)
    const slipUrl = `/api/files/${fileId}`;

    // 8. บันทึกข้อมูลลง Database (Prisma)
    let paymentId = "mock-id";
    
    try {
        const payment = await prisma.payment.create({
            data: {
                billId: targetBillId,
                slipUrl: slipUrl,
                slipPublicId: fileId.toString(), // เก็บ GridFS file ID
                note: note || null,
                status: "PENDING",
                amount: 0,
            },
        });
        paymentId = payment.id.toString();

        // อัปเดตสถานะ Bill
        await prisma.bill.update({
            where: { id: targetBillId },
            data: { status: "PENDING_VERIFICATION" },
        });

    } catch (dbError) {
        console.error("⚠️ Database Error (Skipped):", dbError);
    }

    // 9. ลบไฟล์ชั่วคราว
    if (tempFilePath) {
        await unlink(tempFilePath);
        console.log("🗑️ Temporary file deleted");
    }

    // 10. ปิดการเชื่อมต่อ MongoDB
    if (client) {
        await client.close();
    }

    // 11. ส่งผลลัพธ์กลับ
    return NextResponse.json({
      success: true,
      message: "อัปโหลดสลิปสำเร็จ",
      data: {
        paymentId: paymentId,
        slipUrl: slipUrl,
        billId: targetBillId,
      },
    });

  } catch (error: any) {
    console.error("❌ Upload API Error:", error);

    // ลบไฟล์ชั่วคราวถ้ามี
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (e) {}
    }

    // ปิดการเชื่อมต่อ MongoDB ถ้ามี
    if (client) {
      try {
        await client.close();
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
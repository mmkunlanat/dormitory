// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { runOcrOnLocalFile } from "@/lib/ocr";

// ตั้งค่า Cloudinary (ควรใส่ใน config file หรือ environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    // 1. รับ FormData จาก Request
    const formData = await req.formData();
    const file = formData.get("file") as File;

    // ตรวจสอบว่ามีไฟล์หรือไม่
    if (!file) {
      return NextResponse.json(
        { error: "ไม่พบไฟล์ที่อัปโหลด" },
        { status: 400 }
      );
    }

    // ตรวจสอบประเภทไฟล์ (ถ้าต้องการ)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น" },
        { status: 400 }
      );
    }

    // 2. แปลง File เป็น Buffer และบันทึกเป็นไฟล์ชั่วคราว
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    tempFilePath = join("/tmp", filename);

    // บันทึกไฟล์ชั่วคราว
    await writeFile(tempFilePath, buffer);

    // 3. อัปโหลดไปยัง Cloudinary
    const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
      folder: "slips",
      resource_type: "auto",
    });

    // 4. รัน OCR
    const ocrText = await runOcrOnLocalFile(tempFilePath);

    // 5. ลบไฟล์ชั่วคราว
    await unlink(tempFilePath);
    tempFilePath = null; // รีเซ็ตเพื่อไม่ให้ลบซ้ำใน finally

    // 6. ส่งผลลัพธ์กลับ
    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      ocrText,
    });

  } catch (error: any) {
    console.error("Upload API Error:", error);

    // ลบไฟล์ชั่วคราวถ้ายังมีอยู่
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (unlinkError) {
        console.error("Error deleting temp file:", unlinkError);
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "การอัปโหลดไฟล์ล้มเหลว",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
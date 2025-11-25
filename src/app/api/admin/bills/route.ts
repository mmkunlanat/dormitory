// src/app/api/admin/bills/create/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// กำหนด Status เริ่มต้น
const INITIAL_STATUS = "PENDING";

export async function POST(request: Request) {
  try {
    // 1. ดึงข้อมูลจาก Request Body
    // ใช้ try/catch ครอบส่วนนี้เผื่อข้อมูลที่ส่งมาไม่ใช่ JSON ที่ถูกต้อง
    const data = await request.json(); 

    // 2. ดึงค่าที่จำเป็นจาก Data ที่รับมา
    // 💡 สำคัญ: ตรวจสอบว่าชื่อ field ตรงกับที่ Frontend ส่งมา
    const { 
        userId, 
        month, 
        rent, 
        water, 
        electric, 
        total 
    } = data;

    // 3. ตรวจสอบความถูกต้องของข้อมูลเบื้องต้น
    if (!userId || !month || total === undefined) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลสำคัญให้ครบถ้วน (ผู้เช่า, เดือน, ยอดรวม)" },
        { status: 400 } // 400 Bad Request
      );
    }

    // 4. สร้างบิลใหม่ในฐานข้อมูล
    const newBill = await prisma.bill.create({
      data: {
        userId: userId,
        month: month, 
        rent: parseFloat(rent) || 0, // แปลงเป็น float และกำหนดค่าเริ่มต้นหากไม่มี
        water: parseFloat(water) || 0,
        electric: parseFloat(electric) || 0,
        total: parseFloat(total),
        status: INITIAL_STATUS, // PENDING
        // slipUrl: จะเป็น null เมื่อสร้างบิล
      },
      include: { user: true },
    });

    // 5. ส่ง Response สำเร็จกลับไป
    return NextResponse.json(
      { 
        message: "สร้างบิลสำเร็จ", 
        bill: newBill 
      }, 
      { status: 201 } // 201 Created
    );

  } catch (err) {
    // 6. ดักจับข้อผิดพลาดของเซิร์ฟเวอร์/ฐานข้อมูล
    console.error("API Error during bill creation:", err);
    
    // ส่ง JSON Error กลับไปแทนที่จะปล่อยให้เป็น HTML Error
    return NextResponse.json(
      { error: "ไม่สามารถสร้างบิลได้: ข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 } // 500 Internal Server Error
    );
  }
}


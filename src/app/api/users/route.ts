import { NextResponse } from "next/server";

// ตัวอย่างข้อมูลผู้เช่า (คุณสามารถเปลี่ยนเป็นดึงจากฐานข้อมูลจริง)
const users = [
  { id: 1, name: "สมชาย ใจดี", room: "A101", phone: "080-123-4567", status: "ACTIVE" },
  { id: 2, name: "ณัฐวดี ทองดี", room: "A102", phone: "081-555-7890", status: "ACTIVE" },
  { id: 3, name: "กิตติชัย กุลวงศ์", room: "A103", phone: "089-222-1111", status: "INACTIVE" },
];

// GET /api/users
export async function GET() {
  try {
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลผู้เช่าได้" },
      { status: 500 }
    );
  }
}

// scripts/create-admin.ts
// Script to create an admin user in the database

import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function createAdmin() {
  try {
    const adminEmail = "admin@dormitory.com";
    const adminPassword = "admin123456"; // รหัสผ่านเริ่มต้น
    const adminName = "ผู้ดูแลระบบ";

    // ตรวจสอบว่ามี admin อยู่แล้วหรือไม่
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("❌ Admin user already exists with email:", adminEmail);
      console.log("ข้อมูล Admin ที่มีอยู่:");
      console.log("- Email:", existingAdmin.email);
      console.log("- Name:", existingAdmin.name);
      console.log("- Role:", existingAdmin.role);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // สร้าง admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: "admin",
        room: "Admin",
        status: "active",
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("\n📋 Admin Credentials:");
    console.log("════════════════════════════════");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("Role:", admin.role);
    console.log("════════════════════════════════");
    console.log("\n⚠️  Please change the password after first login!");

  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createAdmin()
  .then(() => {
    console.log("\n✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });

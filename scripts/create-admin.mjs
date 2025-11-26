// scripts/create-admin.mjs
// Script to create an admin user via API

const adminData = {
  email: "admin@dormitory.com",
  password: "admin123456",
  name: "ผู้ดูแลระบบ",
  role: "admin",
  room: "Admin"
};

async function createAdmin() {
  try {
    console.log("🔄 Creating admin user...\n");

    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        console.log("⚠️  Admin user already exists!");
        console.log("\n📋 Use these credentials to login:");
        console.log("════════════════════════════════");
        console.log("Email:", adminData.email);
        console.log("Password:", adminData.password);
        console.log("════════════════════════════════");
        return;
      }
      throw new Error(data.error || "Failed to create admin");
    }

    console.log("✅ Admin user created successfully!\n");
    console.log("📋 Admin Credentials:");
    console.log("════════════════════════════════");
    console.log("Email:", adminData.email);
    console.log("Password:", adminData.password);
    console.log("Role:", data.user.role);
    console.log("════════════════════════════════");
    console.log("\n⚠️  Please change the password after first login!");

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.log("\n💡 Make sure the development server is running:");
    console.log("   npm run dev");
    process.exit(1);
  }
}

createAdmin();

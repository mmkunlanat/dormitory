import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ระบบหอพักออนไลน์",
  description: "เว็บสำหรับจัดการค่าห้องและค่าน้ำค่าไฟ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={inter.variable}>
        {/* ส่วน Header ทั่วไป */}
        <header style={{ padding: '16px 24px', background: '#2563eb', color: '#fff', fontWeight: 600 }}>
          ระบบหอพักออนไลน์
        </header>
        {/* เนื้อหาของแต่ละหน้า */}
        <main>{children}</main>
      </body>
    </html>
  );
}
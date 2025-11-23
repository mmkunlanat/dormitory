import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ระบบหอพักออนไลน์",
  description: "เว็บสำหรับจัดการค่าห้องและค่าน้ำค่าไฟ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
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
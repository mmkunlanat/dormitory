"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const PageWrap = styled.div`
  min-height: 100vh;
  background: #f4f6f9;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #0b2545;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(12, 24, 48, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #2563eb, #4f46e5);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

// แก้ตรงนี้ไม่ให้ส่ง boolean เข้า DOM
const Status = styled.span<{ $paid?: boolean }>`
  font-weight: 600;
  color: ${(p) => (p.$paid ? "#16a34a" : "#b91c1c")};
`;

export default function DashboardPage() {
  const router = useRouter();

  const bills = [
    { month: "พฤศจิกายน 2025", room: "101", rent: 5000, water: 200, electricity: 300, paid: false },
    { month: "ตุลาคม 2025", room: "101", rent: 5000, water: 180, electricity: 250, paid: true },
  ];

  return (
    <PageWrap>
      <Header>
        <Title>Dashboard ผู้เช่า</Title>
        <Button onClick={() => router.push("/login")}>ออกจากระบบ</Button>
      </Header>

      <CardContainer>
        {bills.map((bill, index) => (
          <Card key={index}>
            <h2>
              {bill.month} - ห้อง {bill.room}
            </h2>
            <p>ค่าห้อง: {bill.rent} บาท</p>
            <p>ค่าน้ำ: {bill.water} บาท</p>
            <p>ค่าไฟ: {bill.electricity} บาท</p>
            <p>รวมทั้งหมด: {bill.rent + bill.water + bill.electricity} บาท</p>
            <Status $paid={bill.paid}>{bill.paid ? "ชำระแล้ว" : "ยังไม่ชำระ"}</Status>
            {!bill.paid && (
              <Button onClick={() => router.push("/bill/upload")}>อัปโหลดสลิป</Button>
            )}
          </Card>
        ))}
      </CardContainer>
    </PageWrap>
  );
}

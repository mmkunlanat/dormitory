"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  font-family: sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #0b2545;
`;

const Button = styled.button`
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #2563eb, #4f46e5);
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  padding: 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: 0.2s ease;
`;

const CardTitle = styled.h2`
  font-size: 20px;
  margin: 0;
  color: #0b2545;
`;

const CardDesc = styled.p`
  font-size: 16px;
  color: #555;
`;

export default function AdminDashboardPage() {
  const router = useRouter();

  // ⛔ ป้องกันคนที่ไม่ใช่ admin
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      router.replace("/login");
    }
  }, []);

  const cards = [
    { title: "จัดการผู้ใช้", desc: "ดู/แก้ไขข้อมูลผู้เช่า", route: "/admin/users" },
    { title: "บิลรอตรวจสอบ", desc: "อนุมัติหรือปฏิเสธบิล", route: "/admin/bills/pending" },
    { title: "สร้างบิลใหม่", desc: "เพิ่มบิลค่าน้ำ ค่าไฟ และค่าห้อง", route: "/admin/bills/create" },
  ];

  return (
    <Container>
      <Header>
        <Title>Admin Dashboard</Title>
        <Button
          onClick={() => {
            localStorage.removeItem("role");
            router.push("/login");
          }}
        >
          ออกจากระบบ
        </Button>
      </Header>

      <CardContainer>
        {cards.map((card, index) => (
          <Card key={index} onClick={() => router.push(card.route)}>
            <CardTitle>{card.title}</CardTitle>
            <CardDesc>{card.desc}</CardDesc>
          </Card>
        ))}
      </CardContainer>
    </Container>
  );
}

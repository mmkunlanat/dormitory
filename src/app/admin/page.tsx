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

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #0b2545;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(12, 24, 48, 0.08);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Number = styled.span`
  font-size: 30px;
  font-weight: 700;
  color: #2563eb;
`;

const Label = styled.span`
  font-size: 16px;
  color: #1f2937;
  font-weight: 500;
`;

const Button = styled.button`
  padding: 12px 18px;
  background: linear-gradient(90deg, #2563eb, #4f46e5);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  margin-top: 10px;
  &:hover {
    opacity: 0.9;
  }
`;

const Section = styled.div`
  margin-top: 20px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(12, 24, 48, 0.08);
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #0b2545;
  margin-bottom: 16px;
`;

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ListItem = styled.li`
  background: #eef2ff;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #c7d2fe;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function AdminDashboard() {
  const router = useRouter();

  // mock data (ภายหลัง fetch จาก backend)
  const stats = {
    users: 14,
    totalBills: 14,
    unpaidBills: 3,
    paidBills: 11,
  };

  const recent = [
    { room: "101", name: "สมชาย", status: "ยังไม่จ่าย", amount: 5230 },
    { room: "202", name: "มานี", status: "ชำระแล้ว", amount: 4700 },
    { room: "303", name: "บุญมี", status: "ยังไม่จ่าย", amount: 5100 },
  ];

  return (
    <PageWrap>
      <Title>Admin Dashboard (เจ้าของหอ)</Title>

      <Grid>
        <StatCard>
          <Number>{stats.users}</Number>
          <Label>ผู้เช่าทั้งหมด</Label>
        </StatCard>

        <StatCard>
          <Number>{stats.totalBills}</Number>
          <Label>บิลเดือนนี้ทั้งหมด</Label>
        </StatCard>

        <StatCard>
          <Number>{stats.unpaidBills}</Number>
          <Label style={{ color: "#b91c1c" }}>ยังไม่ชำระ</Label>
        </StatCard>

        <StatCard>
          <Number>{stats.paidBills}</Number>
          <Label style={{ color: "#16a34a" }}>ชำระแล้ว</Label>
        </StatCard>
      </Grid>

      <Button onClick={() => router.push("/admin/users")}>
        จัดการผู้เช่า
      </Button>
      <Button onClick={() => router.push("/admin/bills")}>
        จัดการบิลทั้งหมด
      </Button>

      <Section>
        <SectionTitle>การชำระเงินล่าสุด</SectionTitle>
        <List>
          {recent.map((item, i) => (
            <ListItem key={i}>
              <span>
                ห้อง {item.room} - {item.name}
              </span>
              <strong
                style={{
                  color: item.status === "ชำระแล้ว" ? "#16a34a" : "#b91c1c",
                }}
              >
                {item.status} ({item.amount} บาท)
              </strong>
            </ListItem>
          ))}
        </List>
      </Section>
    </PageWrap>
  );
}

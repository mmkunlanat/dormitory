"use client";
import styled from "styled-components";
import { useState } from "react";
import Link from "next/link";

// Mock data
const mockStats = {
  totalUsers: 25,
  pendingBills: 8,
  confirmedBills: 50,
  rejectedBills: 3
};

const Container = styled.div`
  min-height: 100vh;
  background: #f4f6f9;
  padding: 60px 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 32px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

const StatCard = styled.div<{ color: string }>`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0px 12px 24px rgba(0,0,0,0.08);
  border-left: 6px solid ${({ color }) => color};
`;

const StatNumber = styled.div`
  font-size: 28px;
  font-weight: 700;
`;

const StatLabel = styled.div`
  font-size: 16px;
  color: #666;
  margin-top: 4px;
`;

const NavLink = styled(Link)`
  display: inline-block;
  margin-top: 12px;
  padding: 8px 16px;
  background-color: #4f46e5;
  color: #fff;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  &:hover {
    background-color: #3730a3;
  }
`;

export default function AdminDashboard() {
  const [stats] = useState(mockStats);

  return (
    <Container>
      <Title>Admin Dashboard</Title>
      <CardGrid>
        <StatCard color="#4f46e5">
          <StatNumber>{stats.totalUsers}</StatNumber>
          <StatLabel>ผู้เช่าทั้งหมด</StatLabel>
          <NavLink href="/admin/users">จัดการผู้เช่า</NavLink>
        </StatCard>

        <StatCard color="#f59e0b">
          <StatNumber>{stats.pendingBills}</StatNumber>
          <StatLabel>บิลรออนุมัติ</StatLabel>
          <NavLink href="/admin/bills/pending">ตรวจสอบบิล</NavLink>
        </StatCard>

        <StatCard color="#10b981">
          <StatNumber>{stats.confirmedBills}</StatNumber>
          <StatLabel>บิลชำระแล้ว</StatLabel>
          <NavLink href="/admin/bills">ทั้งหมด</NavLink>
        </StatCard>

        <StatCard color="#ef4444">
          <StatNumber>{stats.rejectedBills}</StatNumber>
          <StatLabel>บิลถูกปฏิเสธ</StatLabel>
          <NavLink href="/admin/bills">ทั้งหมด</NavLink>
        </StatCard>
      </CardGrid>
    </Container>
  );
}

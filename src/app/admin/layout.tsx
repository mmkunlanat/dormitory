"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f4f6f9;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #0b2545;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
`;

const SidebarTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 30px;
`;

const NavItem = styled.button<{ active?: boolean }>`
  background: ${(p) => (p.active ? "#2563eb" : "transparent")};
  border: none;
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #2563eb;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
`;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <LayoutWrapper>
      <Sidebar>
        <SidebarTitle>Admin Panel</SidebarTitle>
        <NavItem onClick={() => router.push("/admin")}>Dashboard</NavItem>
        <NavItem onClick={() => router.push("/admin/users")}>ผู้เช่า</NavItem>
        <NavItem onClick={() => router.push("/admin/bills")}>บิลทั้งหมด</NavItem>
        <NavItem onClick={() => router.push("/admin/bills/create")}>สร้างบิล</NavItem>
        <NavItem onClick={() => router.push("/admin/bills/pending")}>รอตรวจสอบ</NavItem>
      </Sidebar>
      <Content>{children}</Content>
    </LayoutWrapper>
  );
}

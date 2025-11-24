"use client";
import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const NavWrap = styled.nav`
  width: 100%;
  background: #0b2545;
  color: white;
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 14px;
`;

const NavButton = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: white;
    color: #0b2545;
  }
`;

export default function Navbar() {
  const router = useRouter();
  return (
    <NavWrap>
      <Logo onClick={() => router.push("/")}>DormPay</Logo>
      <NavLinks>
        <NavButton onClick={() => router.push("/dashboard")}>Dashboard</NavButton>
        <NavButton onClick={() => router.push("/profile")}>Profile</NavButton>
        <NavButton onClick={() => router.push("/login")}>Logout</NavButton>
      </NavLinks>
    </NavWrap>
  );
}

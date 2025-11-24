"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const PageWrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f6f8fb 0%, #eef2f7 100%);
  padding: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(12, 24, 48, 0.08);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #0b2545;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #566674;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background: ${(p) => p.variant === 'secondary' ? '#e4e8ef' : 'linear-gradient(90deg,#2563eb,#4f46e5)'};
  color: ${(p) => p.variant === 'secondary' ? '#0b2545' : '#fff'};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s ease;
  &:hover {
    opacity: 0.9;
  }
`;

export default function Home() {
  const router = useRouter();

  return (
    <PageWrap>
      <Card>
        <Title>ยินดีต้อนรับสู่ระบบหอพักออนไลน์</Title>
        <Subtitle>จัดการค่าห้องและค่าน้ำค่าไฟของคุณได้ง่าย ๆ</Subtitle>
        <ButtonGroup>
          <Button variant="primary" onClick={() => router.push('/login')}>เข้าสู่ระบบ</Button>
          <Button variant="secondary" onClick={() => router.push('/register')}>สมัครสมาชิก</Button>
        </ButtonGroup>
      </Card>
    </PageWrap>
  );
}

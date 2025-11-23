"use client";
import styled from "styled-components";
import { useState } from "react";

// ตัวอย่างข้อมูล user mock (รอเชื่อมกับ DB / API)
const mockUser = {
  name: "กุลนาถ รัตนวรรณ",
  email: "kunlanat@example.com",
  phone: "081-234-5678",
  room: "ห้อง A101",
  bankAccount: {
    bankName: "ธนาคารกรุงเทพ",
    accountNo: "123-4-56789-0",
    accountName: "กุลนาถ รัตนวรรณ"
  }
};

const Container = styled.div`
  min-height: 100vh;
  background: #f4f6f9;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 20px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0px 12px 24px rgba(0,0,0,0.08);
  padding: 32px;
  width: 420px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const Field = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const Value = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const EditButton = styled.button`
  margin-top: 24px;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background-color: #4f46e5;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  &:hover {
    background-color: #3730a3;
  }
`;

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser);

  return (
    <Container>
      <Card>
        <Title>ข้อมูลส่วนตัว</Title>

        <Field>
          <Label>ชื่อ-นามสกุล</Label>
          <Value>{user.name}</Value>
        </Field>

        <Field>
          <Label>อีเมล</Label>
          <Value>{user.email}</Value>
        </Field>

        <Field>
          <Label>เบอร์โทร</Label>
          <Value>{user.phone}</Value>
        </Field>

        <Field>
          <Label>ห้อง</Label>
          <Value>{user.room}</Value>
        </Field>

        <Field>
          <Label>บัญชีธนาคาร</Label>
          <Value>{user.bankAccount.bankName} | {user.bankAccount.accountNo} | {user.bankAccount.accountName}</Value>
        </Field>

        <EditButton>แก้ไขข้อมูล</EditButton>
      </Card>
    </Container>
  );
}

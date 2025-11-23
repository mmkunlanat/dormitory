"use client";

import React from "react";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  padding: 40px;
  background: #f4f6f9;
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
`;

const Card = styled.div`
  max-width: 600px;
  margin: 0 auto 20px auto;
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
`;

const Field = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const FieldLabel = styled.div`
  font-weight: 600;
  color: #555;
`;

const FieldValue = styled.div`
  font-weight: 500;
  color: #111;
`;

const EditButton = styled.button`
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #4a90e2;
  color: white;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #357abf; }
`;

export default function ProfilePage() {
  // ตัวอย่างข้อมูลผู้เช่า (จริง ๆ ต่อ Firebase / DB)
  const user = {
    fullname: "Mint Kunlanat",
    email: "stu6612732138@sskru.ac.th",
    room: "101",
    phone: "0812345678",
  };

  return (
    <Container>
      <Header>
        <Title>ข้อมูลผู้เช่า</Title>
      </Header>

      <Card>
        <Field><FieldLabel>ชื่อ-นามสกุล</FieldLabel><FieldValue>{user.fullname}</FieldValue></Field>
        <Field><FieldLabel>อีเมล</FieldLabel><FieldValue>{user.email}</FieldValue></Field>
        <Field><FieldLabel>ห้องพัก</FieldLabel><FieldValue>{user.room}</FieldValue></Field>
        <Field><FieldLabel>เบอร์โทร</FieldLabel><FieldValue>{user.phone}</FieldValue></Field>

        <EditButton>แก้ไขข้อมูล</EditButton>
      </Card>
    </Container>
  );
}

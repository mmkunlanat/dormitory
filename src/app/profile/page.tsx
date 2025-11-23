"use client";

import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 26px;
  color: #0b2545;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 16px;
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

const Message = styled.p`
  font-size: 16px;
  color: #16a34a;
`;

export default function ProfilePage() {
  // Mock user data
  const [user, setUser] = useState({
    name: "สมชาย ใจดี",
    email: "somchai@example.com",
    phone: "0812345678",
    room: "101",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: save to API
    setMessage("บันทึกข้อมูลเรียบร้อยแล้ว");
  };

  return (
    <Container>
      <Title>โปรไฟล์ผู้ใช้</Title>

      <FormGroup>
        <Label>ชื่อ-นามสกุล</Label>
        <Input name="name" value={user.name} onChange={handleChange} />
      </FormGroup>

      <FormGroup>
        <Label>Email</Label>
        <Input name="email" value={user.email} onChange={handleChange} />
      </FormGroup>

      <FormGroup>
        <Label>เบอร์โทร</Label>
        <Input name="phone" value={user.phone} onChange={handleChange} />
      </FormGroup>

      <FormGroup>
        <Label>ห้อง</Label>
        <Input name="room" value={user.room} onChange={handleChange} />
      </FormGroup>

      <Button onClick={handleSave}>บันทึกข้อมูล</Button>

      {message && <Message>{message}</Message>}
    </Container>
  );
}

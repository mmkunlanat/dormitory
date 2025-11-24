"use client";
import React, { useState } from "react";
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
  font-size: 24px;
  font-weight: 700;
  color: #0b2545;
`;

const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(12, 24, 48, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 600px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 600;
  color: #0b2545;
`;

const Input = styled.input`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  font-size: 16px;
  outline: none;
  &:focus {
    border-color: #2563eb;
  }
`;

const Select = styled.select`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  font-size: 16px;
  outline: none;
  &:focus {
    border-color: #2563eb;
  }
`;

const Button = styled.button`
  padding: 14px 18px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #2563eb, #4f46e5);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

export default function AdminCreateBill() {
  const router = useRouter();

  const [room, setRoom] = useState("");
  const [month, setMonth] = useState("");
  const [rent, setRent] = useState("");
  const [water, setWater] = useState("");
  const [electric, setElectric] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // mock ส่งข้อมูล
    console.log({
      room,
      month,
      rent,
      water,
      electric,
    });

    alert("สร้างบิลสำเร็จ!");
    router.push("/admin/bills");
  };

  return (
    <PageWrap>
      <Title>สร้างบิลใหม่สำหรับผู้เช่า</Title>

      <Card>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          
          <div>
            <Label>เลือกห้อง</Label>
            <Select value={room} onChange={(e) => setRoom(e.target.value)} required>
              <option value="">-- เลือกห้อง --</option>
              <option value="101">101</option>
              <option value="102">102</option>
              <option value="201">201</option>
              <option value="202">202</option>
            </Select>
          </div>

          <div>
            <Label>ประจำเดือน</Label>
            <Input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>ค่าห้อง (บาท)</Label>
            <Input
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>ค่าน้ำ (บาท)</Label>
            <Input
              type="number"
              value={water}
              onChange={(e) => setWater(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>ค่าไฟ (บาท)</Label>
            <Input
              type="number"
              value={electric}
              onChange={(e) => setElectric(e.target.value)}
              required
            />
          </div>

          <Button type="submit">สร้างบิล</Button>
        </form>
      </Card>
    </PageWrap>
  );
}

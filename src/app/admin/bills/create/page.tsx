"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const Container = styled.div`
  min-height: 100vh;
  background: #f4f6f9;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #0b2545;
`;

const FormCard = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.08);
  max-width: 600px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e4e8ef;
  font-size: 14px;
  margin-bottom: 12px;
  outline: none;
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 8px rgba(37, 99, 235, 0.3);
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  background: #2563eb;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #1e40af;
  }
`;

export default function CreateBillPage() {
  const router = useRouter();
  const [room, setRoom] = useState("");
  const [month, setMonth] = useState("");
  const [rent, setRent] = useState("");
  const [water, setWater] = useState("");
  const [electric, setElectric] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!room || !month || !rent || !water || !electric) {
      return alert("กรุณากรอกข้อมูลทุกช่อง");
    }

    setLoading(true);

    try {
      // ตัวอย่างส่ง request ไป API
      const res = await fetch("/api/admin/bills/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room,
          month,
          rent: Number(rent),
          water: Number(water),
          electric: Number(electric),
        }),
      });

      if (!res.ok) throw new Error("เกิดข้อผิดพลาด");

      alert("สร้างบิลเรียบร้อย");
      router.push("/admin/bills/pending"); // กลับไปหน้าบิลรอตรวจสอบ
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถสร้างบิลได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>สร้างบิลใหม่</Title>
      <FormCard>
        <Input
          placeholder="ห้อง เช่น A101"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Input
          placeholder="เดือน เช่น 2025-11"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <Input
          type="number"
          placeholder="ค่าห้อง"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
        />
        <Input
          type="number"
          placeholder="ค่าน้ำ"
          value={water}
          onChange={(e) => setWater(e.target.value)}
        />
        <Input
          type="number"
          placeholder="ค่าไฟ"
          value={electric}
          onChange={(e) => setElectric(e.target.value)}
        />
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "กำลังบันทึก..." : "สร้างบิล"}
        </Button>
      </FormCard>
    </Container>
  );
}

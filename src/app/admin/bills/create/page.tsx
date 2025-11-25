"use client";

import React, { useState, useEffect } from "react";
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
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
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

const Select = styled.select`
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

interface User {
  id: number;
  name: string;
  room: string;
}

export default function CreateBillPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState("");
  const [month, setMonth] = useState("");
  const [rent, setRent] = useState("");
  const [water, setWater] = useState("");
  const [electric, setElectric] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/admin/users"); // API ของผู้เช่า
      const data = await res.json();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!userId || !month || !rent || !water || !electric) {
      return alert("กรุณากรอกข้อมูลทุกช่อง");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/bills/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          month,
          rent: Number(rent),
          water: Number(water),
          electric: Number(electric),
        }),
      });

      if (!res.ok) throw new Error("เกิดข้อผิดพลาด");

      alert("สร้างบิลเรียบร้อย");
      router.push("/admin/bills");
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
        <Select value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">-- เลือกผู้เช่า --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.room})
            </option>
          ))}
        </Select>

        <Input
          type="month"
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

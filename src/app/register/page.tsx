"use client";
import styled from "styled-components";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const PageWrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f6f8fb 0%, #eef2f7 100%);
  padding: 24px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 12px 40px rgba(12, 24, 48, 0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #0b2545;
`;

const Sub = styled.p`
  margin: 0;
  color: #566674;
  font-size: 14px;
`;

const Form = styled.form`
  display: grid;
  gap: 12px;
  margin-top: 8px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #213047;
`;

const Input = styled.input`
  height: 44px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e4e8ef;
  outline: none;
  font-size: 14px;
  transition: 0.12s ease;
  &:focus {
    box-shadow: 0 6px 18px rgba(14, 46, 99, 0.06);
    border-color: #7aa2ff;
  }
`;

const Select = styled.select`
  height: 44px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e4e8ef;
  outline: none;
  font-size: 14px;
`;

const Button = styled.button<{ variant?: "ghost" | "primary" }>`
  height: 48px;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  font-size: 15px;
  font-weight: 600;
  ${(p) =>
    p.variant === "ghost"
      ? `background: transparent; color: #0b2545;`
      : `background: linear-gradient(90deg,#2563eb,#4f46e5); color: white; box-shadow: 0 8px 24px rgba(79,70,229,0.12);`}
`;

const Small = styled.span`
  font-size: 13px;
  color: #4b5b6a;
`;

const Err = styled.div`
  color: #b00020;
  font-size: 13px;
`;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    room: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm({ ...form, [field]: value });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.password || !form.room) {
      setError("โปรดกรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("สมัครสมาชิกไม่สำเร็จ");

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <PageWrap>
      <Card>
        <Title>สมัครสมาชิก</Title>
        <Sub>กรอกข้อมูลเพื่อสร้างบัญชีผู้เช่าในระบบ</Sub>

        <Form onSubmit={handleSubmit}>
          {error && <Err>{error}</Err>}

          <Label>
            ชื่อ - นามสกุล
            <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="ชื่อจริงของคุณ" />
          </Label>

          <Label>
            อีเมล
            <Input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="example@mail.com" />
          </Label>

          <Label>
            รหัสผ่าน
            <Input type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} placeholder="อย่างน้อย 6 ตัวอักษร" />
          </Label>

          <Label>
            ห้องพัก
            <Select value={form.room} onChange={(e) => updateField("room", e.target.value)}>
              <option value="">เลือกห้อง</option>
              <option value="101">101</option>
              <option value="102">102</option>
              <option value="201">201</option>
              <option value="202">202</option>
            </Select>
          </Label>

          <Button type="submit">{loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}</Button>

          <Small style={{ textAlign: "center", marginTop: 6 }}>
            มีบัญชีแล้ว? <a href="/login">เข้าสู่ระบบ</a>
          </Small>
        </Form>
      </Card>
    </PageWrap>
  );
}

"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

// Styled Components
const PageWrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6f9;
  padding: 24px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 12px 40px rgba(12, 24, 48, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h1`margin:0;font-size:20px;font-weight:700;color:#0b2545;`;
const Sub = styled.p`margin:0;color:#566674;font-size:14px;`;
const Form = styled.form`display:grid; gap:12px; margin-top:8px;`;
const Label = styled.label`display:flex; flex-direction:column; gap:6px; font-size:13px; color:#213047;`;
const Input = styled.input`height:44px; padding:10px 12px; border-radius:10px; border:1px solid #e4e8ef; outline:none; font-size:14px; &:focus{border-color:#7aa2ff; box-shadow:0 6px 18px rgba(14,46,99,0.06);}`;
const Button = styled.button`height:48px; border-radius:12px; border:none; cursor:pointer; font-weight:600; font-size:15px; background:linear-gradient(90deg,#2563eb,#4f46e5); color:white; box-shadow:0 8px 24px rgba(79,70,229,0.12);`;
const Err = styled.div`color:#b00020; font-size:13px;`;
const Small = styled.span`font-size:13px; color:#4b5b6a;`;
const LinkText = styled.a`cursor:pointer; color:#2563eb; text-decoration:underline;`;

export default function RegisterPage() {
  const router = useRouter();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullname) { setError("โปรดใส่ชื่อ-นามสกุล"); return; }
    if (!email || !validateEmail(email)) { setError("โปรดใส่อีเมลที่ถูกต้อง"); return; }
    if (!password || password.length < 6) { setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"); return; }
    if (!room) { setError("โปรดใส่เลขห้อง"); return; }

    setLoading(true);
    try {
      // เรียก API Register
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: fullname,
          room,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "สมัครสมาชิกไม่สำเร็จ");
      }

      // Register สำเร็จ - บันทึก token และ user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role || "user");

      // redirect ไปหน้า dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrap>
      <Card>
        <Title>สมัครสมาชิก</Title>
        <Sub>กรอกข้อมูลเพื่อสร้างบัญชีผู้เช่าในระบบ</Sub>

        <Form onSubmit={handleSubmit} noValidate>
          {error && <Err>{error}</Err>}

          <Label>
            <Small>ชื่อ - นามสกุล</Small>
            <Input type="text" value={fullname} onChange={e => setFullname(e.target.value)} placeholder="Mint Kunlanat" required/>
          </Label>

          <Label>
            <Small>อีเมล</Small>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="stu6612732138@sskru.ac.th" required/>
          </Label>

          <Label>
            <Small>รหัสผ่าน</Small>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="•••••••••" required/>
          </Label>

          <Label>
            <Small>ห้องพัก</Small>
            <Input type="text" value={room} onChange={e => setRoom(e.target.value)} placeholder="101" required/>
          </Label>

          <Button type="submit" disabled={loading}>{loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}</Button>
        </Form>

        <div style={{marginTop:10, textAlign:"center"}}>
          <Small>มีบัญชีแล้ว? <LinkText onClick={() => router.push("/login")}>เข้าสู่ระบบ</LinkText></Small>
        </div>
      </Card>
    </PageWrap>
  );
}

"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

// หน้า Login แบบสวยทันสมัย (styled-components)
// - ส่ง POST ไปที่ /api/auth/login (คุณสามารถเปลี่ยนเป็น NextAuth ได้)
// - ไฟล์นี้วางที่: app/login/page.tsx (App Router)

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
  max-width: 480px;
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 12px 40px rgba(12, 24, 48, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 20px;
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
  transition: box-shadow .12s ease, border-color .12s ease;
  &:focus {
    box-shadow: 0 6px 18px rgba(14, 46, 99, 0.06);
    border-color: #7aa2ff;
  }
`;

const Row = styled.div`
  display:flex;
  justify-content: space-between;
  align-items:center;
`;

const Button = styled.button<{ variant?: "primary" | "ghost" }>`
  height: 48px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  ${(p) =>
    p.variant === "ghost"
      ? `background: transparent; color: #0b2545; border: 1px solid transparent; box-shadow:none;`
      : `background: linear-gradient(90deg,#2563eb,#4f46e5); color: white; box-shadow: 0 8px 24px rgba(79,70,229,0.12);`}
`;

const Err = styled.div`
  color: #b00020;
  font-size: 13px;
`;

const Small = styled.span`
  font-size: 13px;
  color: #4b5b6a;
`;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !validateEmail(email)) {
      setError("โปรดใส่อีเมลที่ถูกต้อง");
      return;
    }
    if (!password || password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);
    try {
      // เปลี่ยน endpoint ตามระบบของคุณ (/api/auth/login หรือ /api/auth/signin)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || "ไม่สามารถเข้าสู่ระบบได้");
      }

      // ถ้าต้องการใช้ next-auth ให้เปลี่ยน flow เป็น signIn แล้ว redirect
      // ตัวอย่าง: signIn('credentials',{ redirect: false, email, password })

      // สมมติผู้ใช้เข้าสู่ระบบสำเร็จ ให้ไปหน้า dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrap>
      <Card role="main" aria-labelledby="login-title">
        <div>
          <Title id="login-title">เข้าสู่ระบบ</Title>
          <Sub>เข้าสู่ระบบเพื่อดูบิลและอัปโหลดสลิปชำระเงิน</Sub>
        </div>

        <Form onSubmit={handleSubmit} noValidate>
          {error && <Err role="alert">{error}</Err>}

          <Label>
            <Small>อีเมล</Small>
            <Input
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              autoComplete="email"
              required
            />
          </Label>

          <Label>
            <Row>
              <Small>รหัสผ่าน</Small>
              <Small style={{ cursor: "pointer" }} onClick={() => setShowPassword((s) => !s)}>
                {showPassword ? "ซ่อน" : "แสดง"}
              </Small>
            </Row>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่านของคุณ"
              autoComplete="current-password"
              required
            />
          </Label>

          <Row style={{ marginTop: 6 }}>
            <Small>ยังไม่มีบัญชี? <a href="/register">สมัครสมาชิก</a></Small>
            <Small><a href="/forgot">ลืมรหัสผ่าน?</a></Small>
          </Row>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <Button type="submit" style={{ flex: 1 }} disabled={loading}>
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.push('/')}>ยกเลิก</Button>
          </div>

        </Form>

        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <Small>หรือเข้าสู่ระบบด้วย</Small>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
            {/* ตัวอย่างปุ่ม social (ต้อง implement flow ใน backend) */}
            <button
              style={{ height:40, borderRadius:10, padding:'0 14px', border:'1px solid #e6eefc', background:'#fff', cursor:'pointer' }}
              onClick={() => { /* social login flow */ }}
            >Google</button>
            <button
              style={{ height:40, borderRadius:10, padding:'0 14px', border:'1px solid #e6eefc', background:'#fff', cursor:'pointer' }}
              onClick={() => { /* social login flow */ }}
            >Line</button>
          </div>
        </div>

      </Card>
    </PageWrap>
  );
}

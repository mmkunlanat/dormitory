"use client";

import React, { useState } from "react";
import styled from "styled-components";
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
  max-width: 480px;
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 12px 40px rgba(12, 24, 48, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h1`margin:0; font-size:20px; font-weight:700; color:#0b2545;`;
const Sub = styled.p`margin:0; color:#566674; font-size:14px;`;
const Form = styled.form`display:grid; gap:12px; margin-top:8px;`;
const Label = styled.label`display:flex; flex-direction:column; gap:6px; font-size:13px; color:#213047;`;
const Input = styled.input`
  height:44px;
  padding:10px 12px;
  border-radius:10px;
  border:1px solid #e4e8ef;
  outline:none;
  font-size:14px;
`;

const Button = styled.button`
  height:48px;
  border-radius:12px;
  border:none;
  cursor:pointer;
  font-weight:600;
  font-size:15px;
  background: linear-gradient(90deg,#2563eb,#4f46e5);
  color:white;
`;

const RoleButton = styled.button`
  height:44px;
  width: 100%;
  border-radius:10px;
  border:1px solid #d1d5db;
  cursor:pointer;
  background:white;
  font-weight:600;
  transition:0.15s ease;
  &:hover {
    background:#f3f4f6;
  }
`;

const Row = styled.div`
  display:flex;
  gap:10px;
  margin-top: 10px;
`;

const Err = styled.div`
  color:#b00020;
  font-size:13px;
`;

export default function LoginPage() {
  const router = useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");

  const [step, setStep] = useState<"login" | "role">("login");

  function handleLogin(e:React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setError("");

    // ขั้นตอนต่อไป: เลือกบทบาท
    setStep("role");
  }

  function chooseRole(role: "admin" | "user") {
    localStorage.setItem("role", role);

    if (role === "admin") router.push("/admin");
    else router.push("/dashboard");
  }

  return (
    <PageWrap>
      <Card>

        {step === "login" && (
          <>
            <Title>เข้าสู่ระบบ</Title>
            <Sub>กรอกข้อมูลเพื่อดำเนินการต่อ</Sub>

            <Form onSubmit={handleLogin}>
              {error && <Err>{error}</Err>}

              <Label>อีเมล
                <Input value={email} onChange={e=>setEmail(e.target.value)} />
              </Label>

              <Label>รหัสผ่าน
                <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
              </Label>

              <Button type="submit">ถัดไป</Button>
            </Form>
          </>
        )}

        {step === "role" && (
          <>
            <Title>เลือกประเภทการใช้งาน</Title>
            <Sub>คุณต้องการเข้าสู่ระบบในบทบาทใด?</Sub>

            <Row>
              <RoleButton onClick={() => chooseRole("user")}>เข้าสู่ระบบแบบผู้ใช้งาน</RoleButton>
            </Row>

            <Row>
              <RoleButton onClick={() => chooseRole("admin")}>เข้าสู่ระบบแบบผู้ดูแลระบบ</RoleButton>
            </Row>
          </>
        )}

      </Card>
    </PageWrap>
  );
}

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

const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(12,24,48,0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
  margin: auto;
`;

const Title = styled.h1`
  font-size: 22px;
  color: #0b2545;
  margin: 0;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e4e8ef;
  outline: none;
  font-size: 14px;
`;

const Preview = styled.img`
  max-width: 100%;
  border-radius: 10px;
  margin-top: 12px;
  box-shadow: 0 6px 18px rgba(12,24,48,0.08);
`;

const Button = styled.button`
  padding: 12px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  background: linear-gradient(90deg,#2563eb,#4f46e5);
  color: white;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover {
    opacity: 0.9;
  }
`;

const Err = styled.div`
  color: #b00020;
  font-size: 13px;
`;

export default function UploadPaymentPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("กรุณาเลือกไฟล์สลิปก่อน");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/payment/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('อัปโหลดสลิปไม่สำเร็จ');

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <Card>
        <Title>อัปโหลดสลิปชำระเงิน</Title>
        {error && <Err>{error}</Err>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && <Preview src={preview} alt="preview" />}
          <div style={{ display: 'flex', gap: 12 }}>
            <Button type="submit" style={{ flex: 1 }}>{loading ? 'กำลังอัปโหลด...' : 'ส่งสลิป'}</Button>
            <Button type="button" style={{ flex: 1, background: '#ccc', color: '#333' }} onClick={() => router.push('/dashboard')}>ยกเลิก</Button>
          </div>
        </form>
      </Card>
    </PageWrap>
  );
}

"use client";
import styled from "styled-components";
import { useState } from "react";

const Container = styled.div`
  min-height: 100vh;
  background: #f4f6f9;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 20px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0px 12px 24px rgba(0,0,0,0.08);
  padding: 32px;
  width: 420px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #ccc;
  margin-bottom: 16px;
  font-size: 16px;
`;

const UploadButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background-color: #4f46e5;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  &:hover {
    background-color: #3730a3;
  }
`;

const Message = styled.div`
  margin-top: 16px;
  font-size: 14px;
  color: #10b981;
`;

export default function UploadSlipPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploaded(false);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    // mock upload, รอเชื่อม API จริง
    setTimeout(() => {
      setUploaded(true);
    }, 1000);
  };

  return (
    <Container>
      <Card>
        <Title>อัปโหลดสลิปการโอน</Title>
        <Label>เลือกไฟล์สลิป (PDF, JPG, PNG)</Label>
        <Input type="file" accept=".pdf,.jpg,.png" onChange={handleFileChange} />

        <UploadButton onClick={handleUpload}>
          {file ? "อัปโหลดสลิป" : "เลือกไฟล์ก่อน"}
        </UploadButton>

        {uploaded && <Message>อัปโหลดสลิปสำเร็จ!</Message>}
      </Card>
    </Container>
  );
}


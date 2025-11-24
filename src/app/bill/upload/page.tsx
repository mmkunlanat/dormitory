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
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: sans-serif;
`;

const Title = styled.h1`
  font-size: 26px;
  color: #0b2545;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
`;

const FileInput = styled.input`
  padding: 8px;
`;

const Preview = styled.img`
  width: 200px;
  height: auto;
  border-radius: 12px;
  border: 1px solid #ccc;
  object-fit: cover;
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

export default function UploadSlipPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    // TODO: upload file to API / cloudinary
    alert("อัปโหลดสลิปสำเร็จ (mock)");
  };

  return (
    <Container>
      <Title>อัปโหลดสลิปชำระเงิน</Title>
      <div>
        <Label>เลือกสลิปของคุณ</Label>
        <FileInput type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      {preview && <Preview src={preview} alt="slip preview" />}
      <Button onClick={handleUpload}>อัปโหลดสลิป</Button>
    </Container>
  );
}

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
  color: #0b2545;
  font-weight: 700;
`;

const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(12, 24, 48, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UploadArea = styled.label`
  border: 2px dashed #2563eb;
  border-radius: 14px;
  padding: 30px;
  text-align: center;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: rgba(37, 99, 235, 0.05);
  }
`;

const Preview = styled.img`
  width: 100%;
  border-radius: 12px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #2563eb, #4f46e5);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const OCRBox = styled.div`
  padding: 16px;
  background: #eef2ff;
  border-radius: 12px;
  border: 1px solid #c7d2fe;
`;

export default function UploadSlipPage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const runFakeOCR = () => {
    setLoading(true);
    setTimeout(() => {
      setOcrData({
        sender: "Somchai Payment",
        amount: 5530,
        datetime: "2025-11-20 14:52",
        ref: "TRX5879132TH"
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <PageWrap>
      <Title>อัปโหลดสลิปชำระเงิน</Title>

      <Card>
        {!image && (
          <UploadArea>
            เลือกไฟล์สลิปเพื่ออัปโหลด
            <input type="file" hidden accept="image/*" onChange={handleUpload} />
          </UploadArea>
        )}

        {image && <Preview src={image} alt="slip preview" />}

        {image && !ocrData && (
          <Button onClick={runFakeOCR}>
            {loading ? "กำลังอ่านข้อมูล..." : "อ่านข้อมูลจากสลิป (OCR)"}
          </Button>
        )}

        {ocrData && (
          <OCRBox>
            <h3>ผลลัพธ์ OCR</h3>
            <p>ชื่อผู้โอน: {ocrData.sender}</p>
            <p>จำนวนเงิน: {ocrData.amount} บาท</p>
            <p>วันที่โอน: {ocrData.datetime}</p>
            <p>Ref: {ocrData.ref}</p>
          </OCRBox>
        )}

        {ocrData && (
          <Button onClick={() => router.push("/dashboard")}>
            ยืนยันการชำระเงิน
          </Button>
        )}
      </Card>
    </PageWrap>
  );
}

"use client";
import styled from "styled-components";
import { useState } from "react";
import Link from "next/link";

// Mock data บิล
const mockBill = {
  id: 1,
  month: "พฤศจิกายน 2025",
  rent: 3000,
  water: 150,
  electric: 450,
  total: 3600,
  status: "PENDING", // CONFIRMED, REJECTED
  slipUploaded: false
};

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

const Field = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const Value = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const Status = styled.div<{ status: string }>`
  margin-top: 12px;
  font-weight: 600;
  color: ${({ status }) =>
    status === "CONFIRMED" ? "#10b981" :
    status === "PENDING" ? "#f59e0b" :
    "#ef4444"};
`;

const UploadButton = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 24px;
  padding: 12px;
  border-radius: 12px;
  background-color: #4f46e5;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  &:hover {
    background-color: #3730a3;
  }
`;

export default function BillDetailPage() {
  const [bill] = useState(mockBill);

  return (
    <Container>
      <Card>
        <Title>รายละเอียดบิล {bill.month}</Title>

        <Field>
          <Label>ค่าเช่า</Label>
          <Value>{bill.rent} บาท</Value>
        </Field>

        <Field>
          <Label>ค่าน้ำ</Label>
          <Value>{bill.water} บาท</Value>
        </Field>

        <Field>
          <Label>ค่าไฟ</Label>
          <Value>{bill.electric} บาท</Value>
        </Field>

        <Field>
          <Label>รวมทั้งหมด</Label>
          <Value>{bill.total} บาท</Value>
        </Field>

        <Status status={bill.status}>สถานะ: {bill.status}</Status>

        {!bill.slipUploaded && bill.status === "PENDING" && (
          <UploadButton href="/bill/upload">อัปโหลดสลิป</UploadButton>
        )}

        {bill.slipUploaded && (
          <Value style={{ marginTop: "16px", color: "#10b981" }}>
            สลิปอัปโหลดแล้ว รอการตรวจสอบ
          </Value>
        )}
      </Card>
    </Container>
  );
}

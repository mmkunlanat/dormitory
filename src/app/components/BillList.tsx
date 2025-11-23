"use client";
import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const List = styled.div`
  display: grid;
  gap: 16px;
`;

const BillItem = styled.div`
  background: white;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(12, 24, 48, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Status = styled.span<{ paid?: boolean }>`
  font-weight: 600;
  color: ${(p) => (p.paid ? "#16a34a" : "#b91c1c")};
`;

const Button = styled.button`
  padding: 8px 14px;
  border-radius: 12px;
  border: none;
  background: #2563eb;
  color: white;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

interface Bill {
  id: string;
  month: string;
  room: string;
  rent: number;
  water: number;
  electricity: number;
  paid: boolean;
}

export default function BillList({ bills }: { bills: Bill[] }) {
  const router = useRouter();

  return (
    <List>
      {bills.map((bill) => (
        <BillItem key={bill.id}>
          <div>
            <p>
              {bill.month} - ห้อง {bill.room}
            </p>
            <p>
              รวม: {bill.rent + bill.water + bill.electricity} บาท
            </p>
          </div>
          <div>
            <Status paid={bill.paid}>{bill.paid ? "ชำระแล้ว" : "ยังไม่ชำระ"}</Status>
            {!bill.paid && (
              <Button onClick={() => router.push("/bill/upload")}>อัปโหลดสลิป</Button>
            )}
          </div>
        </BillItem>
      ))}
    </List>
  );
}

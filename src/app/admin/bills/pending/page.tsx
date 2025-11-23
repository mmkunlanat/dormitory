"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface PendingBill {
  id: string;
  user: { name: string };
  room: string;
  month: string;
  amount: number;
  slipUrl?: string;
  status: string;
}

const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  font-family: sans-serif;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 25px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.div`
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  align-items: center;
`;

const BillTitle = styled.h3`
  margin: 0;
  margin-bottom: 8px;
  font-size: 20px;
`;

const SlipImage = styled.img`
  width: 140px;
  height: 180px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #ccc;
`;

const ButtonBox = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ApproveBtn = styled.button`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  background: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const RejectBtn = styled.button`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const NoData = styled.p`
  font-size: 16px;
  color: #555;
`;

export default function PendingBillsPage() {
  const [pending, setPending] = useState<PendingBill[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPendingBills() {
    try {
      const res = await fetch("/api/admin/bills/pending");
      const data = await res.json();
      setPending(data);
    } catch (error) {
      console.error("Failed to fetch bills", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPendingBills();
  }, []);

  async function handleAction(id: string, action: "approve" | "reject") {
    try {
      const res = await fetch("/api/admin/bills/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPendingBills(); // refresh list
      }
    } catch (error) {
      console.error("Failed to update bill", error);
    }
  }

  if (loading) return <Container>กำลังโหลด...</Container>;

  return (
    <Container>
      <Title>บิลที่รอตรวจสอบ</Title>
      <List>
        {pending.length === 0 && <NoData>ไม่มีรายการที่รอตรวจสอบ</NoData>}
        {pending.map((bill) => (
          <Card key={bill.id}>
            <Row>
              <div>
                <BillTitle>บิล #{bill.id}</BillTitle>
                <p>ผู้ใช้: {bill.user.name}</p>
                <p>ห้อง: {bill.room}</p>
                <p>เดือน: {bill.month}</p>
                <p>ยอดชำระ: {bill.amount} บาท</p>
              </div>
              {bill.slipUrl && <SlipImage src={bill.slipUrl} alt="slip" />}
            </Row>
            <ButtonBox>
              <ApproveBtn onClick={() => handleAction(bill.id, "approve")}>✔ อนุมัติ</ApproveBtn>
              <RejectBtn onClick={() => handleAction(bill.id, "reject")}>✖ ปฏิเสธ</RejectBtn>
            </ButtonBox>
          </Card>
        ))}
      </List>
    </Container>
  );
}

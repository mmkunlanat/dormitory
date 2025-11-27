"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

interface Bill {
  id: string;
  userName: string;
  room: string;
  month: string;
  rent: number;
  water: number;
  electric: number;
  total: number;
  status: "PENDING" | "UPLOADED" | "CONFIRMED" | "REJECTED";
  slipUrl?: string;
}

const Container = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: #f4f6f9;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const TableCard = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 15px;
  color: #555;
  border-bottom: 2px solid #eee;
`;

const Td = styled.td`
  padding: 12px;
  font-size: 15px;
  border-bottom: 1px solid #eee;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  color: #fff;
  background: ${({ status }) =>
    status === "CONFIRMED"
      ? "#10b981"
      : status === "REJECTED"
        ? "#ef4444"
        : status === "UPLOADED"
          ? "#f59e0b"
          : "#3b82f6"};
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 12px;
  background-color: #4f46e5;
  color: #fff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  margin-right: 6px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: #3730a3;
  }
`;

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchBills() {
      try {
        const res = await fetch("/api/admin/bills"); // API route ต้องตรงกับ route ที่สร้าง
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setBills(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBills();
  }, []);

  function handleUpdateStatus(id: string, status: Bill["status"]) {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    // TODO: เรียก API PUT/PATCH เพื่ออัปเดตใน DB
  }

  return (
    <Container>
      <Title>รายการบิลทั้งหมด</Title>
      <TableCard>
        <Table>
          <thead>
            <tr>
              <Th>ผู้เช่า</Th>
              <Th>ห้อง</Th>
              <Th>เดือน</Th>
              <Th>ค่าห้อง</Th>
              <Th>ค่าน้ำ</Th>
              <Th>ค่าไฟ</Th>
              <Th>รวมทั้งหมด</Th>
              <Th>สถานะ</Th>
              <Th>การจัดการ</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <Td colSpan={9}>กำลังโหลด...</Td>
              </tr>
            ) : bills.length === 0 ? (
              <tr>
                <Td colSpan={9}>ยังไม่มีบิล</Td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill.id}>
                  <Td>{bill.userName}</Td>
                  <Td>{bill.room}</Td>
                  <Td>{bill.month}</Td>
                  <Td>{bill.rent}</Td>
                  <Td>{bill.water}</Td>
                  <Td>{bill.electric}</Td>
                  <Td>{bill.rent + bill.water + bill.electric}</Td>
                  <Td>
                    <StatusBadge status={bill.status}>{bill.status}</StatusBadge>
                  </Td>
                  <Td>
                    <ActionButton
                      onClick={() => handleUpdateStatus(bill.id, "CONFIRMED")}
                    >
                      ยืนยัน
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleUpdateStatus(bill.id, "REJECTED")}
                    >
                      ปฏิเสธ
                    </ActionButton>
                    <ActionButton
                      onClick={() => router.push(`/admin/bills/${bill.id}`)}
                    >
                      ดู/แก้ไข
                    </ActionButton>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableCard>
    </Container>
  );
}

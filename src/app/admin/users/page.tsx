"use client";
import styled from "styled-components";
import { useState } from "react";
import Link from "next/link";

// Mock users
const mockUsers = [
  { id: 1, name: "สมชาย ใจดี", room: "A101", phone: "080-123-4567", status: "ACTIVE" },
  { id: 2, name: "ณัฐวดี ทองดี", room: "A102", phone: "081-555-7890", status: "ACTIVE" },
  { id: 3, name: "กิตติชัย กุลวงศ์", room: "A103", phone: "089-222-1111", status: "INACTIVE" },
];

const Container = styled.div`
  min-height: 100vh;
  background: #f4f6f9;
  padding: 60px 20px;
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
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.08);
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
    status === "ACTIVE" ? "#10b981" : "#ef4444"};
`;

const ActionButton = styled(Link)`
  padding: 6px 12px;
  border-radius: 12px;
  background-color: #4f46e5;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: 0.2s;
  &:hover {
    background-color: #3730a3;
  }
`;

export default function AdminUsersPage() {
  const [users] = useState(mockUsers);

  return (
    <Container>
      <Title>จัดการผู้เช่า</Title>

      <TableCard>
        <Table>
          <thead>
            <tr>
              <Th>ชื่อผู้เช่า</Th>
              <Th>ห้อง</Th>
              <Th>เบอร์โทร</Th>
              <Th>สถานะ</Th>
              <Th>การจัดการ</Th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.room}</Td>
                <Td>{user.phone}</Td>
                <Td>
                  <StatusBadge status={user.status}>
                    {user.status === "ACTIVE" ? "ปกติ" : "ย้ายออก"}
                  </StatusBadge>
                </Td>
                <Td>
                  <ActionButton href={`/admin/users/${user.id}`}>
                    ดูข้อมูล
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableCard>
    </Container>
  );
}

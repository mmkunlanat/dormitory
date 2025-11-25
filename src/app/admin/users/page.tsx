"use client";
import styled from "styled-components";
import { useState } from "react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  room: string;
  phone: string;
  status: string;
}

const initialUsers: User[] = [
  { id: 1, name: "สมชาย ใจดี", room: "A101", phone: "080-123-4567", status: "ACTIVE" },
  { id: 2, name: "ณัฐวดี ทองดี", room: "A102", phone: "081-555-7890", status: "ACTIVE" },
  { id: 3, name: "กิตติชัย กุลวงศ์", room: "A103", phone: "089-222-1111", status: "INACTIVE" },
];

const Container = styled.div`
  min-height: 100vh;
  background: #f4f6f9;
  padding: 40px 20px;
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
  margin-bottom: 24px;
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
  background: ${({ status }) => (status === "ACTIVE" ? "#10b981" : "#ef4444")};
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
  &:hover { background-color: #3730a3; }
`;

const FormCard = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e4e8ef;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 8px rgba(37,99,235,0.3);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e4e8ef;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 8px rgba(37,99,235,0.3);
  }
`;

const AddButton = styled.button`
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  background: #2563eb;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: #1e40af; }
`;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  function handleAddOrUpdate() {
    if (!name || !room || !phone) return alert("กรุณากรอกข้อมูลครบถ้วน");

    if (editingId !== null) {
      // update
      setUsers(users.map(u => u.id === editingId ? { id: u.id, name, room, phone, status } : u));
      setEditingId(null);
    } else {
      // add new
      const newUser: User = {
        id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        room,
        phone,
        status,
      };
      setUsers([...users, newUser]);
    }

    // reset form
    setName(""); setRoom(""); setPhone(""); setStatus("ACTIVE");
  }

  function handleEdit(user: User) {
    setEditingId(user.id);
    setName(user.name);
    setRoom(user.room);
    setPhone(user.phone);
    setStatus(user.status);
  }

  function handleDelete(userId: number) {
    if (confirm("คุณแน่ใจหรือว่าต้องการลบผู้เช่านี้?")) {
      setUsers(users.filter(u => u.id !== userId));
    }
  }

  return (
    <Container>
      <Title>จัดการผู้เช่า</Title>

      {/* ฟอร์มเพิ่ม/แก้ไข */}
      <FormCard>
        <Input placeholder="ชื่อผู้เช่า" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="ห้อง" value={room} onChange={e => setRoom(e.target.value)} />
        <Input placeholder="เบอร์โทร" value={phone} onChange={e => setPhone(e.target.value)} />
        <Select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="ACTIVE">ปกติ</option>
          <option value="INACTIVE">ย้ายออก</option>
        </Select>
        <AddButton onClick={handleAddOrUpdate}>{editingId !== null ? "อัปเดตผู้เช่า" : "เพิ่มผู้เช่า"}</AddButton>
      </FormCard>

      {/* ตารางผู้เช่า */}
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
            {users.map(user => (
              <tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.room}</Td>
                <Td>{user.phone}</Td>
                <Td><StatusBadge status={user.status}>{user.status === "ACTIVE" ? "ปกติ" : "ย้ายออก"}</StatusBadge></Td>
                <Td>
                  <ActionButton onClick={() => handleEdit(user)}>แก้ไข</ActionButton>
                  <ActionButton onClick={() => handleDelete(user.id)}>ลบ</ActionButton>
                  <Link href={`/admin/users/${user.id}`} passHref>
                     <ActionButton as="a">ดูข้อมูล</ActionButton>
                  </Link>

                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableCard>
    </Container>
  );
}
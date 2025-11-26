"use client";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  room: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
}

const Container = styled.div`
  min-height: 100vh;
  background: #f4f6f9;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1f2937;
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
  min-width: 600px;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px;
  font-size: 15px;
  color: #1f2937;
  border-bottom: 1px solid #f3f4f6;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: ${({ $status }) => ($status === "ACTIVE" ? "#10b981" : "#ef4444")};
  display: inline-block;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  background-color: #4f46e5;
  color: #fff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  margin-right: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
  
  &:hover { 
    background-color: #3730a3;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #ef4444;
  
  &:hover {
    background-color: #dc2626;
  }
`;

const ViewButton = styled(ActionButton)`
  background-color: #059669;
  
  &:hover {
    background-color: #047857;
  }
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
  align-items: flex-end;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 150px;
  flex: 1;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e4e8ef;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e4e8ef;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const AddButton = styled.button`
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  background: #2563eb;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover { 
    background: #1e40af;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CancelButton = styled(AddButton)`
  background: #6b7280;
  
  &:hover {
    background: #4b5563;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  font-size: 15px;
`;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  }

  function resetForm() {
    setName("");
    setRoom("");
    setPhone("");
    setStatus("ACTIVE");
    setEditingId(null);
  }

  async function handleAddOrUpdate() {
    // Validation
    if (!name.trim() || !room.trim() || !phone.trim()) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // Validate phone format (basic)
    const phoneRegex = /^[0-9-]+$/;
    if (!phoneRegex.test(phone)) {
      alert("กรุณากรอกเบอร์โทรให้ถูกต้อง");
      return;
    }

    setLoading(true);
    try {
      if (editingId !== null) {
        // Update existing user
        const res = await fetch(`/api/users/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, room, phone, status }),
        });
        if (!res.ok) throw new Error("Failed to update");
      } else {
        // Add new user
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, room, phone, status }),
        });
        if (!res.ok) throw new Error("Failed to create");
      }
      await fetchUsers();
      resetForm();
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(user: User) {
    setEditingId(user.id);
    setName(user.name);
    setRoom(user.room);
    setPhone(user.phone || "");
    setStatus(user.status as "ACTIVE" | "INACTIVE");

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(userId: string) {
    const user = users.find((u) => u.id === userId);
    if (user && window.confirm(`คุณแน่ใจหรือว่าต้องการลบ "${user.name}"?`)) {
      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete");

        setUsers(users.filter((u) => u.id !== userId));

        // If deleting the user being edited, reset form
        if (editingId === userId) {
          resetForm();
        }
      } catch (error) {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    }
  }

  function handleCancel() {
    if (
      editingId !== null &&
      (name || room || phone) &&
      window.confirm("ยกเลิกการแก้ไข?")
    ) {
      resetForm();
    } else if (editingId === null) {
      resetForm();
    }
  }

  return (
    <Container>
      <Title>จัดการผู้เช่า</Title>

      {/* ฟอร์มเพิ่ม/แก้ไข */}
      <FormCard>
        <FormGroup>
          <Label>ชื่อผู้เช่า *</Label>
          <Input
            placeholder="ระบุชื่อ-นามสกุล"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            disabled={loading}
          />
        </FormGroup>

        <FormGroup>
          <Label>ห้อง *</Label>
          <Input
            placeholder="เช่น A101"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            maxLength={20}
            disabled={loading}
          />
        </FormGroup>

        <FormGroup>
          <Label>เบอร์โทร *</Label>
          <Input
            placeholder="080-123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={20}
            disabled={loading}
          />
        </FormGroup>

        <FormGroup>
          <Label>สถานะ</Label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
            disabled={loading}
          >
            <option value="ACTIVE">ปกติ</option>
            <option value="INACTIVE">ย้ายออก</option>
          </Select>
        </FormGroup>

        <div style={{ display: "flex", gap: "8px" }}>
          <AddButton onClick={handleAddOrUpdate} disabled={loading}>
            {loading ? "⏳ กำลังบันทึก..." : editingId !== null ? "💾 อัปเดตผู้เช่า" : "➕ เพิ่มผู้เช่า"}
          </AddButton>
          {(editingId !== null || name || room || phone) && (
            <CancelButton onClick={handleCancel} disabled={loading}>ยกเลิก</CancelButton>
          )}
        </div>
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
              <Th style={{ textAlign: "center" }}>การจัดการ</Th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <Td colSpan={5}>
                  <EmptyState>ไม่มีข้อมูลผู้เช่า</EmptyState>
                </Td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>{user.room}</Td>
                  <Td>{user.phone}</Td>
                  <Td>
                    <StatusBadge $status={user.status}>
                      {user.status === "ACTIVE" ? "ปกติ" : "ย้ายออก"}
                    </StatusBadge>
                  </Td>
                  <Td style={{ whiteSpace: "nowrap" }}>
                    <ActionButton onClick={() => handleEdit(user)}>✏️ แก้ไข</ActionButton>
                    <DeleteButton onClick={() => handleDelete(user.id)}>🗑️ ลบ</DeleteButton>
                    <Link href={`/admin/users/${user.id}`} style={{ textDecoration: "none" }}>
                      <ActionButton as="div">ดูข้อมูล</ActionButton>
                    </Link>

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
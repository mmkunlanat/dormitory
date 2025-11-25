"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  room: string;
  status?: string;
}

const Container = styled.div`
  min-height: 100vh;
  background: #f4f6f9;
  padding: 40px 20px;
`;

const Header = styled.div`
  max-width: 600px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1f2937;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
`;

const FormCard = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  max-width: 600px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const RequiredMark = styled.span`
  color: #ef4444;
  margin-left: 2px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  outline: none;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  flex: 1;
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  background: ${(props) =>
    props.$variant === "secondary" ? "#6b7280" : "#2563eb"};
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) =>
      props.$variant === "secondary" ? "#4b5563" : "#1e40af"};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

const SummaryCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
`;

const SummaryTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: #6b7280;

  &:not(:last-child) {
    border-bottom: 1px solid #e5e7eb;
  }
`;

const SummaryTotal = styled(SummaryRow)`
  font-weight: 700;
  font-size: 16px;
  color: #1f2937;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 2px solid #e5e7eb !important;
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 13px;
  margin-top: 4px;
`;

const LoadingText = styled.div`
  text-align: center;
  color: #6b7280;
  padding: 20px;
`;

export default function CreateBillPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [month, setMonth] = useState("");
  const [rent, setRent] = useState("");
  const [water, setWater] = useState("");
  const [electric, setElectric] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ดึงรายชื่อผู้เช่าที่ยังอยู่
  useEffect(() => {
    async function fetchUsers() {
      try {
        setFetchingUsers(true);
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลผู้เช่าได้");

        const data: User[] = await res.json();
        const activeUsers = data.filter((user) => user.status === "ACTIVE");
        setUsers(activeUsers);
      } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการดึงข้อมูลผู้เช่า");
      } finally {
        setFetchingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  // ตั้งค่าเดือนปัจจุบันเป็นค่าเริ่มต้น
  useEffect(() => {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`;
    setMonth(currentMonth);
  }, []);

  const calculateTotal = () => {
    const rentNum = Number(rent) || 0;
    const waterNum = Number(water) || 0;
    const electricNum = Number(electric) || 0;
    return rentNum + waterNum + electricNum;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!userId) newErrors.userId = "กรุณาเลือกผู้เช่า";
    if (!month) newErrors.month = "กรุณาเลือกเดือน";
    if (!rent || Number(rent) <= 0)
      newErrors.rent = "กรุณากรอกค่าห้องที่ถูกต้อง";
    if (!water || Number(water) < 0)
      newErrors.water = "กรุณากรอกค่าน้ำที่ถูกต้อง";
    if (!electric || Number(electric) < 0)
      newErrors.electric = "กรุณากรอกค่าไฟที่ถูกต้อง";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setErrors({});
    if (!validateForm()) return;

    const selectedUser = users.find((u) => u.id === userId);
    const confirmMsg = `ต้องการสร้างบิลสำหรับ:\n\n${
      selectedUser?.name
    } (ห้อง ${selectedUser?.room})\nเดือน: ${month}\nยอดรวม: ${calculateTotal().toLocaleString()} บาท`;

    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/bills/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          month,
          rent: Number(rent),
          water: Number(water),
          electric: Number(electric),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");

      alert("✅ สร้างบิลเรียบร้อยแล้ว");
      router.push("/admin/bills");
    } catch (err: any) {
      console.error(err);
      alert(`❌ ไม่สามารถสร้างบิลได้: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("ต้องการยกเลิกการสร้างบิล?")) router.back();
  };

  const selectedUser = users.find((u) => u.id === userId);

  return (
    <Container>
      <Header>
        <Title>📝 สร้างบิลใหม่</Title>
        <Subtitle>กรอกข้อมูลเพื่อสร้างบิลค่าเช่าสำหรับผู้เช่า</Subtitle>
      </Header>

      <FormCard>
        {fetchingUsers ? (
          <LoadingText>กำลังโหลดข้อมูลผู้เช่า...</LoadingText>
        ) : (
          <>
            <FormGroup>
              <Label>
                ผู้เช่า <RequiredMark>*</RequiredMark>
              </Label>
              <Select
                value={userId ?? ""}
                onChange={(e) => {
                  setUserId(Number(e.target.value));
                  setErrors({ ...errors, userId: "" });
                }}
                disabled={loading}
              >
                <option value="">-- เลือกผู้เช่า --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} (ห้อง {user.room})
                  </option>
                ))}
              </Select>
              {errors.userId && <ErrorText>{errors.userId}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>
                เดือน <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="month"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setErrors({ ...errors, month: "" });
                }}
                disabled={loading}
              />
              {errors.month && <ErrorText>{errors.month}</ErrorText>}
            </FormGroup>

            {/* Input ตัวเลขแก้ไขให้พิมพ์ได้ */}
            <FormGroup>
              <Label>
                ค่าห้อง (บาท) <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="number"
                placeholder="เช่น 3000"
                value={rent}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) setRent(val);
                  setErrors({ ...errors, rent: "" });
                }}
                min="0"
                step="1"
                disabled={loading}
              />
              {errors.rent && <ErrorText>{errors.rent}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>
                ค่าน้ำ (บาท) <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="number"
                placeholder="เช่น 150"
                value={water}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) setWater(val);
                  setErrors({ ...errors, water: "" });
                }}
                min="0"
                step="1"
                disabled={loading}
              />
              {errors.water && <ErrorText>{errors.water}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>
                ค่าไฟ (บาท) <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="number"
                placeholder="เช่น 450"
                value={electric}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) setElectric(val);
                  setErrors({ ...errors, electric: "" });
                }}
                min="0"
                step="1"
                disabled={loading}
              />
              {errors.electric && <ErrorText>{errors.electric}</ErrorText>}
            </FormGroup>

            {(rent || water || electric) && (
              <SummaryCard>
                <SummaryTitle>สรุปยอดเงิน</SummaryTitle>
                {selectedUser && (
                  <SummaryRow>
                    <span>ผู้เช่า:</span>
                    <span>
                      {selectedUser.name} (ห้อง {selectedUser.room})
                    </span>
                  </SummaryRow>
                )}
                <SummaryRow>
                  <span>ค่าห้อง:</span>
                  <span>{Number(rent || 0).toLocaleString()} บาท</span>
                </SummaryRow>
                <SummaryRow>
                  <span>ค่าน้ำ:</span>
                  <span>{Number(water || 0).toLocaleString()} บาท</span>
                </SummaryRow>
                <SummaryRow>
                  <span>ค่าไฟ:</span>
                  <span>{Number(electric || 0).toLocaleString()} บาท</span>
                </SummaryRow>
                <SummaryTotal>
                  <span>ยอดรวมทั้งหมด:</span>
                  <span>{calculateTotal().toLocaleString()} บาท</span>
                </SummaryTotal>
              </SummaryCard>
            )}

            <ButtonGroup>
              <Button
                $variant="secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                ยกเลิก
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "⏳ กำลังบันทึก..." : "✅ สร้างบิล"}
              </Button>
            </ButtonGroup>
          </>
        )}
      </FormCard>
    </Container>
  );
}

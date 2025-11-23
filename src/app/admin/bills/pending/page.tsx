"use client";

import React, { useEffect, useState } from "react";

interface PendingBill {
  id: string;
  user: string;
  room: string;
  month: string;
  amount: number;
  slipUrl?: string;
  status: string;
}

export default function PendingBillsPage() {
  const [pending, setPending] = useState<PendingBill[]>([]);

  useEffect(() => {
    // mock data (จริงให้ fetch จาก backend)
    setPending([
      {
        id: "1001",
        user: "สมชาย ใจดี",
        room: "A101",
        month: "2025-01",
        amount: 1550,
        slipUrl: "/uploads/slip1.jpg",
        status: "pending",
      },
      {
        id: "1002",
        user: "ปรียา รุ่งเรือง",
        room: "B205",
        month: "2025-01",
        amount: 980,
        slipUrl: "/uploads/slip2.jpg",
        status: "pending",
      },
    ]);
  }, []);

  function approveBill(id: string) {
    alert("อนุมัติบิล #" + id);
  }

  function rejectBill(id: string) {
    alert("ปฏิเสธบิล #" + id);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>บิลที่รอตรวจสอบ</h1>

      <div style={styles.list}>
        {pending.map((bill) => (
          <div key={bill.id} style={styles.card}>
            <div style={styles.row}>
              <div>
                <h3 style={styles.billTitle}>บิล #{bill.id}</h3>
                <p>ผู้ใช้: {bill.user}</p>
                <p>ห้อง: {bill.room}</p>
                <p>เดือน: {bill.month}</p>
                <p>ยอดชำระ: {bill.amount} บาท</p>
              </div>

              {bill.slipUrl && (
                <img
                  src={bill.slipUrl}
                  alt="slip"
                  style={styles.slip}
                />
              )}
            </div>

            <div style={styles.buttonBox}>
              <button style={styles.approveBtn} onClick={() => approveBill(bill.id)}>
                ✔ อนุมัติ
              </button>
              <button style={styles.rejectBtn} onClick={() => rejectBill(bill.id)}>
                ✖ ปฏิเสธ
              </button>
            </div>
          </div>
        ))}

        {pending.length === 0 && <p>ไม่มีรายการที่รอตรวจสอบ</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "25px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    padding: "20px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
  },
  billTitle: {
    margin: 0,
    marginBottom: "8px",
    fontSize: "20px",
  },
  slip: {
    width: "140px",
    height: "180px",
    borderRadius: "10px",
    objectFit: "cover",
    border: "1px solid #ccc",
  },
  buttonBox: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
  },
  approveBtn: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    background: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  rejectBtn: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

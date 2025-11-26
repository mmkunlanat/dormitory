"use client";

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 32px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  font-family: sans-serif;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;
`;

const RequiredMark = styled.span`
  color: #ef4444;
  margin-left: 2px;
`;

const UploadArea = styled.div<{ $isDragging: boolean }>`
  border: 2px dashed ${props => props.$isDragging ? '#2563eb' : '#e5e7eb'};
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$isDragging ? '#eff6ff' : '#f9fafb'};

  &:hover {
    border-color: #2563eb;
    background: #eff6ff;
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const UploadText = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const UploadHint = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  margin-top: 20px;
  position: relative;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 400px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  object-fit: contain;
  background: #f9fafb;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(220, 38, 38, 1);
    transform: scale(1.1);
  }
`;

const FileInfo = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 13px;
  color: #6b7280;
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

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
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
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  flex: 1;
  padding: 14px 20px;
  border-radius: 12px;
  border: none;
  background: ${props => props.$variant === "secondary" ? "#6b7280" : "linear-gradient(90deg, #2563eb, #4f46e5)"};
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
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
    opacity: 0.6;
  }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 13px;
  margin-top: 4px;
`;

const ProgressBar = styled.div`
  margin-top: 16px;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background: linear-gradient(90deg, #2563eb, #4f46e5);
  transition: width 0.3s;
`;

const SuccessMessage = styled.div`
  padding: 16px;
  background: #d1fae5;
  color: #065f46;
  border-radius: 12px;
  margin-top: 16px;
  setUploadProgress(0);
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

const handleUpload = async () => {
  if (!file) {
    setError("กรุณาเลือกไฟล์สลิป");
    return;
  }

  if (!billId) {
    setError("กรุณาเลือกบิลที่ต้องการชำระ");
    return;
  }

  setLoading(true);
  setError("");
  setUploadProgress(0);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("billId", billId);
    if (note) {
      formData.append("note", note);
    }

    console.log("🚀 Uploading slip...");

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    clearInterval(progressInterval);

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("❌ Response is not JSON:", text.substring(0, 200));
      throw new Error("Server ตอบกลับไม่ถูกต้อง");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.details || "การอัปโหลดล้มเหลว");
    }

    setUploadProgress(100);
    setSuccess(true);

    console.log("✅ Upload success:", data);

    setTimeout(() => {
      router.push("/user/bills");
    }, 2000);

  } catch (err: any) {
    console.error("❌ Upload error:", err);
    setError(err.message || "เกิดข้อผิดพลาดในการอัปโหลด");
    setUploadProgress(0);
  } finally {
    setLoading(false);
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

const formatMonth = (month: string): string => {
  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const [year, monthNum] = month.split("-");
  return `${ months[parseInt(monthNum) - 1]} ${ parseInt(year) + 543}`;
};

return (
  <Container>
    <Header>
      <Title>💳 อัปโหลดสลิปชำระเงิน</Title>
      <Subtitle>อัปโหลดหลักฐานการชำระเงินเพื่อยืนยันการชำระค่าเช่า</Subtitle>
    </Header>

    <FormGroup>
      <Label>
        บิลที่ต้องการชำระ <RequiredMark>*</RequiredMark>
      </Label>
      <Select
        value={billId}
        onChange={(e) => setBillId(e.target.value)}
        disabled={loading || loadingBills}
      >
        <option value="">
          {loadingBills ? "กำลังโหลด..." : "-- เลือกบิล --"}
        </option>
        {bills.map((bill) => (
          <option key={bill.id} value={bill.id}>
            บิล เดือน {formatMonth(bill.month)} - {bill.total.toLocaleString()} บาท
          </option>
        ))}
      </Select>
    </FormGroup>

    <FormGroup>
      <Label>
        อัปโหลดสลิป <RequiredMark>*</RequiredMark>
      </Label>

      {!preview ? (
        <UploadArea
          $isDragging={isDragging}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadIcon>📤</UploadIcon>
          <UploadText>คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่</UploadText>
          <UploadHint>รองรับ JPG, PNG, WEBP (ไม่เกิน 5MB)</UploadHint>
        </UploadArea>
      ) : (
        <PreviewContainer>
          <PreviewImage src={preview} alt="slip preview" />
          <RemoveButton onClick={handleRemoveFile} type="button">
            ✕
          </RemoveButton>
          {file && (
            <FileInfo>
              📎 {file.name} ({formatFileSize(file.size)})
            </FileInfo>
          )}
        </PreviewContainer>
      )}

      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
      />
    </FormGroup>

    <FormGroup>
      <Label>หมายเหตุ (ถ้ามี)</Label>
      <Input
        type="text"
        placeholder="เช่น โอนเวลา 14:30 น."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={loading}
      />
    </FormGroup>

    {error && <ErrorText>❌ {error}</ErrorText>}

    {loading && uploadProgress > 0 && (
      <ProgressBar>
        <ProgressFill $progress={uploadProgress} />
      </ProgressBar>
    )}

    {success && (
      <SuccessMessage>
        ✅ อัปโหลดสลิปสำเร็จ! กำลังนำคุณไปยังหน้ารายการบิล...
      </SuccessMessage>
    )}

    <ButtonGroup>
      <Button
        $variant="secondary"
        onClick={() => router.back()}
        disabled={loading}
      >
        ยกเลิก
      </Button>
      <Button onClick={handleUpload} disabled={loading || !file || !billId}>
        {loading ? "⏳ กำลังอัปโหลด..." : "✅ อัปโหลดสลิป"}
      </Button>
    </ButtonGroup>
  </Container>
);
}
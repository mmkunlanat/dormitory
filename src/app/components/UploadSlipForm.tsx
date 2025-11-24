"use client";
import React, { useState } from "react";
import styled from "styled-components";

const FormWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UploadArea = styled.label`
  border: 2px dashed #2563eb;
  border-radius: 14px;
  padding: 30px;
  text-align: center;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: rgba(37, 99, 235, 0.05);
  }
`;

const Button = styled.button`
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  background: #2563eb;
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

export default function UploadSlipForm({
  onUpload,
}: {
  onUpload: (file: File) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <FormWrap>
      <UploadArea>
        เลือกไฟล์สลิป
        <input type="file" hidden accept="image/*" onChange={handleChange} />
      </UploadArea>
      <Button>อัปโหลด</Button>
    </FormWrap>
  );
}

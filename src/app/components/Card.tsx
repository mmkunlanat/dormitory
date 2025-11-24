"use client";
import React from "react";
import styled from "styled-components";

const CardWrap = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(12, 24, 48, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function Card({ children }: { children: React.ReactNode }) {
  return <CardWrap>{children}</CardWrap>;
}

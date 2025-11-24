import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId, room, month, amount } = await req.json();
  const bill = await prisma.bill.create({
    data: {
      userId: Number(userId),
      room,
      month,
      amount: Number(amount),
      status: "pending",
    },
  });
  return NextResponse.json(bill);
}

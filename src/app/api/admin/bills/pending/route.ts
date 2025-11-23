import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const bills = await prisma.bill.findMany({
    where: { status: "pending" },
    include: { user: true },
  });
  return NextResponse.json(bills);
}

export async function POST(req: NextRequest) {
  const { id, action } = await req.json();

  if (action === "approve") {
    await prisma.bill.update({ where: { id: Number(id) }, data: { status: "paid" } });
  } else if (action === "reject") {
    await prisma.bill.update({ where: { id: Number(id) }, data: { status: "rejected" } });
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

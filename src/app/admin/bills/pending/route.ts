import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      where: { status: "pending" },
      include: {
        user: true, // สมมติมี relation user
      },
    });

    return NextResponse.json(bills);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pending bills" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id, action } = await req.json();

    if (action === "approve") {
      await prisma.bill.update({
        where: { id },
        data: { status: "paid" },
      });
    } else if (action === "reject") {
      await prisma.bill.update({
        where: { id },
        data: { status: "rejected" },
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update bill" }, { status: 500 });
  }
}

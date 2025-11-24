import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { billId, amount, slipUrl, ocrText } = body;

  // validate...
  const bill = await prisma.bill.findUnique({ where: { id: billId }});
  if (!bill) return NextResponse.json({ error: "Bill not found" }, { status: 404 });
  if (bill.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const payment = await prisma.payment.create({
    data: {
      billId,
      userId: session.user.id,
      amount,
      ocrText,
      // set transferAt if parsed
    }
  });

  // update bill
  await prisma.bill.update({
    where: { id: billId },
    data: { status: "UPLOADED", slipUrl }
  });

  return NextResponse.json({ ok: true, payment });
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/users/[id] - Update user
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, room, phone, status } = body;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { name, room, phone, status },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "ไม่สามารถอัปเดตข้อมูลผู้เช่าได้" },
            { status: 500 }
        );
    }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: "ลบผู้เช่าเรียบร้อยแล้ว" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: "ไม่สามารถลบผู้เช่าได้" },
            { status: 500 }
        );
    }
}

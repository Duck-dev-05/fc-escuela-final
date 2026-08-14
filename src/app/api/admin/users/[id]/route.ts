import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invalidateCache } from "@/lib/redis";

const ADMIN_USERS_CACHE_KEY = 'admin_all_users';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, email, roles } = await req.json();
    const normalizedRoles = Array.isArray(roles) ? roles[0] : roles;
    const user = await prisma.user.update({
      where: { id: id },
      data: { name, email, roles: normalizedRoles },
      select: { id: true, name: true, email: true, roles: true },
    });

    // Invalidate users cache
    await invalidateCache(ADMIN_USERS_CACHE_KEY);

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id: id } });

    // Invalidate users cache
    await invalidateCache(ADMIN_USERS_CACHE_KEY);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
} 
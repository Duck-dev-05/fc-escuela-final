import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { getCache, setCache, invalidateCache, CACHE_TTL } from "@/lib/redis";

const ADMIN_USERS_CACHE_KEY = 'admin_all_users';

export async function GET() {
  try {
    // Try to get from cache
    const cachedUsers = await getCache(ADMIN_USERS_CACHE_KEY);
    if (cachedUsers) return NextResponse.json(cachedUsers);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
        lastLogin: true,
      },
    });

    // Set cache
    await setCache(ADMIN_USERS_CACHE_KEY, users, CACHE_TTL.NEWS);

    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, roles } = await req.json();
    const normalizedRoles = Array.isArray(roles) ? roles[0] : roles;
    const user = await prisma.user.create({
      data: { name, email, roles: normalizedRoles },
      select: { id: true, name: true, email: true, roles: true },
    });

    // Invalidate users cache
    await invalidateCache(ADMIN_USERS_CACHE_KEY);

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
} 
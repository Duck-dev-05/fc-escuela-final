import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Perform an atomic transactional deletion to bypass missing cascade constraints
    await prisma.$transaction([
      prisma.ticket.deleteMany({ where: { userId } }),
      prisma.galleryImage.deleteMany({ where: { userId } }),
      prisma.membership.deleteMany({ where: { userId } }),
      prisma.account.deleteMany({ where: { userId } }),
      prisma.session.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } })
    ]);
    
    return NextResponse.json({ success: true, message: "Identity and all associated data records permanently erased." });
  } catch (error) {
    console.error("Critical Failure: Database deletion aborted due to constraint or transaction error:", error);
    return NextResponse.json({ error: "Failed to erase identity from the registry." }, { status: 500 });
  }
} 
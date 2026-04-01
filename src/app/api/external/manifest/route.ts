import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchName = searchParams.get("match");

  if (!matchName) {
    return NextResponse.json({ error: "Match name is required" }, { status: 400 });
  }

  try {
    // Find the match in the website's database by comparing team names
    // Note: We use a loose search since the admin and website might have slight variations
    const match = await prisma.match.findFirst({
      where: {
        OR: [
          { homeTeam: { contains: matchName.split(' vs ')[0] || '' } },
          { awayTeam: { contains: matchName.split(' vs ')[1] || '' } }
        ]
      },
      include: {
        tickets: {
          include: {
            user: true
          }
        }
      }
    });

    if (!match) {
      return NextResponse.json([], { 
        headers: { "Access-Control-Allow-Origin": "http://localhost:3001" } 
      });
    }

    // Format the manifest for the admin dashboard
    const manifest = match.tickets.map((t) => ({
      id: `TKT-${t.id.slice(-4).toUpperCase()}`,
      name: t.user?.name || "Unknown Attendee",
      tier: t.category.charAt(0).toUpperCase() + t.category.slice(1),
      status: "Deployed", // Real records are considered deployed
      value: `VND ${(t.quantity * 30000).toLocaleString()}`, // Using a base multiplier for value
      purchaseDate: t.purchaseDate
    }));

    return NextResponse.json(manifest, {
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3001",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    console.error("External manifest sync error:", error);
    return NextResponse.json({ error: "Synchronization failed" }, { 
      status: 500,
      headers: { "Access-Control-Allow-Origin": "http://localhost:3001" }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3001",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

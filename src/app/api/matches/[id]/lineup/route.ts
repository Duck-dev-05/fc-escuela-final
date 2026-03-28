import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const match = await prisma.match.findUnique({
      where: { id: id },
      select: { homeLineup: true, awayLineup: true, homeTeam: true, awayTeam: true }
    })

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    return NextResponse.json({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeLineup: match.homeLineup ? JSON.parse(match.homeLineup) : [],
      awayLineup: match.awayLineup ? JSON.parse(match.awayLineup) : []
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { homeLineup, awayLineup } = await req.json()

    const updatedMatch = await prisma.match.update({
      where: { id: id },
      data: {
        homeLineup: homeLineup ? JSON.stringify(homeLineup) : undefined,
        awayLineup: awayLineup ? JSON.stringify(awayLineup) : undefined,
      }
    })

    return NextResponse.json({
      success: true,
      homeLineup: updatedMatch.homeLineup ? JSON.parse(updatedMatch.homeLineup) : [],
      awayLineup: updatedMatch.awayLineup ? JSON.parse(updatedMatch.awayLineup) : []
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

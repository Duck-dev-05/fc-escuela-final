import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getCache, setCache, CACHE_TTL } from '@/lib/redis';

const TEAM_CACHE_KEY = 'team_members';

// Official Roster from Image
const OFFICIAL_ROSTER = [
  { id: 1, name: 'Nguyễn Thành Đạt', role: 'GK', image: 'Đạt.jfif', bio: 'Elite Shot Stopper', order: 1, captain: false, status: 'injured', medical: { type: 'ACL Strain', severity: 'high', recovery: '2026-04-15' } },
  { id: 2, name: 'Lê Vũ Nhật Minh', role: 'CB', image: null, bio: 'Defensive Anchor', order: 2, captain: false, status: 'available', medical: null },
  { id: 3, name: 'Nguyễn Đỗ Bảo Khánh', role: 'CB', image: 'BKhanh.jfif', bio: 'Physical Powerhouse', order: 3, captain: false, status: 'suspended', medical: { type: 'System Suspension', severity: 'mid', recovery: '2026-04-02' } },
  { id: 4, name: 'Nguyễn Đức Bảo Phong', role: 'CB', image: null, bio: 'Tactical Leader', order: 4, captain: false, status: 'available', medical: null },
  { id: 5, name: 'Vũ Nhật Ninh', role: 'RB', image: null, bio: 'Speed Specialist', order: 5, captain: false, status: 'available', medical: null },
  { id: 6, name: 'Phạm Công Toàn', role: 'LB', image: null, bio: 'Flank Control', order: 6, captain: false, status: 'available', medical: null },
  { id: 7, name: 'Hoàng Đặng Việt Hùng', role: 'CDM', image: 'Hùng.png', bio: 'Midfield Engine', order: 7, captain: true, status: 'available', medical: null },
  { id: 8, name: 'Đỗ Quốc Khánh', role: 'AMF', image: null, bio: 'Creative Playmaker', order: 8, captain: false, status: 'available', medical: null },
  { id: 9, name: 'Phạm Anh Phương', role: 'LW', image: 'Phương.jfif', bio: 'Wing Wizard', order: 9, captain: false, status: 'available', medical: null },
  { id: 10, name: 'Nguyễn Quang Minh Thành', role: 'CF', image: null, bio: 'Precision Finisher', order: 10, captain: false, status: 'available', medical: null },
  { id: 11, name: 'Đặng Minh Việt', role: 'RW', image: null, bio: 'Explosive Scorer', order: 11, captain: false, status: 'available', medical: null },
  { id: 12, name: 'Trần Minh Đức', role: 'CF', image: 'Duc.JPG', bio: 'Goal Machine', order: 12, captain: false, status: 'available', medical: null },
  { id: 13, name: 'Lâm Văn Hoàng', role: 'GK', image: null, bio: 'Agile Guardian', order: 13, captain: false, status: 'available', medical: null },
  { id: 14, name: 'Hồ Quang Thái', role: 'CDM', image: null, bio: 'Possession Master', order: 14, captain: false, status: 'available', medical: null },
  { id: 15, name: 'Bùi Thế Anh', role: 'AMF', image: null, bio: 'Visionary Passer', order: 15, captain: false, status: 'available', medical: null },
  { id: 17, name: 'Đào Xuân Tú', role: 'LB', image: null, bio: 'Defensive Wall', order: 17, captain: false, status: 'available', medical: null },
  { id: 18, name: 'Vũ Duy Mạnh', role: 'RW', image: null, bio: 'Pace Merchant', order: 18, captain: false, status: 'available', medical: null },
  { id: 19, name: 'Đặng Văn Lâm', role: 'GK', image: null, bio: 'Vanguard Keeper', order: 19, captain: false, status: 'available', medical: null },
];

export async function GET() {
  try {
    const cachedTeam = await getCache(TEAM_CACHE_KEY);
    if (cachedTeam) return NextResponse.json(cachedTeam);

    const response = { team: OFFICIAL_ROSTER };
    await setCache(TEAM_CACHE_KEY, response, CACHE_TTL.SQUAD);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const currentTeam = (await getCache(TEAM_CACHE_KEY) as any) || { team: OFFICIAL_ROSTER };
    const updatedTeam = (currentTeam.team || OFFICIAL_ROSTER).map((p: any) => p.id === id ? { ...p, status } : p);
    await setCache(TEAM_CACHE_KEY, { team: updatedTeam }, CACHE_TTL.SQUAD);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update personnel status' }, { status: 500 });
  }
}
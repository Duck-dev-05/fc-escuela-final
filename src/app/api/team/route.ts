import { NextResponse } from 'next/server';
import { getCache, setCache, CACHE_TTL } from '@/lib/redis';

const TEAM_CACHE_KEY = 'team_members_v2'; // Bumped version for new schema

// Official Roster with Elite Metrics
const OFFICIAL_ROSTER = [
  { 
    id: 1, name: 'Nguyễn Thành Đạt', role: 'GK', image: 'Đạt.jfif', bio: 'Elite First Team Guardian. Flagship reaction mastery.', order: 1, captain: false, status: 'available', 
    physical: { height: '188cm', weight: '82kg', age: 20, dob: '12/09/2005', foot: 'Right' },
    stats: { appearances: 24, cleanSheets: 11, saves: 68, minutes: 2160 },
    contract: { joined: 'Octobre 2023', expires: '2028' }
  },
  { 
    id: 2, name: 'Lê Vũ Nhật Minh', role: 'CB', image: '', bio: 'Prestigious Defense Specialist. Unyielding flagship buffer.', order: 2, captain: false, status: 'available', 
    physical: { height: '185cm', weight: '78kg', age: 19, dob: '22/03/2007', foot: 'Right' },
    stats: { appearances: 22, goals: 1, tackles: 45, minutes: 1980 },
    contract: { joined: 'Octobre 2023', expires: '2027' }
  },
  { 
    id: 3, name: 'Nguyễn Đỗ Bảo Khánh', role: 'CB', image: 'BKhanh.jfif', bio: 'Strategic Club Stopper. Precision intercept mastery.', order: 3, captain: false, status: 'available', 
    physical: { height: '186cm', weight: '80kg', age: 21, dob: '15/05/2004', foot: 'Right' },
    stats: { appearances: 20, goals: 2, tackles: 38, minutes: 1800 },
    contract: { joined: 'Octobre 2023', expires: '2027' }
  },
  { 
    id: 4, name: 'Nguyễn Đức Bảo Phong', role: 'CB', image: '', bio: 'Flagship Defensive Node. Elite intercept specialist.', order: 4, captain: false, status: 'available', 
    physical: { height: '184cm', weight: '77kg', age: 20, dob: '08/11/2005', foot: 'Right' },
    stats: { appearances: 18, goals: 0, tackles: 32, minutes: 1620 },
    contract: { joined: 'Octobre 2023', expires: '2028' }
  },
  { 
    id: 5, name: 'Vũ Nhật Ninh', role: 'RB', image: '', bio: 'Tactical Flank Controller. Sustainable elite endurance.', order: 5, captain: false, status: 'available', 
    physical: { height: '178cm', weight: '72kg', age: 19, dob: '14/01/2007', foot: 'Right' },
    stats: { appearances: 21, goals: 0, assists: 4, minutes: 1890 },
    contract: { joined: 'Octobre 2023', expires: '2027' }
  },
  { 
    id: 6, name: 'Phạm Công Toàn', role: 'LB', image: '', bio: 'Core Sector Anchor. Strategic flank mastery.', order: 6, captain: false, status: 'available', 
    physical: { height: '176cm', weight: '70kg', age: 20, dob: '30/06/2005', foot: 'Left' },
    stats: { appearances: 23, goals: 1, assists: 3, minutes: 2070 },
    contract: { joined: 'Octobre 2023', expires: '2028' }
  },
  { 
    id: 7, name: 'Hoàng Đặng Việt Hùng', role: 'CDM', image: 'Hùng.png', bio: 'Club Midfield Architect. Complex role mastery.', order: 7, captain: true, status: 'available', 
    physical: { height: '182cm', weight: '76kg', age: 22, dob: '04/02/2003', foot: 'Right' },
    stats: { appearances: 25, goals: 3, assists: 6, minutes: 2250 },
    contract: { joined: 'Octobre 2023', expires: '2029' }
  },
  { 
    id: 8, name: 'Đỗ Quốc Khánh', role: 'AMF', image: '', bio: 'Operational Creative Hub. Elite playstyle designer.', order: 8, captain: false, status: 'available', 
    physical: { height: '175cm', weight: '68kg', age: 20, dob: '19/10/2005', foot: 'Right' },
    stats: { appearances: 24, goals: 12, assists: 14, minutes: 2040 },
    contract: { joined: 'Octobre 2023', expires: '2028' }
  },
  { 
    id: 9, name: 'Phạm Anh Phương', role: 'LW', image: 'Phương.jfif', bio: 'Elite Infiltrator Unit. Kinetic pressure specialist.', order: 9, captain: false, status: 'available', 
    physical: { height: '172cm', weight: '65kg', age: 21, dob: '07/03/2004', foot: 'Right' },
    stats: { appearances: 19, goals: 8, assists: 9, minutes: 1520 },
    contract: { joined: 'Octobre 2023', expires: '2027' }
  },
  { 
    id: 10, name: 'Nguyễn Quang Minh Thành', role: 'CF', image: '', bio: 'Vector Impact Unit. Precision scoring mastery.', order: 10, captain: false, status: 'available', 
    physical: { height: '186cm', weight: '79kg', age: 20, dob: '11/08/2005', foot: 'Right' },
    stats: { appearances: 22, goals: 15, assists: 4, minutes: 1760 },
    contract: { joined: 'Octobre 2023', expires: '2028' }
  },
  { 
    id: 11, name: 'Đặng Minh Việt', role: 'RW', image: '', bio: 'Prestigious Strike Operative. Direct impact mastery.', order: 11, captain: false, status: 'available', 
    physical: { height: '180cm', weight: '74kg', age: 21, dob: '03/12/2004', foot: 'Left' },
    stats: { appearances: 21, goals: 11, assists: 8, minutes: 1680 },
    contract: { joined: 'Octobre 2023', expires: '2028' }
  },
  { 
    id: 12, name: 'Trần Minh Đức', role: 'CF', image: 'Duc.JPG', bio: 'Elite Scoring Operative. Peak club scoring efficiency.', order: 12, captain: false, status: 'available', 
    physical: { height: '183cm', weight: '75kg', age: 22, dob: '25/07/2003', foot: 'Right' },
    stats: { appearances: 26, goals: 28, assists: 2, minutes: 2340 },
    contract: { joined: 'Octobre 2023', expires: '2030' }
  },
];

export async function GET() {
  try {
    const cachedTeam = await getCache(TEAM_CACHE_KEY);
    if (cachedTeam) return NextResponse.json(cachedTeam);

    const response = OFFICIAL_ROSTER;
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
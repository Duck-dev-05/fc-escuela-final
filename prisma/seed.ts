import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('--- INITIATING SYSTEM SEED: ROYAL_KINETIC_V4 ---')

    // 1. CLEAR EXISTING DATA
    console.log('RESETTING_DATABASE_LAYER...')
    await prisma.ticket.deleteMany({})
    await prisma.membership.deleteMany({})
    await prisma.galleryImage.deleteMany({})
    await prisma.news.deleteMany({})
    await prisma.match.deleteMany({})
    await prisma.teamMember.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.session.deleteMany({})
    await prisma.user.deleteMany({})

    // 2. CRYPTO_PROTOCOL: HASH PASSWORDS
    const commonPassword = await hash('fc123456', 10)

    // 3. OPERATIONAL_ACCOUNTS (SANITIZED: Manual Registration Required)
    console.log('USER_REGISTRY_READY: No mock accounts deployed.')

    // 4. CINEMATIC_NEWS_FEED (8 Articles)
    console.log('INITIALIZING_INTEL_STREAM...')
    const newsArticles = [
      {
        title: 'SQUAD_UPDATE: PRO_SYNC_COMPLETE',
        content: 'The elite squad has successfully completed the latest tactical synchronization cycle. Personnel deployment is now at 94% efficiency for the upcoming fixture. Head Coach Carlos has noted significant improvements in high-frequency transition speeds.',
        imageUrl: '/images/z5973016052782_001_d51bdad3cd2ed2e981bc093e51fc3903.jpg',
        author: 'Head Coach Carlos',
        category: 'SQUAD_UPDATE'
      },
      {
        title: 'MATCH_REPORT: DOMINANT_DEPLOYMENT',
        content: 'FC Escuela secured a commanding 5-0 victory in the latest sector operation. The tactical vanguard displayed exceptional coordination and scoring efficiency, neutralizing all opposition tactical cells by the 60th minute.',
        imageUrl: '/images/z5973016052782_002_273b5235652a3dfb76bf40d8a50b698c.jpg',
        author: 'Media Division',
        category: 'MATCH_REPORT'
      },
      {
        title: 'CLUB_ANNOUNCEMENT: INFRASTRUCTURE_UPGRADE',
        content: 'Phasing in new high-frequency medical telemetry nodes across the training facility. Enhanced health monitoring protocols are now active for all units, providing real-time biometric feedback during peak performance cycles.',
        imageUrl: '/images/z5973016052782_003_cc79159abbb5a68bf4d33000377f0dde.jpg',
        author: 'ADMIN_CORE',
        category: 'CLUB_ANNOUNCEMENT'
      },
      {
        title: 'TACTICAL_ANALYSIS: VANGUARD_FORMATION',
        content: 'Detailed decrypt of the 4-4-2 High-Frequency formation now available for all technical staff. Deep dive into transition mechanics and sector control strategies used during the previous successful deployment.',
        imageUrl: '/images/z5973016052782_004_5c4d60c05ca5bbad90105f448b75663f.jpg',
        author: 'Analytical Unit',
        category: 'TACTICAL_ADVISORY'
      },
      {
        title: 'YOUTH_ACADEMY: FUTURE_DRIVE_INITIATED',
        content: 'Re-routing resources to the under-18 tactical units. Scouting algorithms have identified 5 high-potential operatives ready for integration into the senior squad framework.',
        imageUrl: '/images/z5973016052782_005_4ca298975090cb17a3c98db94c3bfd5f.jpg',
        author: 'Academy Director',
        category: 'ACADEMY_PULSE'
      },
      {
        title: 'TICKETING_ALERT: ELITE_ARENA_SECURITY',
        content: 'New digital signature protocol for all matchday access. Smart passes now feature end-to-end encryption to ensure zero-friction entry for authenticated members only.',
        imageUrl: '/images/z5973016052782_010_7ed90876f2e0c1394b4810a0ceb81307.jpg',
        author: 'Operations Node',
        category: 'LOGISTICS'
      },
      {
        title: 'SQUAD_INTEL: STRIKER_PROTOCOL_REFINED',
        content: 'Tactical Peak (Operative 12) has achieved a 98% shot accuracy rating in the latest simulation. Deployment readiness for the Champions Circuit is confirmed.',
        imageUrl: '/images/z6087575440824_ce9aa60662b8fbab6d628891c4e37629.jpg',
        author: 'Technical Staff',
        category: 'SQUAD_UPDATE'
      },
      {
        title: 'GLOBAL_LINK: INTERNATIONAL_SYNDICATE',
        content: 'FC Escuela joins the Elite Global Network. Strategic partnerships established with major european football tech hubs to accelerate tactical innovation.',
        imageUrl: '/images/Team.jpg',
        author: 'Executive Core',
        category: 'PARTNERSHIP'
      }
    ]

    for (const article of newsArticles) {
      await prisma.news.create({ data: article })
    }

    // 5. OPERATIONAL_MATCH_SCHEDULE (12 Matches)
    console.log('CALIBRATING_TACTICAL_CALENDAR...')
    const matches = [
      // PAST MATCHES
      {
        homeTeam: 'FC Escuela',
        awayTeam: 'Academy Rangers',
        date: new Date('2026-03-01T19:00:00Z'),
        time: '19:00',
        venue: 'Elite Arena',
        competition: 'LIGA_VANGUARD',
        score: '5-0',
        status: 'Finished',
        stadiumCapacity: 5000,
        referee: 'Alpha Unit 1'
      },
      {
        homeTeam: 'District 9 United',
        awayTeam: 'FC Escuela',
        date: new Date('2026-03-08T18:30:00Z'),
        time: '18:30',
        venue: 'Sector 9 Stadium',
        competition: 'LIGA_VANGUARD',
        score: '0-3',
        status: 'Finished',
        stadiumCapacity: 8000,
        attendance: 7200,
        referee: 'Sigma Protocol 4',
        weather: 'Heavy Rain / Cinematic Mud',
        tvBroadcast: 'Global Sports Net',
        goalScorers: 'Away Victory: Operational Superiority achieved.',
        homeLineup: JSON.stringify([
          { name: 'Unit 01', position: 'GK' },
          { name: 'Unit 02', position: 'CB' },
          { name: 'Unit 03', position: 'CB' },
          { name: 'Unit 04', position: 'LB' },
          { name: 'Unit 05', position: 'RB' },
          { name: 'Unit 06', position: 'CDM' },
          { name: 'Unit 07', position: 'CM' },
          { name: 'Unit 08', position: 'CM' },
          { name: 'Unit 09', position: 'LW' },
          { name: 'Unit 10', position: 'RW' },
          { name: 'Unit 11', position: 'CF' }
        ]),
        awayLineup: JSON.stringify([
          { name: 'Nguyễn Thành Đạt', position: 'GK' },
          { name: 'Nguyễn Đỗ Bảo Khánh', position: 'CB' },
          { name: 'Lê Vũ Nhật Minh', position: 'CB' },
          { name: 'Vũ Nhật Ninh', position: 'LB' },
          { name: 'Nguyễn Đức Bảo Phong', position: 'RB' },
          { name: 'Hoàng Đặng Việt Hùng', position: 'CDM' },
          { name: 'Phạm Công Toàn', position: 'CDM' },
          { name: 'Đỗ Quốc Khánh', position: 'AMF' },
          { name: 'Phạm Anh Phương', position: 'LW' },
          { name: 'Nguyễn Quang Minh Thành', position: 'RW' },
          { name: 'Trần Minh Đức', position: 'CF' }
        ]),
        notes: JSON.stringify({
          tactical_score: 92,
          possession: 58,
          shots_on_target: 12,
          coach_summary: 'Clean structural dominance. High-frequency transitions executed at peak efficiency.'
        })
      },
      {
        homeTeam: 'FC Escuela',
        awayTeam: 'Neon Strikers',
        date: new Date('2026-03-15T20:00:00Z'),
        time: '20:00',
        venue: 'Elite Arena',
        competition: 'LIGA_VANGUARD',
        score: '2-1',
        status: 'Finished',
        stadiumCapacity: 5000,
        attendance: 4950,
        referee: 'Alpha Unit 1',
        weather: 'Clear / Tactical Optimum',
        tvBroadcast: 'Vanguard TV',
        goalScorers: 'Trần Minh Đức (24\'), Đỗ Quốc Khánh (88\')',
        manOfTheMatch: 'Đỗ Quốc Khánh',
        homeLineup: JSON.stringify([
          { name: 'Nguyễn Thành Đạt', position: 'GK' },
          { name: 'Nguyễn Đỗ Bảo Khánh', position: 'CB' },
          { name: 'Lê Vũ Nhật Minh', position: 'CB' },
          { name: 'Vũ Nhật Ninh', position: 'LB' },
          { name: 'Nguyễn Đức Bảo Phong', position: 'RB' },
          { name: 'Hoàng Đặng Việt Hùng', position: 'CDM' },
          { name: 'Phạm Công Toàn', position: 'CDM' },
          { name: 'Đỗ Quốc Khánh', position: 'AMF' },
          { name: 'Phạm Anh Phương', position: 'LW' },
          { name: 'Nguyễn Quang Minh Thành', position: 'RW' },
          { name: 'Trần Minh Đức', position: 'CF' }
        ]),
        awayLineup: JSON.stringify([
          { name: 'S. Nova', position: 'GK' },
          { name: 'K. Stark', position: 'CB' },
          { name: 'M. Odin', position: 'CB' },
          { name: 'L. Thor', position: 'LB' },
          { name: 'R. Loki', position: 'RB' },
          { name: 'B. Panther', position: 'CDM' },
          { name: 'S. Rogers', position: 'CM' },
          { name: 'T. Stark', position: 'AMF' },
          { name: 'P. Parker', position: 'LW' },
          { name: 'N. Romanoff', position: 'RW' },
          { name: 'C. Danvers', position: 'CF' }
        ]),
        notes: JSON.stringify({
          tactical_score: 85,
          possession: 52,
          shots_on_target: 7,
          coach_summary: 'Resilient defense under critical pressure. Late-stage offensive breakthrough was decisive.'
        })
      },
      {
        homeTeam: 'Urban Titans',
        awayTeam: 'FC Escuela',
        date: new Date('2026-03-22T21:00:00Z'),
        time: '21:00',
        venue: 'The Highrise Stadium',
        competition: 'LIGA_VANGUARD',
        score: '1-2',
        status: 'Finished',
        stadiumCapacity: 12000
      },
      {
        homeTeam: 'FC Escuela',
        awayTeam: 'Cyber FC',
        date: new Date('2026-03-28T19:30:00Z'),
        time: '19:30',
        venue: 'Elite Arena',
        competition: 'CHAMPIONS_CIRCUIT',
        score: '4-0',
        status: 'Finished',
        stadiumCapacity: 5000,
        attendance: 5000,
        referee: 'Alpha Unit 1',
        weather: 'Perfect / Floodlit Night',
        tvBroadcast: 'Elite Sports',
        goalScorers: 'Trần Minh Đức (15\', 42\', 78\'), Hoàng Đặng Việt Hùng (60\')',
        manOfTheMatch: 'Trần Minh Đức',
        homeLineup: JSON.stringify([
          { name: 'Nguyễn Thành Đạt', position: 'GK' },
          { name: 'Nguyễn Đỗ Bảo Khánh', position: 'CB' },
          { name: 'Lê Vũ Nhật Minh', position: 'CB' },
          { name: 'Vũ Nhật Ninh', position: 'LB' },
          { name: 'Nguyễn Đức Bảo Phong', position: 'RB' },
          { name: 'Hoàng Đặng Việt Hùng', position: 'CDM' },
          { name: 'Phạm Công Toàn', position: 'CDM' },
          { name: 'Đỗ Quốc Khánh', position: 'AMF' },
          { name: 'Phạm Anh Phương', position: 'LW' },
          { name: 'Nguyễn Quang Minh Thành', position: 'RW' },
          { name: 'Trần Minh Đức', position: 'CF' }
        ]),
        awayLineup: JSON.stringify([
          { name: 'Cyber GK', position: 'GK' },
          { name: 'C. Defense 1', position: 'CB' },
          { name: 'C. Defense 2', position: 'CB' },
          { name: 'C. Wing 1', position: 'LB' },
          { name: 'C. Wing 2', position: 'RB' },
          { name: 'C. Engine 1', position: 'CDM' },
          { name: 'C. Engine 2', position: 'CM' },
          { name: 'C. Architect', position: 'AMF' },
          { name: 'C. Striker 1', position: 'LW' },
          { name: 'C. Striker 2', position: 'RW' },
          { name: 'C. Finisher', position: 'CF' }
        ]),
        notes: JSON.stringify({
          tactical_score: 98,
          possession: 65,
          shots_on_target: 15,
          coach_summary: 'Masterclass in sector control. Offensive unit achieved total penetration of enemy lines.'
        })
      },
      {
        homeTeam: 'FC Escuela',
        awayTeam: 'Grand Masters',
        date: new Date('2026-05-17T19:30:00Z'),
        time: '19:30',
        venue: 'Elite Arena',
        competition: 'LIGA_DE_ELITE',
        status: 'Scheduled',
        stadiumCapacity: 5000
      },
      // VARIATED_STATUS_PROTOCOL
      {
        homeTeam: 'Coastal Rangers',
        awayTeam: 'FC Escuela',
        date: new Date('2026-03-29T18:00:00Z'), // Happening now (relative to system time)
        time: '18:00',
        venue: 'Oceanic Arena',
        competition: 'LIGA_VANGUARD',
        score: '1-1',
        status: 'Ongoing',
        stadiumCapacity: 15000,
        description: 'LIVE_SIGNAL: Tactical deployment in progress.'
      },
      {
        homeTeam: 'FC Escuela',
        awayTeam: 'Storm Breakers',
        date: new Date('2026-03-25T19:00:00Z'),
        time: '19:00',
        venue: 'Elite Arena',
        competition: 'CHAMPIONS_CIRCUIT',
        status: 'Postponed',
        stadiumCapacity: 5000,
        notes: 'Medical clearance pending for visiting squad.'
      },
      {
        homeTeam: 'Iron Legion',
        awayTeam: 'FC Escuela',
        date: new Date('2026-03-20T21:00:00Z'),
        time: '21:00',
        venue: 'Iron Fortress',
        competition: 'LIGA_VANGUARD',
        status: 'Cancelled',
        stadiumCapacity: 20000,
        notes: 'Protocol deviation detected in training facilities.'
      }
    ]

    const createdMatches = []
    for (const match of matches) {
      const dbMatch = await prisma.match.create({ data: match })
      createdMatches.push(dbMatch)
    }

    // 6. SQUAD_REGISTRY_REINFORCED
    console.log('REINFORCING_SQUAD_UNITS...')
    const squad = [
      { name: 'Nguyễn Thành Đạt', role: 'GK', order: 1, image: 'p1.jpg', bio: 'Strategic Vanguard Guardian. High-frequency reaction engine.', power: 88, captain: false },
      { name: 'Lê Vũ Nhật Minh', role: 'CB', order: 2, image: 'p2.jpg', bio: 'Sector Defense Specialist. Unyielding structural buffer.', power: 85, captain: false },
      { name: 'Nguyễn Đỗ Bảo Khánh', role: 'CB', order: 3, image: 'p3.jpg', bio: 'High-Frequency Stopper. Precision intercept protocol.', power: 86, captain: false },
      { name: 'Nguyễn Đức Bảo Phong', role: 'RB', order: 4, image: 'p4.jpg', bio: 'Wing Deployment Unit. Rapid vector transition specialist.', power: 84, captain: false },
      { name: 'Vũ Nhật Ninh', role: 'LB', order: 5, image: 'p5.jpg', bio: 'Tactical Flank Controller. Sustainable stamina unit.', power: 85, captain: false },
      { name: 'Phạm Công Toàn', role: 'CDM', order: 6, image: 'p6.jpg', bio: 'Signal Intercept Engine. Core network anchor.', power: 89, captain: false },
      { name: 'Hoàng Đặng Việt Hùng', role: 'CDM', order: 7, image: 'p7.jpg', bio: 'Network Coordinator. Complex playstyle architect.', power: 87, captain: true },
      { name: 'Đỗ Quốc Khánh', role: 'AMF', order: 8, image: 'p8.jpg', bio: 'Operational Architect. Creative payload delivery.', power: 91, captain: false },
      { name: 'Phạm Anh Phương', role: 'LW', order: 9, image: 'p9.jpg', bio: 'High-Speed Infiltrator. Kinetic pressure specialist.', power: 88, captain: false },
      { name: 'Nguyễn Quang Minh Thành', role: 'RW', order: 10, image: 'p10.jpg', bio: 'Vector Deployment Unit. Precision cross-linkage.', power: 87, captain: false },
      { name: 'Đặng Minh Việt', role: 'CF', order: 11, image: 'p11.jpg', bio: 'Strike Force Commander. Direct impact operative.', power: 92, captain: false },
      { name: 'Trần Minh Đức', role: 'CF', order: 12, image: 'p12.jpg', bio: 'Elite Scoring Operative. Peak scoring efficiency.', power: 94, captain: false }
    ]

    for (const member of squad) {
      await prisma.teamMember.create({ data: member })
    }

    // 7. TICKETING_REGISTRY (SANITIZED: Manual Allocation Required)
    console.log('TICKET_REGISTRY_READY: No mock tickets generated.')

    console.log('--- SYSTEM_SEED_COMPLETE: 100% OPERATIONAL ---')
  } catch (error) {
    console.error('PROTOCOL_FAILED: SEEDING_ERROR', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('--- INITIATING SYSTEM SEED: ELITE_HUB_V1.0 ---')

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

    // 3. OPERATIONAL_ACCOUNTS (Manual Registration Authorized)
    console.log('USER_REGISTRY_READY: No mock accounts deployed.')

    // 4. ELITE_EDITORIAL_NEWS_FEED (8 Articles)
    console.log('INITIALIZING_EDITORIAL_STREAM...')
    const newsArticles = [
      {
        title: 'SQUAD_SYNC: ELITE_PREP_COMPLETE',
        content: 'The first team has successfully completed the latest synchronization cycle. The squad is now at peak readiness for the upcoming fixtures. Club management has noted exceptional progress in transition performance.',
        imageUrl: '/images/z5973016052782_001_d51bdad3cd2ed2e981bc093e51fc3903.jpg',
        author: 'Technical Staff',
        category: 'SQUAD_UPDATE'
      },
      {
        title: 'MATCH_REPORT: DOMINANT_STADIUM_PERFORMANCE',
        content: 'FC Escuela secured a commanding 5-0 victory in the latest domestic match. The tactical vanguard displayed exceptional coordination and clinical efficiency, ensuring a total control strategy throughout the 90 minutes.',
        imageUrl: '/images/z5973016052782_002_273b5235652a3dfb76bf40d8a50b698c.jpg',
        author: 'Media Division',
        category: 'MATCH_REPORT'
      },
      {
        title: 'CLUB_ANNOUNCEMENT: FACILITY_UPGRADE',
        content: 'Integrating new high-performance medical technology across the club training grounds. Enhanced health monitoring protocols are now active for all elite units, providing real-time physiological feedback.',
        imageUrl: '/images/z5973016052782_003_cc79159abbb5a68bf4d33000377f0dde.jpg',
        author: 'Club Operations',
        category: 'CLUB_ANNOUNCEMENT'
      },
      {
        title: 'TECHNICAL_ANALYSIS: FLAGSHIP_FORMATION',
        content: 'In-depth analysis of the 4-4-2 Flagship formation is now accessible to the technical board. This deep dive covers key transition mechanics used during our previous successful campaign.',
        imageUrl: '/images/z5973016052782_004_5c4d60c05ca5bbad90105f448b75663f.jpg',
        author: 'Analytical Unit',
        category: 'EDITORIAL'
      },
      {
        title: 'ACADEMY_PULSE: FUTURE_TALENT_DRIVE',
        content: 'Redirecting strategic resources to the Under-18 development squads. Five exceptionally high-potential recruits have been identified for integration into the first team framework.',
        imageUrl: '/images/z5973016052782_005_4ca298975090cb17a3c98db94c3bfd5f.jpg',
        author: 'Academy Lead',
        category: 'ACADEMY'
      },
      {
        title: 'TICKETING: ELITE_PASS_ENCRYPTION',
        content: 'Implementing new digital verification for all stadium access. Smart passes now feature end-to-end security to ensure seamless entry for authenticated members only.',
        imageUrl: '/images/z5973016052782_010_7ed90876f2e0c1394b4810a0ceb81307.jpg',
        author: 'Club Security',
        category: 'LOGISTICS'
      },
      {
        title: 'SQUAD_INTEL: STRIKER_MASTERY_REFINED',
        content: 'Our flagship striker has achieved a 98% accuracy rating in the latest performance assessment. Readiness for the next elite circuit is confirmed.',
        imageUrl: '/images/z6087575440824_ce9aa60662b8fbab6d628891c4e37629.jpg',
        author: 'Performance Staff',
        category: 'SQUAD_UPDATE'
      },
      {
        title: 'TRANSFER_INTEL: SCOUTING_PROTOCOL_ACTIVE',
        content: 'Our global scouting network has identified an exceptional offensive unit in the South American sector. Negotiations for a new signing have entered the final phase.',
        imageUrl: '/images/468862554_563786026400921_5520598281853018968_n.jpg',
        author: 'Scouting Unit',
        category: 'TRANSFER'
      }
    ]

    for (const article of newsArticles) {
      await prisma.news.create({ data: article })
    }

    // 5. OPERATIONAL_MATCH_SCHEDULE (12 Matches)
    console.log('CALIBRATING_MATCH_CALENDAR...')
    const matches: any[] = []

    const createdMatches = []
    for (const match of matches) {
      const dbMatch = await prisma.match.create({ data: match })
      createdMatches.push(dbMatch)
    }

    // 6. AUTHENTIC_SQUAD_REGISTRY
    console.log('DEPLOYING_AUTHENTIC_SQUAD...')
    const squad = [
      { name: 'Nguyễn Thành Đạt', role: 'GK', order: 1, image: 'p1.jpg', bio: 'Elite First Team Guardian. Flagship reaction engine.', power: 88, captain: false },
      { name: 'Lê Vũ Nhật Minh', role: 'CB', order: 2, image: 'p2.jpg', bio: 'Prestigious Defense Specialist. Unyielding flagship buffer.', power: 85, captain: false },
      { name: 'Nguyễn Đỗ Bảo Khánh', role: 'CB', order: 3, image: 'p3.jpg', bio: 'Strategic Club Stopper. Precision intercept mastery.', power: 86, captain: false },
      { name: 'Nguyễn Đức Bảo Phong', role: 'CB', order: 4, image: 'p4.jpg', bio: 'Flagship Defensive Node. Elite intercept specialist.', power: 84, captain: false },
      { name: 'Vũ Nhật Ninh', role: 'RB', order: 5, image: 'p5.jpg', bio: 'Tactical Flank Controller. Sustainable elite endurance.', power: 85, captain: false },
      { name: 'Phạm Công Toàn', role: 'LB', order: 6, image: 'p6.jpg', bio: 'Core Sector Anchor. Strategic flank mastery.', power: 89, captain: false },
      { name: 'Hoàng Đặng Việt Hùng', role: 'CDM', order: 7, image: 'p7.jpg', bio: 'Club Midfield Architect. Complex role mastery.', power: 87, captain: true },
      { name: 'Đỗ Quốc Khánh', role: 'AMF', order: 8, image: 'p8.jpg', bio: 'Operational Creative Hub. Elite playstyle designer.', power: 91, captain: false },
      { name: 'Phạm Anh Phương', role: 'LW', order: 9, image: 'p9.jpg', bio: 'Elite Infiltrator Unit. Kinetic pressure specialist.', power: 88, captain: false },
      { name: 'Nguyễn Quang Minh Thành', role: 'CF', order: 10, image: 'p10.jpg', bio: 'Vector Impact Unit. Precision scoring mastery.', power: 87, captain: false },
      { name: 'Đặng Minh Việt', role: 'RW', order: 11, image: 'p11.jpg', bio: 'Prestigious Strike Operative. Direct impact mastery.', power: 92, captain: false },
      { name: 'Trần Minh Đức', role: 'CF', order: 12, image: 'p12.jpg', bio: 'Elite Scoring Operative. Peak club scoring efficiency.', power: 94, captain: false }
    ]

    for (const member of squad) {
      await prisma.teamMember.create({ data: member })
    }

    // 7. TICKETING_REGISTRY (Manual Allocation Required)
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
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('--- INITIATING SYSTEM SEED: ELITE_HUB_V1.0 ---')

    // 1. CLEAR EXISTING DATA
    // 1. CLEAR EXISTING DATA (DISABLED TO PREVENT DATA LOSS)
    console.log('MAINTAINING_DATABASE_INTEGRITY...')
    // await prisma.ticket.deleteMany({})
    // await prisma.match.deleteMany({})
    // await prisma.user.deleteMany({})
    // await prisma.teamMember.deleteMany({})
    // await prisma.news.deleteMany({})
    // await prisma.membership.deleteMany({})

    // 2. HASH PASSWORDS
    const adminPassword = await hash('admin123', 10)
    const userPassword = await hash('user123', 10)

    // 3. CREATE ACCOUNTS
    console.log('DEPLOYING_OPERATIONAL_ACCOUNTS...')
    const adminUser = await prisma.user.upsert({
      where: { email: 'fcadmin@fcescuela.com' },
      update: {},
      create: {
        email: 'fcadmin@fcescuela.com',
        name: 'FC Admin',
        password: adminPassword,
        username: 'admin',
        isMember: true,
        membershipType: 'premium',
        memberSince: new Date(),
      },
    })

    const normalUser = await prisma.user.upsert({
      where: { email: 'user@fcescuela.com' },
      update: {},
      create: {
        email: 'user@fcescuela.com',
        name: 'Standard User',
        password: userPassword,
        username: 'user',
        isMember: false,
        memberSince: new Date(),
      },
    })

    console.log('Admin Account:', adminUser.email)
    console.log('User Account:', normalUser.email)

    // 4. ELITE_EDITORIAL_NEWS_FEED
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
      }
    ]

    for (const article of newsArticles) {
      const existing = await prisma.news.findFirst({ where: { title: article.title } });
      if (!existing) {
        await prisma.news.create({ data: article })
      }
    }

    // 5. OPERATIONAL_MATCH_SCHEDULE
    console.log('CALIBRATING_MATCH_CALENDAR...')
    
    const fceLineup = JSON.stringify([
      { name: 'Nguyễn Thành Đạt', position: 'GK' },
      { name: 'Lê Vũ Nhật Minh', position: 'CB' },
      { name: 'Hoàng Đặng Việt Hùng', position: 'CDM' },
      { name: 'Đỗ Quốc Khánh', position: 'AMF' },
      { name: 'Phạm Anh Phương', position: 'LW' },
      { name: 'Đặng Minh Việt', position: 'RW' },
      { name: 'Trần Minh Đức', position: 'CF' },
    ])

    const fceBench = JSON.stringify([
      { name: 'Nguyễn Đỗ Bảo Khánh', position: 'CB' },
      { name: 'Nguyễn Đức Bảo Phong', position: 'CB' },
      { name: 'Vũ Nhật Ninh', position: 'RB' },
      { name: 'Phạm Công Toản', position: 'LB' },
      { name: 'Nguyễn Quang Minh Thành', position: 'CF' },
    ])

    const rmLineup = JSON.stringify([
      { name: 'Fran Gonzalez', position: 'GK' },
      { name: 'Jacobo Ramon', position: 'CB' },
      { name: 'Joan Martinez', position: 'CB' },
      { name: 'David Jimenez', position: 'RB' },
      { name: 'Yusi', position: 'LB' },
      { name: 'Chema Andres', position: 'CDM' },
      { name: 'Manuel Angel', position: 'CM' },
      { name: 'Nico Paz', position: 'CAM' },
      { name: 'Hugo de Llanos', position: 'LW' },
      { name: 'Gonzalo Garcia', position: 'RW' },
      { name: 'Iker Bravo', position: 'CF' },
    ])

    const rmBench = JSON.stringify([
      { name: 'Quetglas', position: 'GK' },
      { name: 'Manu Serrano', position: 'CB' },
      { name: 'Lorenzo', position: 'CF' }
    ])

    const barcaLineup = JSON.stringify([
      { name: 'Ander Astralaga', position: 'GK' },
      { name: 'Pau Cubarsi', position: 'CB' },
      { name: 'Mikayil Faye', position: 'CB' },
      { name: 'Hector Fort', position: 'RB' },
      { name: 'Alex Valle', position: 'LB' },
      { name: 'Marc Bernal', position: 'CDM' },
      { name: 'Unai Hernandez', position: 'CM' },
      { name: 'Noah Darvich', position: 'CAM' },
      { name: 'Dani Rodriguez', position: 'LW' },
      { name: 'Lamine Yamal', position: 'RW' },
      { name: 'Marc Guiu', position: 'CF' },
    ])

    const barcaBench = JSON.stringify([
      { name: 'Kochen', position: 'GK' },
      { name: 'Sergi Dominguez', position: 'CB' },
      { name: 'Pau Prim', position: 'CDM' }
    ])

    const ajaxLineup = JSON.stringify([
      { name: 'Charlie Setford', position: 'GK' },
      { name: 'Olivier Aertssen', position: 'CB' },
      { name: 'Tristan Gooijer', position: 'CB' },
      { name: 'Diyae Jermoumi', position: 'RB' },
      { name: 'Mateja Milovanovic', position: 'LB' },
      { name: 'Silvano Vos', position: 'CDM' },
      { name: 'Kristian Fitz-Jim', position: 'CM' },
      { name: 'Gabriel Misehouy', position: 'CAM' },
      { name: 'Jaydon Banel', position: 'LW' },
      { name: 'Amourricho van Axel Dongen', position: 'RW' },
      { name: 'Julian Rijkhoff', position: 'CF' },
    ])

    const ajaxBench = JSON.stringify([
      { name: 'Tommy Setford', position: 'GK' },
      { name: 'Oualid Agougil', position: 'LB' },
      { name: 'David Kalokoh', position: 'LW' }
    ])

    const chelseaLineup = JSON.stringify([
      { name: 'Ted Curd', position: 'GK' },
      { name: 'Alfie Gilchrist', position: 'CB' },
      { name: 'Travis Akomeah', position: 'CB' },
      { name: 'Josh Acheampong', position: 'RB' },
      { name: 'Somto Boniface', position: 'LB' },
      { name: 'Kiano Dyer', position: 'CDM' },
      { name: 'Jimi Tauriainen', position: 'CM' },
      { name: 'Michael Golding', position: 'CAM' },
      { name: 'Tyrique George', position: 'LW' },
      { name: 'Zain Silcott-Duberry', position: 'RW' },
      { name: 'Ronnie Stutter', position: 'CF' },
    ])

    const chelseaBench = JSON.stringify([
      { name: 'Max Merrick', position: 'GK' },
      { name: 'Harrison Murray-Campbell', position: 'CB' },
      { name: 'Donnell McNeilly', position: 'CF' }
    ])

    const matches = [
      {
        id: 'cmnk36y460007ian54vrh0yl7',
        homeTeam: 'Escuela FC',
        awayTeam: 'Real Madrid Academy',
        date: new Date('2026-08-25T19:30:00Z'),
        time: '19:30',
        venue: 'Escuela Stadium',
        competition: 'Youth Champions League',
        stadiumCapacity: 1000,
        homeLineup: fceLineup,
        homeBench: fceBench,
        awayLineup: rmLineup,
        awayBench: rmBench,
      },
      {
        id: 'cmnk36y460007ian54vrh0yl8',
        homeTeam: 'Barcelona Youth',
        awayTeam: 'Escuela FC',
        date: new Date('2026-09-02T20:00:00Z'),
        time: '20:00',
        venue: 'La Masia',
        competition: 'Youth Champions League',
        stadiumCapacity: 800,
        homeLineup: barcaLineup,
        homeBench: barcaBench,
        awayLineup: fceLineup,
        awayBench: fceBench,
      },
      {
        id: 'cmnk36y460007ian54vrh0yl9',
        homeTeam: 'Escuela FC',
        awayTeam: 'Ajax Academy',
        date: new Date('2026-09-12T18:45:00Z'),
        time: '18:45',
        venue: 'Escuela Stadium',
        competition: 'International Youth Cup',
        stadiumCapacity: 1000,
        homeLineup: fceLineup,
        homeBench: fceBench,
        awayLineup: ajaxLineup,
        awayBench: ajaxBench,
      },
      {
        id: 'cmnk36y460007ian54vrh0ylb',
        homeTeam: 'Escuela FC',
        awayTeam: 'Chelsea Academy',
        date: new Date('2026-09-22T19:00:00Z'),
        time: '19:00',
        venue: 'Escuela Stadium',
        competition: 'International Youth Cup',
        stadiumCapacity: 1200,
        homeLineup: fceLineup,
        homeBench: fceBench,
        awayLineup: chelseaLineup,
        awayBench: chelseaBench,
      },
      {
        id: 'cmnk36y460007ian54vrh0yla',
        homeTeam: 'Escuela FC',
        awayTeam: 'Old Rivals',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago (finished)
        time: '18:00',
        venue: 'Escuela Stadium',
        competition: 'Friendly Match',
        stadiumCapacity: 500,
        score: '2 - 1',
        homeLineup: fceLineup,
        homeBench: fceBench,
        awayLineup: JSON.stringify([
          { name: 'M. Sterling', position: 'GK' },
          { name: 'A. Becker', position: 'CB' },
          { name: 'J. Stones', position: 'CB' },
          { name: 'Rodri', position: 'CDM' },
          { name: 'J. Grealish', position: 'LW' },
          { name: 'B. Silva', position: 'RW' },
          { name: 'E. Haaland', position: 'CF' },
        ]),
        awayBench: JSON.stringify([]),
        goalScorers: 'Duc 15\', Hung 68\' // Rival 42\'',
        manOfTheMatch: 'Trần Minh Đức',
        attendance: 420,
        weather: 'Clear Sky // 24°C',
        tvBroadcast: 'ESCUELA_LIVE',
        referee: 'Official_X',
        cards: '1 Yellow (Rival)',
      },
    ]

    const createdMatches = []
    for (const match of matches) {
      const m = await prisma.match.upsert({
        where: { id: match.id },
        update: {
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          date: match.date,
          time: match.time,
          venue: match.venue,
          competition: match.competition,
          stadiumCapacity: match.stadiumCapacity,
          score: match.score || null,
          homeLineup: (match as any).homeLineup,
          homeBench: (match as any).homeBench,
          awayLineup: (match as any).awayLineup,
          awayBench: (match as any).awayBench,
          goalScorers: (match as any).goalScorers || null,
          manOfTheMatch: (match as any).manOfTheMatch || null,
          attendance: (match as any).attendance || null,
          weather: (match as any).weather || null,
          tvBroadcast: (match as any).tvBroadcast || null,
          referee: (match as any).referee || null,
          cards: (match as any).cards || null,
        },
        create: match
      })
      createdMatches.push(m)
    }

    // 6. SQUAD_REGISTRY
    console.log('DEPLOYING_SQUAD_REGISTRY...')
    const teamMembers = [
      { name: 'Nguyễn Thành Đạt', role: 'GK', order: 1, image: 'Đạt.jfif', bio: 'Elite First Team Guardian.' },
      { name: 'Lê Vũ Nhật Minh', role: 'CB', order: 2, image: '', bio: 'Defensive Anchor.' },
      { name: 'Nguyễn Đỗ Bảo Khánh', role: 'CB', order: 3, image: 'BKhanh.jfif', bio: 'Strategic Club Stopper.' },
      { name: 'Nguyễn Đức Bảo Phong', role: 'CB', order: 4, image: '', bio: 'Vanguard Defender.' },
      { name: 'Vũ Nhật Ninh', role: 'RB', order: 5, image: '', bio: 'Lateral Operational Unit.' },
      { name: 'Phạm Công Toản', role: 'LB', order: 6, image: '', bio: 'Defensive Flank Specialist.' },
      { name: 'Hoàng Đặng Việt Hùng', role: 'CDM', order: 7, image: 'Hùng.png', bio: 'Midfield Engine.' },
      { name: 'Đỗ Quốc Khánh', role: 'AMF', order: 8, image: '', bio: 'Tactical Playmaker.' },
      { name: 'Phạm Anh Phương', role: 'LW', order: 9, image: '', bio: 'Elite Winger.' },
      { name: 'Nguyễn Quang Minh Thành', role: 'CF', order: 10, image: '', bio: 'Primary Strike Unit.' },
      { name: 'Đặng Minh Việt', role: 'RW', order: 11, image: '', bio: 'Offensive Flank Operative.' },
      { name: 'Trần Minh Đức', role: 'CF', order: 12, image: 'Duc.JPG', bio: 'Elite Scoring Specialist.' },
    ]

    for (const member of teamMembers) {
      const existing = await prisma.teamMember.findFirst({ where: { name: member.name } });
      if (!existing) {
        await prisma.teamMember.create({ data: member })
      }
    }

    // 7. TICKETS & MEMBERSHIPS (MOCK DATA REMOVED AS REQUESTED)
    console.log('RESERVING_METRICS_FOR_LIVE_DATA...')

    await prisma.membership.create({
      data: {
        userId: adminUser.id,
        planId: 'premium',
        status: 'active',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 355),
      },
    })

    console.log('--- SYSTEM_SEED_COMPLETE: 100% OPERATIONAL ---')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
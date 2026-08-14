import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const matches = await prisma.match.findMany({
    where: {
      date: {
        gte: new Date()
      }
    },
    orderBy: {
      date: 'asc'
    }
  })

  console.log('--- UPCOMING MATCHES REGISTRY ---')
  matches.forEach(m => {
    console.log(`ID: ${m.id}`)
    console.log(`Teams: ${m.homeTeam} vs ${m.awayTeam}`)
    console.log(`Date: ${m.date} | Time: ${m.time}`)
    console.log(`Status: ${m.status}`)
    console.log(`Home Lineup JSON: ${m.homeLineup || '[]'}`)
    console.log(`Away Lineup JSON: ${m.awayLineup || '[]'}`)
    console.log(`Home Bench JSON: ${m.homeBench || '[]'}`)
    console.log(`Away Bench JSON: ${m.awayBench || '[]'}`)
    console.log('-------------------------------')
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

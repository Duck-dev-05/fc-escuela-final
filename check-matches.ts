import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Matches and Ticket Counts ---');
  const matches = await prisma.match.findMany({
    include: {
      _count: {
        select: { tickets: true }
      }
    }
  });
  
  for (const match of matches) {
    console.log(`${match.homeTeam} vs ${match.awayTeam}: ${match._count.tickets} orders`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

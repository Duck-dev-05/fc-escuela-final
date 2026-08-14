import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- FC Escuela Tickets ---');
  const tickets = await prisma.ticket.findMany({
    include: {
      match: true,
      user: {
        select: {
          email: true,
          name: true
        }
      }
    }
  });
  console.log(JSON.stringify(tickets, null, 2));
  console.log(`Total Tickets: ${tickets.length}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

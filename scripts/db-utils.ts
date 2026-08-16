import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMatches() {
  console.log('--- Matches and Ticket Counts ---');
  const matches = await prisma.match.findMany({
    include: {
      _count: {
        select: { tickets: true }
      }
    }
  });
  
  for (const match of matches) {
    console.log(`${match.homeTeam} vs ${match.awayTeam}: ${match._count.tickets} orders (ID: ${match.id})`);
  }
}

async function checkTickets() {
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

async function clearTickets() {
  const result = await prisma.ticket.deleteMany();
  console.log('Escuela Tickets Cleared:', result);
}

async function checkDb() {
  const matches = await prisma.match.findMany();
  console.log('Matches in database:', matches.length);
  console.log('Match data:', JSON.stringify(matches, null, 2));
}

async function setCaptain(nameOrId: string) {
  let updated;
  if (/^\d+$/.test(nameOrId)) {
    updated = await prisma.teamMember.update({
      where: { id: parseInt(nameOrId, 10) },
      data: { captain: true },
    });
  } else {
    // find by name
    const member = await prisma.teamMember.findFirst({
      where: { name: { contains: nameOrId, mode: 'insensitive' } }
    });
    if (!member) {
      console.error(`Team member matching "${nameOrId}" not found.`);
      return;
    }
    updated = await prisma.teamMember.update({
      where: { id: member.id },
      data: { captain: true },
    });
  }
  console.log('Updated team member:', updated);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(`
Usage: npx tsx scripts/db-utils.ts <command> [args]

Commands:
  check-matches        Show all matches and their ticket counts
  check-tickets        List all purchased tickets in JSON format
  clear-tickets        Delete all tickets from the database
  check-db             Display raw match data from the database
  set-captain <name>   Set a team member as captain by name or ID
`);
    return;
  }

  switch (command) {
    case 'check-matches':
      await checkMatches();
      break;
    case 'check-tickets':
      await checkTickets();
      break;
    case 'clear-tickets':
      await clearTickets();
      break;
    case 'check-db':
      await checkDb();
      break;
    case 'set-captain':
      if (!args[1]) {
        console.error('Please specify a team member name or ID.');
        process.exit(1);
      }
      await setCaptain(args[1]);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      break;
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

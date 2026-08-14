import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clear() {
  const result = await prisma.ticket.deleteMany();
  console.log('Escuela Ticket Cleared:', result);
}

clear()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

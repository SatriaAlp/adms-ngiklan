import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('USERS:');
  console.log(JSON.stringify(users, null, 2));

  const merchants = await prisma.merchant.findMany();
  console.log('MERCHANTS:');
  console.log(JSON.stringify(merchants, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

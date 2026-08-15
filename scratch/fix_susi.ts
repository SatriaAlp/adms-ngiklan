import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.merchant.updateMany({
    where: { name: 'Digital Creation' },
    data: { ownerId: 'usr-1001' }
  });
  console.log('Fixed ownerId for Digital Creation to usr-1001');
}

main().catch(console.error).finally(() => prisma.$disconnect());

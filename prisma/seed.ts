import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: 'usr-1001',
        name: 'Afifah Rizki',
        email: 'afifahrizki25@gmail.com',
        phone: '081234567890',
        passwordHash: 'hashedpassword',
        role: 'ADMIN',
        status: 'ACTIVE',
      },
      {
        id: 'usr-1002',
        name: 'Budi Santoso',
        email: 'budi@example.com',
        phone: '081299998888',
        passwordHash: 'hashedpassword',
        role: 'MERCHANT',
        status: 'ACTIVE',
      },
      {
        id: 'usr-1003',
        name: 'Citra Kirana',
        email: 'citra@example.com',
        phone: '081277776666',
        passwordHash: 'hashedpassword',
        role: 'USER',
        status: 'ACTIVE',
      },
      {
        id: 'usr-1004',
        name: 'Deni Setiawan',
        email: 'deni@example.com',
        phone: '081255554444',
        passwordHash: 'hashedpassword',
        role: 'USER',
        status: 'SUSPENDED',
      },
      {
        id: 'usr-1005',
        name: 'Super Admin Kedua',
        email: 'superadmin2@gmail.com',
        phone: '081234567891',
        passwordHash: 'hashedpassword',
        role: 'ADMIN',
        status: 'ACTIVE',
      }
    ],
    skipDuplicates: true
  });
  console.log('Seeded users');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

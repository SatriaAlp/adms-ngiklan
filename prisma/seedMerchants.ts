import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.merchant.createMany({
    data: [
      {
        id: 'merch-1001',
        ownerId: 'usr-1002',
        name: 'ADMS Creative Store',
        slug: 'adms-creative-store',
        logo: 'https://ui-avatars.com/api/?name=ADMS&background=0D8ABC&color=fff',
        description: 'Toko resmi ADMS menyediakan produk digital berkualitas.',
        verificationStatus: 'VERIFIED',
        location: 'Jakarta',
        contactWhatsapp: '081299998888',
      },
      {
        id: 'merch-1002',
        ownerId: 'usr-1003',
        name: 'Citra Design Agency',
        slug: 'citra-design',
        logo: 'https://ui-avatars.com/api/?name=CD&background=E11D48&color=fff',
        description: 'Jasa desain grafis dan template canva premium.',
        verificationStatus: 'PENDING',
        location: 'Bandung',
        contactWhatsapp: '081277776666',
      },
      {
        id: 'merch-1003',
        ownerId: 'usr-1004',
        name: 'Deni Web Scripts',
        slug: 'deni-scripts',
        logo: 'https://ui-avatars.com/api/?name=DW&background=F59E0B&color=fff',
        description: 'Sedia berbagai source code PHP Laravel.',
        verificationStatus: 'REJECTED',
        location: 'Surabaya',
        contactWhatsapp: '081255554444',
      }
    ],
    skipDuplicates: true
  });
  console.log('Seeded merchants');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

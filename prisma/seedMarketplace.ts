import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create Categories
  const cat1 = await prisma.category.create({
    data: {
      id: 'cat-1001',
      name: 'Template & Design',
      slug: 'template-design',
      iconName: 'Layout',
      description: 'Template presentasi, social media kit, dan desain Canva.',
    }
  });

  const cat2 = await prisma.category.create({
    data: {
      id: 'cat-1002',
      name: 'Source Code',
      slug: 'source-code',
      iconName: 'Code',
      description: 'Source code website, aplikasi mobile, dan script.',
    }
  });

  // Create Products
  await prisma.product.createMany({
    data: [
      {
        id: 'prod-1001',
        merchantId: 'merch-1001', // ADMS Creative Store
        title: 'Premium Canva Social Media Kit',
        slug: 'canva-social-media-kit',
        categoryId: cat1.id,
        price: 150000,
        shortDescription: '100+ Template Canva premium siap pakai.',
        fullDescription: 'Template berkualitas tinggi untuk kebutuhan social media marketing.',
        status: 'ACTIVE',
      },
      {
        id: 'prod-1002',
        merchantId: 'merch-1002', // Citra Design Agency
        title: 'E-Commerce App Source Code',
        slug: 'ecommerce-app-source-code',
        categoryId: cat2.id,
        price: 500000,
        shortDescription: 'Source code lengkap e-commerce menggunakan React Native.',
        fullDescription: 'Aplikasi e-commerce lengkap dengan fitur keranjang, pembayaran, dan notifikasi.',
        status: 'PENDING_REVIEW',
      },
      {
        id: 'prod-1003',
        merchantId: 'merch-1001', // ADMS Creative Store
        title: 'Company Profile WordPress Theme',
        slug: 'company-profile-wp',
        categoryId: cat2.id,
        price: 250000,
        shortDescription: 'Tema WordPress eksklusif untuk company profile profesional.',
        fullDescription: 'Tema ringan, SEO friendly, dan mudah dicustom.',
        status: 'REJECTED',
      }
    ],
    skipDuplicates: true
  });
  console.log('Seeded products & categories');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

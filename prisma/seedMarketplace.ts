import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Marketplace Data (31 Products)...');

  // 1. Create ADMS Admin User
  const passwordHash = 'dummy_hash'; // Removed bcrypt dependency for seed
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@adms.id' },
    update: {},
    create: {
      name: 'ADMS Official',
      email: 'admin@adms.id',
      phone: '081234567890',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });

  // 2. Create ADMS Official Merchant
  const admsMerchant = await prisma.merchant.upsert({
    where: { slug: 'adms-official' },
    update: {},
    create: {
      ownerId: adminUser.id,
      name: 'ADMS Official Store',
      slug: 'adms-official',
      description: 'Layanan resmi dari Armada Digital Marketing Solution',
      verificationStatus: 'VERIFIED',
      location: 'Jakarta, Indonesia',
      contactWhatsapp: '081234567890'
    },
  });

  // 2b. Create Merchant Demo User
  const merchantUser = await prisma.user.upsert({
    where: { email: 'merchant@adms.id' },
    update: {},
    create: {
      name: 'Merchant Demo',
      email: 'merchant@adms.id',
      phone: '081299998888',
      passwordHash,
      role: 'MERCHANT',
    },
  });

  // 2c. Create Merchant Demo Store
  await prisma.merchant.upsert({
    where: { slug: 'merchant-demo' },
    update: {},
    create: {
      ownerId: merchantUser.id,
      name: 'Merchant Demo Store',
      slug: 'merchant-demo',
      description: 'Toko demo merchant untuk pengujian fitur marketplace ADMS',
      verificationStatus: 'VERIFIED',
      location: 'Bandung, Indonesia',
      contactWhatsapp: '081299998888',
    },
  });

  // 3. Categories
  const categoriesData = [
    { name: 'Digital Ads', slug: 'digital-ads', iconName: 'Megaphone' },
    { name: 'Website & Development', slug: 'website-development', iconName: 'Monitor' },
    { name: 'Marketing & Distribution', slug: 'marketing-distribution', iconName: 'TrendingUp' },
    { name: 'Automation & Blast', slug: 'automation-blast', iconName: 'Zap' },
    { name: 'Social Media', slug: 'social-media', iconName: 'Share2' },
    { name: 'Legal & Bisnis', slug: 'legal-bisnis', iconName: 'Briefcase' },
    { name: 'Layanan Offline', slug: 'layanan-offline', iconName: 'MapPin' },
  ];

  const categoryMap = new Map();
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap.set(cat.slug, createdCat.id);
  }

  // 4. Products Data
  const products = [
    { title: 'Google Ads', category: 'digital-ads', price: 350000, priceType: 'STARTING_FROM', desc: 'Layanan pengelolaan iklan Google Ads untuk membantu bisnis menjangkau calon pelanggan yang sedang mencari produk atau jasa melalui Google.' },
    { title: 'Facebook Ads', category: 'digital-ads', price: 350000, priceType: 'STARTING_FROM', desc: 'Layanan pemasangan dan pengelolaan Facebook Ads untuk meningkatkan jangkauan, traffic, leads, dan penjualan.' },
    { title: 'Instagram Ads', category: 'digital-ads', price: 350000, priceType: 'STARTING_FROM', desc: 'Layanan Instagram Ads untuk membantu bisnis menjangkau audiens yang relevan melalui konten iklan visual.' },
    { title: 'TikTok Ads', category: 'digital-ads', price: 350000, priceType: 'STARTING_FROM', desc: 'Layanan TikTok Ads untuk meningkatkan awareness, engagement, traffic, dan potensi konversi bisnis.' },
    { title: 'Google Maps Review', category: 'digital-ads', price: 350000, priceType: 'STARTING_FROM', desc: 'Layanan optimasi kehadiran bisnis pada Google Maps untuk membantu meningkatkan kredibilitas dan visibilitas bisnis.' },
    
    { title: 'Landing Page Conversion', category: 'website-development', price: 999000, priceType: 'STARTING_FROM', desc: 'Landing page yang dirancang untuk mengarahkan pengunjung agar melakukan tindakan seperti menghubungi bisnis, mengisi form, atau melakukan pembelian.' },
    { title: 'Website / Company Profile Corporate', category: 'website-development', price: 1850000, priceType: 'STARTING_FROM', desc: 'Website profesional untuk perusahaan, bisnis, organisasi, dan brand yang membutuhkan tampilan terpercaya dan profesional.' },
    { title: 'E-Commerce', category: 'website-development', price: 4500000, priceType: 'STARTING_FROM', desc: 'Website toko online dengan fitur katalog produk, pembayaran, pemesanan, dan manajemen produk.' },
    { title: 'Custom React Web App', category: 'website-development', price: 9999000, priceType: 'STARTING_FROM', desc: 'Pengembangan aplikasi web custom menggunakan React dengan struktur modern, cepat, scalable, dan sesuai kebutuhan bisnis.' },
    { title: 'Jasa Desain Website WordPress', category: 'website-development', price: 1500000, priceType: 'STARTING_FROM', desc: 'Pembuatan website profesional berbasis WordPress dengan desain modern dan SEO friendly.' },
    { title: 'Jasa Blog PBN', category: 'website-development', price: 999000, priceType: 'STARTING_FROM', desc: 'Pembuatan dan pengelolaan blog PBN untuk mendukung strategi SEO dan backlink website.' },
    { title: 'Maintenance / Admin Website', category: 'website-development', price: 2999000, priceType: 'STARTING_FROM', desc: 'Layanan pemeliharaan, update, pengelolaan, dan administrasi website secara rutin.' },
    { title: 'Optimasi SEO Website / Google Index', category: 'website-development', price: 6000000, priceType: 'STARTING_FROM', desc: 'Optimasi SEO website untuk membantu meningkatkan struktur website, indexing, dan visibilitas di mesin pencari.' },
    { title: 'Custom Fitur', category: 'website-development', price: 500000, priceType: 'STARTING_FROM', desc: 'Pengembangan fitur tambahan sesuai kebutuhan website atau sistem bisnis.' },

    { title: 'Artikel SEO', category: 'marketing-distribution', price: 99000, priceType: 'STARTING_FROM', desc: 'Pembuatan artikel SEO yang dirancang untuk membantu website mendapatkan traffic organik melalui mesin pencari.' },
    { title: 'SMS Masking', category: 'marketing-distribution', price: 10000, priceType: 'STARTING_FROM', desc: 'Layanan pengiriman SMS dengan identitas pengirim bisnis untuk kebutuhan komunikasi dan promosi.' },
    { title: 'Posting 1000 Website', category: 'marketing-distribution', price: 399000, priceType: 'STARTING_FROM', desc: 'Layanan publikasi konten pada jaringan website untuk membantu meningkatkan exposure dan distribusi konten.' },
    { title: 'Backlink PBN', category: 'marketing-distribution', price: 8500000, priceType: 'STARTING_FROM', desc: 'Layanan backlink untuk mendukung strategi SEO dan meningkatkan authority website.' },
    { title: 'Sebar Brosur', category: 'marketing-distribution', price: 350000, priceType: 'STARTING_FROM', desc: 'Layanan distribusi brosur untuk membantu bisnis menjangkau calon pelanggan secara offline.' },
    { title: 'Press Release / Media Placement', category: 'marketing-distribution', price: 999000, priceType: 'STARTING_FROM', desc: 'Layanan publikasi press release dan media placement untuk meningkatkan exposure serta kredibilitas brand.' },

    { title: 'WhatsApp Blast', category: 'automation-blast', price: 350000, priceType: 'STARTING_FROM', desc: 'Layanan pengiriman pesan WhatsApp secara massal untuk kebutuhan promosi dan komunikasi bisnis.' },
    { title: 'SMS Broadcast', category: 'automation-blast', price: 350000, priceType: 'STARTING_FROM', desc: 'Layanan pengiriman SMS broadcast untuk menjangkau pelanggan secara cepat dan luas.' },
    { title: 'WhatsApp API / Automation', category: 'automation-blast', price: 500000, priceType: 'STARTING_FROM', desc: 'Integrasi WhatsApp API dan automation untuk membantu bisnis mengotomatisasi komunikasi dengan pelanggan.' },

    { title: 'Kelola Sosmed', category: 'social-media', price: 2500000, priceType: 'STARTING_FROM', desc: 'Layanan pengelolaan media sosial bisnis mulai dari perencanaan konten, posting, hingga pengelolaan akun.' },
    { title: 'Content Creation', category: 'social-media', price: 2999000, priceType: 'STARTING_FROM', desc: 'Produksi konten kreatif untuk kebutuhan social media dan digital marketing bisnis.' },

    { title: 'Pendirian PT', category: 'legal-bisnis', price: 2500000, priceType: 'STARTING_FROM', desc: 'Layanan bantuan pendirian badan usaha berbentuk PT.' },
    { title: 'Pendirian CV', category: 'legal-bisnis', price: 2500000, priceType: 'STARTING_FROM', desc: 'Layanan bantuan pendirian badan usaha berbentuk CV.' },
    { title: 'Legalitas Usaha', category: 'legal-bisnis', price: 1000000, priceType: 'STARTING_FROM', desc: 'Layanan pengurusan legalitas usaha seperti NIB, perizinan usaha, dan legalitas UMKM.' },

    { title: 'Pindahan Rumah', category: 'layanan-offline', price: 0, priceType: 'CONTACT_US', desc: 'Layanan bantuan pindahan rumah untuk kebutuhan pemindahan barang dan perlengkapan.' },
    { title: 'Konstruksi Luxury - Komersil', category: 'layanan-offline', price: 5000000, priceType: 'STARTING_FROM', desc: 'Layanan konstruksi untuk kebutuhan bangunan komersial dengan konsep dan pengerjaan profesional.' },
    { title: 'Konstruksi Luxury - Luxury', category: 'layanan-offline', price: 7000000, priceType: 'STARTING_FROM', desc: 'Layanan konstruksi premium untuk kebutuhan hunian atau bangunan dengan konsep luxury.' },
  ];

  for (const item of products) {
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        price: item.price,
        priceType: item.priceType as any,
        shortDescription: item.desc,
        status: 'ACTIVE',
      },
      create: {
        merchantId: admsMerchant.id,
        categoryId: categoryMap.get(item.category),
        title: item.title,
        slug,
        price: item.price,
        priceType: item.priceType as any,
        shortDescription: item.desc,
        fullDescription: item.desc + '\\n\\n' + 'ADMS menyediakan layanan profesional yang dikerjakan oleh tim ahli. Proses cepat, hasil transparan dan berorientasi pada kepuasan pelanggan.',
        status: 'ACTIVE',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80', // Dummy placeholder
      },
    });

    // Create Dummy Packages for some products
    if (item.priceType === 'STARTING_FROM') {
      const existingPackages = await prisma.productPackage.findMany({ where: { productId: product.id }});
      if (existingPackages.length === 0) {
        await prisma.productPackage.createMany({
          data: [
            {
              productId: product.id,
              name: 'Basic',
              price: item.price,
              description: 'Paket dasar dengan fitur esensial.',
              features: JSON.stringify(['Konsultasi Awal', 'Laporan Standar', 'Support Jam Kerja']),
              deliveryTime: '7 Hari',
            },
            {
              productId: product.id,
              name: 'Standard',
              price: item.price * 2,
              description: 'Paket menengah yang paling disarankan.',
              features: JSON.stringify(['Semua fitur Basic', 'Prioritas Pengerjaan', 'Laporan Bulanan']),
              deliveryTime: '5 Hari',
            },
            {
              productId: product.id,
              name: 'Premium',
              price: item.price * 4,
              description: 'Paket paling lengkap untuk hasil maksimal.',
              features: JSON.stringify(['Semua fitur Standard', 'Support 24/7', 'Laporan Eksklusif', 'Dedicated Account Manager']),
              deliveryTime: '3 Hari',
            }
          ]
        });
      }
    }
  }

  console.log('Successfully seeded 31 Marketplace Products');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

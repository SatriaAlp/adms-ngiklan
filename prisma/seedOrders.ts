import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const order1 = await prisma.order.create({
    data: {
      id: 'ORD-2026-8801',
      customerId: 'usr-1003', // Citra Kirana
      subtotal: 150000,
      discount: 0,
      platformFee: 7500, // 5%
      totalAmount: 157500,
      paymentMethod: 'QRIS',
      paymentStatus: 'PAID',
      transactionType: 'MARKETPLACE',
      createdAt: new Date(Date.now() - 30 * 60000), // 30 mins ago
      items: {
        create: [
          {
            productId: 'prod-1001',
            price: 150000,
            quantity: 1,
            downloadUrl: 'https://example.com/download/prod-1001'
          }
        ]
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      id: 'ORD-2026-8802',
      customerId: 'usr-1004', 
      subtotal: 500000,
      discount: 50000,
      platformFee: 22500,
      totalAmount: 472500,
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'PENDING',
      transactionType: 'MARKETPLACE',
      createdAt: new Date(Date.now() - 60 * 60000), // 1 hour ago
      items: {
        create: [
          {
            productId: 'prod-1002',
            price: 500000,
            quantity: 1
          }
        ]
      }
    }
  });

  const order3 = await prisma.order.create({
    data: {
      id: 'ORD-2026-8799',
      customerId: 'usr-1003', 
      subtotal: 250000,
      discount: 0,
      platformFee: 12500,
      totalAmount: 262500,
      paymentMethod: 'EWALLET',
      paymentStatus: 'REFUNDED',
      transactionType: 'MARKETPLACE',
      createdAt: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      items: {
        create: [
          {
            productId: 'prod-1003',
            price: 250000,
            quantity: 1
          }
        ]
      }
    }
  });

  console.log('Seeded orders with order items');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

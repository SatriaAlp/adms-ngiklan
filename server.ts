import path from "path";
import { createServer as createViteServer } from "vite";
import express from "express";
import { app } from "./server/app";

import { PrismaClient } from "@prisma/client";
import { GoogleGenAI } from "@google/genai";

const prisma = new PrismaClient();
const PORT = 3000;

async function startServer() {
  const app = express();
  
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // Initialize Gemini AI Client for Server-Side Chatbot
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health Check Endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      platform: "ADMS - Armada Digital Marketing System",
      timestamp: new Date().toISOString(),
    });
  });

  // ==========================================
  // ADMIN API - USERS MODULE
  // ==========================================

  app.get("/api/admin/users", async (req, res) => {
    try {
      const { role, search } = req.query;
      const whereClause: any = {};
      
      if (role && role !== 'ALL') {
        whereClause.role = role;
      }
      
      if (search) {
        whereClause.OR = [
          { name: { contains: String(search) } },
          { email: { contains: String(search) } },
          { id: { contains: String(search) } }
        ];
      }

      const users = await prisma.user.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: "Gagal mengambil data user" });
    }
  });

  app.put("/api/admin/users/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { status }
      });
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ error: "Gagal mengupdate status user" });
    }
  });

  // ==========================================
  // ADMIN API - MERCHANTS MODULE
  // ==========================================

  app.get("/api/admin/merchants", async (req, res) => {
    try {
      const { verificationStatus, search } = req.query;
      const whereClause: any = {};
      
      if (verificationStatus && verificationStatus !== 'ALL') {
        whereClause.verificationStatus = verificationStatus;
      }
      
      if (search) {
        whereClause.OR = [
          { name: { contains: String(search) } },
          { slug: { contains: String(search) } }
        ];
      }

      const merchants = await prisma.merchant.findMany({
        where: whereClause,
        include: { owner: true, products: true },
        orderBy: { createdAt: 'desc' },
      });
      res.json(merchants);
    } catch (error) {
      console.error('Error fetching merchants:', error);
      res.status(500).json({ error: "Gagal mengambil data merchant" });
    }
  });

  app.put("/api/admin/merchants/:id/verify", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      const updatedMerchant = await prisma.merchant.update({
        where: { id },
        data: { verificationStatus: status }
      });
      
      // If approved, update user role to MERCHANT
      if (status === 'VERIFIED') {
        await prisma.user.update({
          where: { id: updatedMerchant.ownerId },
          data: { role: 'MERCHANT' }
        });
      }

      res.json({ merchant: updatedMerchant, notes });
    } catch (error) {
      console.error('Error verifying merchant:', error);
      res.status(500).json({ error: "Gagal memverifikasi merchant" });
    }
  });

  // ==========================================
  // ADMIN API - MARKETPLACE (PRODUCTS & CATEGORIES)
  // ==========================================

  app.get("/api/admin/products", async (req, res) => {
    try {
      const { status, search } = req.query;
      const whereClause: any = {};
      
      if (status && status !== 'ALL') {
        whereClause.status = status;
      }
      
      if (search) {
        whereClause.title = { contains: String(search) };
      }

      const products = await prisma.product.findMany({
        where: whereClause,
        include: { merchant: true, category: true },
        orderBy: { createdAt: 'desc' },
      });
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: "Gagal mengambil data produk" });
    }
  });

  app.put("/api/admin/products/:id/moderate", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: { status } // Ideally, you would log 'notes' to a moderation history table
      });
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error moderating product:', error);
      res.status(500).json({ error: "Gagal memoderasi produk" });
    }
  });

  app.get("/api/admin/categories", async (req, res) => {
    try {
      const categories = await prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: 'asc' },
      });
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: "Gagal mengambil kategori" });
    }
  });

  app.post("/api/admin/categories", async (req, res) => {
    try {
      const { name, slug, description, iconName } = req.body;
      const category = await prisma.category.create({
        data: { name, slug, description, iconName }
      });
      res.json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: "Gagal membuat kategori" });
    }
  });

  app.put("/api/admin/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, slug, description, iconName } = req.body;
      const category = await prisma.category.update({
        where: { id },
        data: { name, slug, description, iconName }
      });
      res.json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: "Gagal mengupdate kategori" });
    }
  });

  // ==========================================
  // ADMIN API - TRANSACTIONS & REFUNDS
  // ==========================================

  app.get("/api/admin/orders", async (req, res) => {
    try {
      const { status, search } = req.query;
      const whereClause: any = {};
      
      if (status && status !== 'ALL') {
        whereClause.paymentStatus = status;
      }
      
      if (search) {
        whereClause.id = { contains: String(search) };
      }

      const orders = await prisma.order.findMany({
        where: whereClause,
        include: { customer: true, items: { include: { product: { include: { merchant: true } } } } },
        orderBy: { createdAt: 'desc' },
      });
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: "Gagal mengambil data pesanan" });
    }
  });

  app.get("/api/admin/orders/:id", async (req, res) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: { customer: true, items: { include: { product: { include: { merchant: true } } } } }
      });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil detail pesanan" });
    }
  });

  app.get("/api/admin/refunds", async (req, res) => {
    try {
      // Since Refund model might not exist, we'll return an empty array for now to prevent breaking the UI
      // In a real app, you would have a Refund model in Prisma
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil data refund" });
    }
  });

  app.put("/api/admin/refunds/:id/process", async (req, res) => {
    try {
      const { status, notes } = req.body;
      // Mock processing for now since Refund model is not defined in current prisma schema
      res.json({ status, notes });
    } catch (error) {
      res.status(500).json({ error: "Gagal memproses refund" });
    }
  });

  // ==========================================
  // ADMIN API - FINANCE & WITHDRAWALS
  // ==========================================

  app.get("/api/admin/finance/overview", async (req, res) => {
    try {
      // Mock finance overview data
      res.json({
        grossRevenue: 15000000,
        gmv: 25000000,
        platformFee: 1250000,
        paymentFee: 150000,
        refunds: 500000,
        merchantPayout: 13100000,
        netRevenue: 1250000,
        chartData: [
          { label: 'Senin', value: 1200000 },
          { label: 'Selasa', value: 2100000 },
          { label: 'Rabu', value: 1800000 },
          { label: 'Kamis', value: 3200000 },
          { label: 'Jumat', value: 2500000 },
          { label: 'Sabtu', value: 1900000 },
          { label: 'Minggu', value: 2800000 }
        ]
      });
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil overview finance" });
    }
  });

  app.get("/api/admin/finance/balances", async (req, res) => {
    try {
      // Return empty array for now since there's no Balance/Withdrawal model in schema yet
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil saldo merchant" });
    }
  });

  app.get("/api/admin/withdrawals", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil data penarikan" });
    }
  });

  app.put("/api/admin/withdrawals/:id/process", async (req, res) => {
    try {
      const { status, notes } = req.body;
      res.json({ status, notes });
    } catch (error) {
      res.status(500).json({ error: "Gagal memproses penarikan" });
    }
  });

  // ==========================================
  // ADMIN API - ADVERTISING
  // ==========================================

  app.get("/api/admin/ads/packages", async (req, res) => {
    try {
      res.json([
        { id: 'pkg-1', name: 'Homepage Top Banner', price: 500000, durationDays: 7, type: 'BANNER' },
        { id: 'pkg-2', name: 'Sidebar Spotlight', price: 250000, durationDays: 7, type: 'SIDEBAR' },
        { id: 'pkg-3', name: 'Premium Listing', price: 150000, durationDays: 14, type: 'LISTING' },
      ]);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil data paket iklan" });
    }
  });

  app.get("/api/admin/ads/active", async (req, res) => {
    try {
      // Mock data
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil iklan aktif" });
    }
  });

  app.get("/api/admin/ads/requests", async (req, res) => {
    try {
      // Mock data
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil pengajuan iklan" });
    }
  });

  app.put("/api/admin/ads/requests/:id/moderate", async (req, res) => {
    try {
      const { status, notes } = req.body;
      res.json({ status, notes });
    } catch (error) {
      res.status(500).json({ error: "Gagal memoderasi iklan" });
    }
  });

  // ==========================================
  // ADMIN API - PROMO
  // ==========================================

  let mockPromos = [
    {
      id: 'PRM-101',
      code: 'KEMERDEKAAN',
      type: 'PERCENTAGE',
      value: 17,
      maxDiscount: 50000,
      minPurchase: 100000,
      quota: 1000,
      used: 350,
      startDate: new Date('2026-08-01T00:00:00Z'),
      endDate: new Date('2026-08-31T23:59:59Z'),
      isActive: true
    },
    {
      id: 'PRM-102',
      code: 'NEWUSER50',
      type: 'FIXED',
      value: 50000,
      maxDiscount: null,
      minPurchase: 150000,
      quota: 500,
      used: 500,
      startDate: new Date('2026-01-01T00:00:00Z'),
      endDate: new Date('2026-12-31T23:59:59Z'),
      isActive: false
    }
  ];

  app.get("/api/admin/promos", async (req, res) => {
    try {
      res.json(mockPromos);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil data promo" });
    }
  });

  app.post("/api/admin/promos", async (req, res) => {
    try {
      const newPromo = {
        id: `PRM-${Date.now()}`,
        ...req.body,
        used: 0,
      };
      mockPromos.unshift(newPromo);
      res.json(newPromo);
    } catch (error) {
      res.status(500).json({ error: "Gagal membuat promo" });
    }
  });

  app.put("/api/admin/promos/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      mockPromos = mockPromos.map(p => p.id === id ? { ...p, isActive } : p);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Gagal mengubah status promo" });
    }
  });

  // ==========================================
  // ADMIN API - MODERATION
  // ==========================================

  app.get("/api/admin/moderation/reports", async (req, res) => {
    try {
      // Mock data for reports since we don't have a Report schema
      res.json([
        {
          id: 'REP-2026-001',
          type: 'PRODUCT',
          targetId: 'prod-1003',
          targetName: 'Company Profile WordPress Theme',
          reportedBy: { name: 'Ahmad User', email: 'ahmad@example.com' },
          reason: 'SPAM',
          description: 'Produk ini sepertinya hasil curian dari theme forest tanpa lisensi.',
          status: 'PENDING',
          createdAt: new Date(Date.now() - 86400000)
        },
        {
          id: 'REP-2026-002',
          type: 'MERCHANT',
          targetId: 'merch-1002',
          targetName: 'Citra Design Agency',
          reportedBy: { name: 'Budi Santoso', email: 'budi@example.com' },
          reason: 'FRAUD',
          description: 'Merchant ini mengirimkan file kosong setelah pembayaran.',
          status: 'PENDING',
          createdAt: new Date(Date.now() - 3600000)
        }
      ]);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil data laporan" });
    }
  });

  app.put("/api/admin/moderation/reports/:id/process", async (req, res) => {
    try {
      const { action, notes } = req.body;
      res.json({ success: true, action, notes });
    } catch (error) {
      res.status(500).json({ error: "Gagal memproses laporan" });
    }
  });

  // ==========================================
  // ADMIN API - SUPPORT & TICKETING
  // ==========================================

  app.get("/api/admin/support/tickets", async (req, res) => {
    try {
      // Mock data for support tickets since we don't have a Ticket schema
      res.json([
        {
          id: 'TKT-2026-901',
          user: { name: 'Dewi Lestari', email: 'dewi@example.com' },
          subject: 'Gagal Download File',
          status: 'OPEN',
          priority: 'HIGH',
          lastUpdate: new Date(Date.now() - 3600000),
          messages: [
            { sender: 'USER', text: 'Halo min, saya sudah bayar tapi link downloadnya error 404.', time: new Date(Date.now() - 7200000) }
          ]
        },
        {
          id: 'TKT-2026-899',
          user: { name: 'Reza Pratama', email: 'reza@example.com' },
          subject: 'Cara Mendaftar Merchant',
          status: 'CLOSED',
          priority: 'LOW',
          lastUpdate: new Date(Date.now() - 86400000 * 2),
          messages: [
            { sender: 'USER', text: 'Permisi, syarat jadi merchant apa saja ya?', time: new Date(Date.now() - 86400000 * 3) },
            { sender: 'ADMIN', text: 'Halo Kak Reza, syaratnya hanya perlu mengisi form KTP dan NPWP di menu profil ya.', time: new Date(Date.now() - 86400000 * 2) }
          ]
        }
      ]);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil data tiket" });
    }
  });

  app.post("/api/admin/support/tickets/:id/reply", async (req, res) => {
    try {
      const { message, markAsResolved } = req.body;
      res.json({ success: true, message, markAsResolved });
    } catch (error) {
      res.status(500).json({ error: "Gagal mengirim balasan" });
    }
  });

  // ==========================================
  // ADMIN API - ANALYTICS & REPORTS
  // ==========================================

  app.get("/api/admin/analytics", async (req, res) => {
    try {
      // Mock data for analytics
      res.json({
        totalVisits: 142050,
        uniqueVisitors: 85400,
        avgSessionDuration: '4m 32s',
        bounceRate: '42.5%',
        trafficSources: [
          { name: 'Organic Search', value: 45 },
          { name: 'Direct', value: 25 },
          { name: 'Social Media', value: 20 },
          { name: 'Referral', value: 10 }
        ],
        conversionRate: '3.8%',
        chartData: [
          { label: 'Mon', visits: 12000, conversions: 450 },
          { label: 'Tue', visits: 15000, conversions: 520 },
          { label: 'Wed', visits: 14000, conversions: 480 },
          { label: 'Thu', visits: 18000, conversions: 610 },
          { label: 'Fri', visits: 21000, conversions: 750 },
          { label: 'Sat', visits: 25000, conversions: 890 },
          { label: 'Sun', visits: 22000, conversions: 810 }
        ]
      });
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil data analytics" });
    }
  });

  // ==========================================
  // ADMIN API - CONTENT MANAGEMENT SYSTEM
  // ==========================================

  let mockPages = [
    {
      id: 'about-us',
      title: 'About Us',
      content: '<h2>Tentang ADMS</h2><p>ADMS adalah platform marketplace terpercaya...</p>',
      lastUpdated: new Date(Date.now() - 86400000 * 10),
      status: 'PUBLISHED'
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      content: '<h2>Syarat & Ketentuan</h2><p>Dengan menggunakan layanan kami...</p>',
      lastUpdated: new Date(Date.now() - 86400000 * 5),
      status: 'PUBLISHED'
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      content: '<h2>Kebijakan Privasi</h2><p>Data Anda aman bersama kami...</p>',
      lastUpdated: new Date(Date.now() - 86400000 * 2),
      status: 'DRAFT'
    }
  ];

  app.get("/api/admin/cms/pages", async (req, res) => {
    try {
      res.json(mockPages);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil data halaman" });
    }
  });

  app.put("/api/admin/cms/pages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { content, status } = req.body;
      mockPages = mockPages.map(p => 
        p.id === id ? { ...p, content, status, lastUpdated: new Date() } : p
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Gagal menyimpan halaman" });
    }
  });

  // ==========================================
  // ADMIN API - SETTINGS
  // ==========================================

  let globalSettings = {
    siteName: 'ADMS Marketplace',
    siteEmail: 'support@adms-network.com',
    platformFeePercent: 5,
    minWithdrawal: 50000,
    maintenanceMode: false,
    midtransClientKey: 'SB-Mid-client-xxxxxxxx',
    midtransServerKey: 'SB-Mid-server-xxxxxxxx'
  };

  app.get("/api/admin/settings", async (req, res) => {
    try {
      res.json(globalSettings);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil pengaturan" });
    }
  });

  app.put("/api/admin/settings", async (req, res) => {
    try {
      globalSettings = { ...globalSettings, ...req.body };
      res.json(globalSettings);
    } catch (error) {
      res.status(500).json({ error: "Gagal menyimpan pengaturan" });
    }
  });

  // ==========================================
  // ADMIN API - NOTIFICATIONS
  // ==========================================

  let mockNotifications = [
    {
      id: 'notif-1',
      title: 'Merchant Baru Mendaftar',
      message: 'Citra Design Agency sedang menunggu verifikasi dokumen.',
      type: 'INFO',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: 'notif-2',
      title: 'Penarikan Dana (Withdrawal)',
      message: 'ADMS Creative Store mengajukan penarikan Rp1.500.000.',
      type: 'WARNING',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30)
    }
  ];

  app.get("/api/admin/notifications/admin", async (req, res) => {
    try {
      res.json(mockNotifications);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil notifikasi" });
    }
  });

  app.post("/api/admin/notifications/broadcast", async (req, res) => {
    try {
      const { title, message, target } = req.body;
      res.json({ success: true, broadcastedTo: target });
    } catch (error) {
      res.status(500).json({ error: "Gagal mengirim broadcast" });
    }
  });

  // ==========================================
  // ADMIN API - SECURITY & AUDIT
  // ==========================================

  app.get("/api/admin/security/logs", async (req, res) => {
    try {
      res.json([
        {
          id: 'log-101',
          user: { name: 'Super Admin', email: 'admin@adms.com' },
          action: 'LOGIN_SUCCESS',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/115',
          createdAt: new Date(Date.now() - 1000 * 60 * 15)
        },
        {
          id: 'log-102',
          user: { name: 'Support Agent', email: 'support@adms.com' },
          action: 'SETTINGS_UPDATE',
          ipAddress: '103.111.200.12',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
        },
        {
          id: 'log-103',
          user: { name: 'Unknown', email: 'unknown' },
          action: 'LOGIN_FAILED',
          ipAddress: '45.33.22.11',
          userAgent: 'python-requests/2.25.1',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
        }
      ]);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil log keamanan" });
    }
  });

  // Secured Digital Product Download Endpoint
  app.get("/api/download/:orderId/:productId", (req, res) => {
    const { orderId, productId } = req.params;

    // Security check: simulate order validation
    if (!orderId || !productId) {
      res.status(400).json({ error: "Invalid order or product request" });
      return;
    }

    // Return dummy digital product file download stream
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="ADMS_Digital_Asset_${productId}.txt"`);
    res.send(`=======================================================
ADMS (Armada Digital Marketing System) - DIGITAL DOWNLOAD
=======================================================

Terima kasih telah membeli produk digital di ADMS!
Order ID: ${orderId}
Product ID: ${productId}
Tanggal Akses: ${new Date().toLocaleString('id-ID')}

LINK AKSES ASSET DIGITAL & INSTRUKSI:
- Folder Google Drive / Canva Template: https://canva.com/design/ADMS-PREMIUM-ACCESS
- Panduan Pemasangan & Dokumentasi: https://armadadigitalmarketing.top/help

Layanan Bantuan ADMS Support:
WhatsApp: +62 812-3456-7890
Email: support@armadadigitalmarketing.top
`);
  });

  // ==========================================
  // PUBLIC API - ADS / CLASSIFIEDS
  // ==========================================

  app.get("/api/public/ads", async (req, res) => {
    try {
      const ads = await prisma.$queryRawUnsafe<any[]>('SELECT * FROM `Advertisement` ORDER BY `createdAt` DESC');
      
      const mappedAds = ads.map(ad => ({
        id: ad.id,
        title: ad.title,
        category: ad.category,
        subcategory: ad.subcategory || undefined,
        description: ad.description,
        price: Number(ad.price) || 0,
        images: ad.images ? JSON.parse(ad.images) : [],
        location: ad.location,
        contactName: ad.contactName,
        whatsapp: ad.whatsapp,
        websiteUrl: ad.websiteUrl || undefined,
        condition: ad.condition,
        tags: ad.tags ? ad.tags.split(',') : [],
        durationDays: Number(ad.durationDays) || 7,
        type: ad.type,
        status: ad.status,
        merchantId: ad.merchantId || undefined,
        ownerId: ad.ownerId || undefined,
        viewsCount: Number(ad.viewsCount) || 0,
        clicksCount: Number(ad.clicksCount) || 0,
        createdAt: ad.createdAt,
        expiresAt: ad.expiresAt,
        packageName: ad.packageName || undefined
      }));
      res.json(mappedAds);
    } catch (error) {
      console.error("Gagal mengambil iklan:", error);
      res.status(500).json({ error: "Gagal mengambil data iklan baris" });
    }
  });

  app.post("/api/public/ads", async (req, res) => {
    try {
      const ad = req.body;
      const id = ad.id || `ad-${Date.now()}`;
      const title = ad.title || 'Iklan Promosi Baru';
      const category = ad.category || 'jasa';
      const subcategory = ad.subcategory || null;
      const description = ad.description || '';
      const price = ad.price || 0;
      const images = JSON.stringify(ad.images || []);
      const location = ad.location || 'Indonesia';
      const contactName = ad.contactName || 'Pengiklan';
      const whatsapp = ad.whatsapp || '';
      const websiteUrl = ad.websiteUrl || null;
      const condition = ad.condition || 'bekas';
      const tags = (ad.tags || []).join(',');
      const durationDays = ad.durationDays || 7;
      const type = ad.type || 'free';
      const status = ad.status || 'pending';
      const merchantId = ad.merchantId || null;
      const ownerId = ad.ownerId || null;
      const viewsCount = ad.viewsCount || 0;
      const clicksCount = ad.clicksCount || 0;
      const createdAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + durationDays * 86400000).toISOString();
      const packageName = ad.packageName || 'Iklan Gratis';

      await prisma.$executeRawUnsafe(
        'INSERT INTO `Advertisement` (`id`, `title`, `category`, `subcategory`, `description`, `price`, `images`, `location`, `contactName`, `whatsapp`, `websiteUrl`, `condition`, `tags`, `durationDays`, `type`, `status`, `merchantId`, `ownerId`, `viewsCount`, `clicksCount`, `createdAt`, `expiresAt`, `packageName`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        id, title, category, subcategory, description, price, images, location, contactName, whatsapp, websiteUrl, condition, tags, durationDays, type, status, merchantId, ownerId, viewsCount, clicksCount, createdAt, expiresAt, packageName
      );

      res.status(201).json({ success: true, id });
    } catch (error) {
      console.error("Gagal membuat iklan:", error);
      res.status(500).json({ error: "Gagal menyimpan data iklan ke database" });
    }
  });

  // ==========================================
  // AUTH API - REGISTER & LOGIN
  // ==========================================

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
      
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: "Email sudah terdaftar!" });
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          phone: phone || '',
          passwordHash: password, // Simplified for demo
          role: 'USER'
        }
      });

      res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      console.error("Registrasi gagal:", error);
      res.status(500).json({ error: "Gagal menyimpan data pendaftaran ke database" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || user.passwordHash !== password) {
        return res.status(401).json({ error: "Email atau Password salah!" });
      }

      res.json({ success: true, user });
    } catch (error) {
      console.error("Login gagal:", error);
      res.status(500).json({ error: "Gagal memproses login" });
    }
  });

  // ==========================================
  // PUBLIC API - FOR CUSTOMER / MARKETPLACE
  // ==========================================

  app.get("/api/public/products", async (req, res) => {
    try {
      const { search, category } = req.query;
      const whereClause: any = {
        status: { in: ['ACTIVE', 'APPROVED'] }
      };
      
      if (search) {
        whereClause.title = { contains: String(search) };
      }
      
      if (category && category !== 'ALL') {
        whereClause.category = { slug: String(category) };
      }

      const products = await prisma.product.findMany({
        where: whereClause,
        include: { merchant: true, category: true, packages: true },
        orderBy: { createdAt: 'desc' },
      });
      res.json(products);
    } catch (error) {
      console.error('Error fetching public products:', error);
      res.status(500).json({ error: "Gagal mengambil data produk" });
    }
  });

  app.get("/api/public/products/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const product = await prisma.product.findUnique({
        where: { slug },
        include: { merchant: true, category: true, packages: true },
      });
      
      if (!product) return res.status(404).json({ error: "Produk tidak ditemukan" });
      res.json(product);
    } catch (error) {
      console.error('Error fetching single public product:', error);
      res.status(500).json({ error: "Gagal mengambil data produk" });
    }
  });

  app.post("/api/public/merchants", async (req, res) => {
    try {
      const { fullName, email, whatsapp, storeName, storeUsername, description, address, ownerId } = req.body;
      
      // Check if user exists by email, if not create dummy user (in real app, this is handled by Auth)
      let user = null;
      if (ownerId) {
        user = await prisma.user.findUnique({ where: { id: ownerId } });
      }
      if (!user) {
        user = await prisma.user.findUnique({ where: { email } });
      }
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            id: ownerId || undefined, // use provided ID if available
            name: fullName,
            email,
            phone: whatsapp,
            passwordHash: 'dummy_hash', // In real app, hash the password
            role: 'USER'
          }
        });
      }

      const merchant = await prisma.merchant.create({
        data: {
          ownerId: user.id,
          name: storeName,
          slug: storeUsername,
          description: description,
          contactWhatsapp: whatsapp,
          location: address,
          verificationStatus: 'PENDING'
        }
      });
      
      res.json(merchant);
    } catch (error) {
      console.error('Error registering merchant:', error);
      res.status(500).json({ error: "Gagal mendaftar merchant" });
    }
  });

  // ==========================================
  // MERCHANT API 
  // ==========================================

  app.post("/api/merchant/products", async (req, res) => {
    try {
      const { title, slug, price, discountPrice, categoryId, shortDescription, fullDescription } = req.body;
      
      // For demo purposes, fetch the first merchant or error
      const merchant = await prisma.merchant.findFirst();
      if (!merchant) {
        return res.status(400).json({ error: "Tidak ada merchant terdaftar" });
      }

      // Check if category exists or use the first one
      let actualCategoryId = categoryId;
      if (!actualCategoryId) {
        const cat = await prisma.category.findFirst();
        if (cat) actualCategoryId = cat.id;
      }

      const product = await prisma.product.create({
        data: {
          merchantId: merchant.id,
          title,
          slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
          price: parseFloat(price) || 0,
          discountPrice: discountPrice ? parseFloat(discountPrice) : null,
          categoryId: actualCategoryId,
          shortDescription: shortDescription || '',
          fullDescription: fullDescription || '',
          status: 'PENDING_REVIEW'
        }
      });
      
      res.json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: "Gagal membuat produk" });
    }
  });

  // AI Assistant Chatbot API Endpoint (Gemini-Powered)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: "Pesan tidak boleh kosong" });
        return;
      }

      // Check if API key is set
      if (!process.env.GEMINI_API_KEY) {
        // Fallback response if GEMINI_API_KEY is not configured
        res.json({
          reply: `Halo! Saya ADMS Assistant. ADMS (Armada Digital Marketing System) menyediakan marketplace produk digital, marketplace multi-merchant, dan platform iklan gratis maupun berbayar.
          
Daftar pertanyaan populer:
1. Cara Pasang Iklan Gratis: Buka menu Iklan > Pasang Iklan Gratis.
2. Menjadi Merchant: Buka menu Merchant > Daftar Toko Baru.
3. Paket Iklan Berbayar: Mulai dari Rp10.000 (Basic), Rp25.000 (Featured), hingga Rp50.000 (VIP Premium).

Ada yang bisa saya bantu lebih lanjut?`,
        });
        return;
      }

      const systemInstruction = `Anda adalah ADMS Assistant, asisten AI resmi yang ramah, profesional, dan berbahasa Indonesia untuk platform "ADMS (Armada Digital Marketing System)".

Informasi Platform ADMS:
- ADMS adalah gabungan Marketplace Produk Digital, Multi-Vendor Merchant, dan Advertising Platform.
- Fitur utama: Belanja produk digital (Template Canva, Ebook, Software, Source Code, AI Prompt, Course), Toko Merchant, Iklan Gratis (Rp0), Iklan Berbayar/Promosi (Basic Rp10k, Featured Rp25k, VIP Premium Rp50k), dan Dashboard terpadu.
- Iklan Gratis: 1 iklan aktif, durasi 7 hari, 2 gambar, moderasi admin.
- Iklan Berbayar: Pilihan boost, featured placement di homepage, pencarian teratas, dan badge khusus.
- Payment Gateway: Mendukung QRIS, Transfer Bank (BCA, Mandiri), E-Wallet, dan Siap terintegrasi dengan Payment Gateway buatan Afifah.
- Setelah pembayaran berhasil, produk digital dapat diunduh langsung secara instan dari halaman 'My Downloads' / Nota Pesanan.

Tugas Anda:
Jawablah pertanyaan pengguna dengan jelas, sopan, ringkas, profesional, dan dalam Bahasa Indonesia. Jika pertanyaan tidak diketahui atau membutuhkan penanganan teknis khusus, berikan informasi fallback untuk menghubungi Customer Support WhatsApp ADMS di +62 812-3456-7890.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Maaf, saya tidak dapat memproses tanggapan saat ini. Silakan hubungi Customer Support ADMS.";

      res.json({ reply: replyText });
    } catch (err) {
      console.error("Gemini Chat API Error:", err);
      res.json({
        reply: "Halo! Saya ADMS Assistant. Terjadi kendala teknis singkat saat menghubungkan ke AI. Kamu dapat menanyakan seputar produk digital, cara beriklan gratis, atau pendaftaran merchant di ADMS. Silakan coba kembali atau hubungi CS kami.",
      });
    }
  });

  // Vite Middleware for Development Mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server ADMS running on http://localhost:${PORT}`);
  });
}

startServer();

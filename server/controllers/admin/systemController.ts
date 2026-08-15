import { Request, Response } from "express";

// In-memory mock states
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

let globalSettings = {
  siteName: 'ADMS Marketplace',
  siteEmail: 'support@adms-network.com',
  platformFeePercent: 5,
  minWithdrawal: 50000,
  maintenanceMode: false,
  midtransClientKey: 'SB-Mid-client-xxxxxxxx',
  midtransServerKey: 'SB-Mid-server-xxxxxxxx'
};

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

// ==========================================
// ADMIN API - MODERATION
// ==========================================

export const getModerationReports = async (req: Request, res: Response): Promise<void> => {
  try {
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
};

export const processModerationReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { action, notes } = req.body;
    res.json({ success: true, action, notes });
  } catch (error) {
    res.status(500).json({ error: "Gagal memproses laporan" });
  }
};

// ==========================================
// ADMIN API - SUPPORT & TICKETING
// ==========================================

export const getSupportTickets = async (req: Request, res: Response): Promise<void> => {
  try {
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
};

export const replySupportTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, markAsResolved } = req.body;
    res.json({ success: true, message, markAsResolved });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengirim balasan" });
  }
};

// ==========================================
// ADMIN API - ANALYTICS & REPORTS
// ==========================================

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
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
};

// ==========================================
// ADMIN API - CONTENT MANAGEMENT SYSTEM
// ==========================================

export const getCmsPages = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(mockPages);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data halaman" });
  }
};

export const updateCmsPage = async (req: Request, res: Response): Promise<void> => {
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
};

// ==========================================
// ADMIN API - SETTINGS
// ==========================================

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(globalSettings);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil pengaturan" });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    globalSettings = { ...globalSettings, ...req.body };
    res.json(globalSettings);
  } catch (error) {
    res.status(500).json({ error: "Gagal menyimpan pengaturan" });
  }
};

// ==========================================
// ADMIN API - NOTIFICATIONS
// ==========================================

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(mockNotifications);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil notifikasi" });
  }
};

export const broadcastNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, message, target } = req.body;
    res.json({ success: true, broadcastedTo: target });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengirim broadcast" });
  }
};

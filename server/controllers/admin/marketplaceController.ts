import { Request, Response } from "express";
import { prisma } from "../../config/db";

// In-memory mock state for promotions
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

// ==========================================
// ADMIN API - MARKETPLACE (PRODUCTS & CATEGORIES)
// ==========================================

export const getProducts = async (req: Request, res: Response): Promise<void> => {
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
};

export const moderateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { status }
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error moderating product:', error);
    res.status(500).json({ error: "Gagal memoderasi produk" });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
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
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
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
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
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
};

// ==========================================
// ADMIN API - ADVERTISING
// ==========================================

export const getAdPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json([
      { id: 'pkg-1', name: 'Homepage Top Banner', price: 500000, durationDays: 7, type: 'BANNER' },
      { id: 'pkg-2', name: 'Sidebar Spotlight', price: 250000, durationDays: 7, type: 'SIDEBAR' },
      { id: 'pkg-3', name: 'Premium Listing', price: 150000, durationDays: 14, type: 'LISTING' },
    ]);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data paket iklan" });
  }
};

export const getActiveAds = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil iklan aktif" });
  }
};

export const getAdRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil pengajuan iklan" });
  }
};

export const moderateAdRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, notes } = req.body;
    res.json({ status, notes });
  } catch (error) {
    res.status(500).json({ error: "Gagal memoderasi iklan" });
  }
};

// ==========================================
// ADMIN API - PROMO
// ==========================================

export const getPromos = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(mockPromos);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data promo" });
  }
};

export const createPromo = async (req: Request, res: Response): Promise<void> => {
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
};

export const updatePromoStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    mockPromos = mockPromos.map(p => p.id === id ? { ...p, isActive } : p);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengubah status promo" });
  }
};

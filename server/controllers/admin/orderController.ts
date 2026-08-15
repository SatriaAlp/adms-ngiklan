import { Request, Response } from "express";
import { prisma } from "../../config/db";

// ==========================================
// ADMIN API - TRANSACTIONS & REFUNDS
// ==========================================

export const getOrders = async (req: Request, res: Response): Promise<void> => {
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
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { customer: true, items: { include: { product: { include: { merchant: true } } } } }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil detail pesanan" });
  }
};

export const getRefunds = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data refund" });
  }
};

export const processRefund = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, notes } = req.body;
    res.json({ status, notes });
  } catch (error) {
    res.status(500).json({ error: "Gagal memproses refund" });
  }
};

// ==========================================
// ADMIN API - FINANCE & WITHDRAWALS
// ==========================================

export const getFinanceOverview = async (req: Request, res: Response): Promise<void> => {
  try {
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
};

export const getFinanceBalances = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil saldo merchant" });
  }
};

export const getWithdrawals = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data penarikan" });
  }
};

export const processWithdrawal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, notes } = req.body;
    res.json({ status, notes });
  } catch (error) {
    res.status(500).json({ error: "Gagal memproses penarikan" });
  }
};

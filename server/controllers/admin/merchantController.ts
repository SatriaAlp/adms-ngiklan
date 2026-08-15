import { Request, Response } from "express";
import { prisma } from "../../config/db";

// ==========================================
// ADMIN API - MERCHANTS MODULE
// ==========================================

export const getMerchants = async (req: Request, res: Response): Promise<void> => {
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
};

export const verifyMerchant = async (req: Request, res: Response): Promise<void> => {
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
};

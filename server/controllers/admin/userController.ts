import { Request, Response } from "express";
import { prisma } from "../../config/db";

// ==========================================
// ADMIN API - USERS MODULE
// ==========================================

export const getUsers = async (req: Request, res: Response): Promise<void> => {
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
};

export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
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
};

// ==========================================
// ADMIN API - SECURITY & AUDIT
// ==========================================

export const getSecurityLogs = async (req: Request, res: Response): Promise<void> => {
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
};

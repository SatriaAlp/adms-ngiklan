import { Request, Response } from "express";

export const downloadProduct = (req: Request, res: Response): void => {
  const { orderId, productId } = req.params;

  if (!orderId || !productId) {
    res.status(400).json({ error: "Invalid order or product request" });
    return;
  }

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

=======================================================`);
};

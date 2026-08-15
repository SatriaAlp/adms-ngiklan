import { Router } from "express";
import {
  getUsers,
  updateUserStatus,
  getSecurityLogs
} from "../controllers/admin/userController";
import {
  getMerchants,
  verifyMerchant
} from "../controllers/admin/merchantController";
import {
  getProducts,
  moderateProduct,
  getCategories,
  createCategory,
  updateCategory,
  getAdPackages,
  getActiveAds,
  getAdRequests,
  moderateAdRequest,
  getPromos,
  createPromo,
  updatePromoStatus
} from "../controllers/admin/marketplaceController";
import {
  getOrders,
  getOrderById,
  getRefunds,
  processRefund,
  getFinanceOverview,
  getFinanceBalances,
  getWithdrawals,
  processWithdrawal
} from "../controllers/admin/orderController";
import {
  getModerationReports,
  processModerationReport,
  getSupportTickets,
  replySupportTicket,
  getAnalytics,
  getCmsPages,
  updateCmsPage,
  getSettings,
  updateSettings,
  getNotifications,
  broadcastNotification
} from "../controllers/admin/systemController";

const router = Router();

// Users Module
router.get("/users", getUsers);
router.put("/users/:id/status", updateUserStatus);

// Merchants Module
router.get("/merchants", getMerchants);
router.put("/merchants/:id/verify", verifyMerchant);

// Marketplace (Products & Categories)
router.get("/products", getProducts);
router.put("/products/:id/moderate", moderateProduct);
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);

// Transactions & Refunds
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.get("/refunds", getRefunds);
router.put("/refunds/:id/process", processRefund);

// Finance & Withdrawals
router.get("/finance/overview", getFinanceOverview);
router.get("/finance/balances", getFinanceBalances);
router.get("/withdrawals", getWithdrawals);
router.put("/withdrawals/:id/process", processWithdrawal);

// Advertising
router.get("/ads/packages", getAdPackages);
router.get("/ads/active", getActiveAds);
router.get("/ads/requests", getAdRequests);
router.put("/ads/requests/:id/moderate", moderateAdRequest);

// Promo
router.get("/promos", getPromos);
router.post("/promos", createPromo);
router.put("/promos/:id/status", updatePromoStatus);

// Moderation
router.get("/moderation/reports", getModerationReports);
router.put("/moderation/reports/:id/process", processModerationReport);

// Support & Ticketing
router.get("/support/tickets", getSupportTickets);
router.post("/support/tickets/:id/reply", replySupportTicket);

// Analytics
router.get("/analytics", getAnalytics);

// Content Management System
router.get("/cms/pages", getCmsPages);
router.put("/cms/pages/:id", updateCmsPage);

// Settings
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

// Notifications
router.get("/notifications/admin", getNotifications);
router.post("/notifications/broadcast", broadcastNotification);

// Security & Audit
router.get("/security/logs", getSecurityLogs);

export default router;

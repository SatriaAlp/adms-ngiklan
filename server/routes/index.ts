import { Router } from "express";
import adminRoutes from "./adminRoutes";
import chatRoutes from "./chatRoutes";
import downloadRoutes from "./downloadRoutes";

const router = Router();

// Health Check Endpoint
router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    platform: "ADMS - Armada Digital Marketing System",
    timestamp: new Date().toISOString(),
  });
});

// Mount modular sub-routers
router.use("/admin", adminRoutes);
router.use("/chat", chatRoutes);
router.use("/download", downloadRoutes);

export default router;

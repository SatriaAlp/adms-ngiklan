import { Router } from "express";
import { downloadProduct } from "../controllers/downloadController";

const router = Router();

router.get("/:orderId/:productId", downloadProduct);

export default router;

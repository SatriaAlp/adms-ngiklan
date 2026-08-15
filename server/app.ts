import "dotenv/config";
import express from "express";
import router from "./routes";

const app = express();

// Global Middlewares
app.use(express.json());

// Mount Unified API Router under /api prefix
app.use("/api", router);

export { app };

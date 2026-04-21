import express from "express";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { stockRoutes } from "./modules/stock/stock.routes.js";
import { shareRoutes } from "./modules/share/share.routes.js";

const app = express();

app.use("/v1/auth", authRoutes);
app.use("/v1/admin", adminRoutes);
app.use("/v1/stock", stockRoutes);
app.use("/v1/share", shareRoutes);

export default app;

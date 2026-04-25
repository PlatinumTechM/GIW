import express from "express";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { stockRoutes } from "./modules/stock/stock.routes.js";
import { jewellryRoutes } from "./modules/stock/jewellry/jewellry.routes.js";
import { shareRoutes } from "./modules/share/share.routes.js";
import shareApiRoutes from "./modules/share/share-api/share-api.routes.js";

const app = express();

app.use("/v1/auth", authRoutes);
app.use("/v1/admin", adminRoutes);
app.use("/v1/stock", stockRoutes);
app.use("/v1/jewellry-stock", jewellryRoutes);
app.use("/v1/share", shareRoutes);
app.use("/v1/share-api", shareApiRoutes);

export default app;

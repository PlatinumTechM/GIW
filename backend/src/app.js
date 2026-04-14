import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import routes from "./routes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const corsOptions = {
  origin: [process.env.CLIENT_URL || "http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    data: null,
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
});

export default app;

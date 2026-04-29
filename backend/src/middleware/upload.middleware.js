import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getStorage = (subfolder = "documents") => {
  const uploadDir = path.join(process.cwd(), "uploads", subfolder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const originalName = path.basename(file.originalname, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .substring(0, 50);
      const uniqueId = Math.round(Math.random() * 9999);
      cb(null, `${originalName}-${uniqueId}${ext}`);
    },
  });
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, JPEG, and PNG files are allowed"), false);
  }
};

const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB
};

export const upload = multer({
  storage: getStorage("documents"),
  fileFilter,
  limits,
});

export const notificationUpload = multer({
  storage: getStorage("Notification"),
  fileFilter,
  limits,
});

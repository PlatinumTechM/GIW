import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const authenticate = async (req, res, next) => {
  try {
    const cookieToken = req.cookies.token;
    const headerToken = req.headers.authorization?.split(" ")[1];
    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // Check if user is still active in database
    const userResult = await pool.query(
      "SELECT id, is_active, role FROM users WHERE id = $1",
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = userResult.rows[0];
    if (!user.is_active) {
      // Clear cookie if present
      res.clearCookie("token");
      return res.status(401).json({
        error: "Account deactivated",
        code: "USER_DEACTIVATED",
        message: "Your account has been deactivated by an administrator."
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

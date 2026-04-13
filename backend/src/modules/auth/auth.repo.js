import { pool } from "../../config/db.js";

export class AuthRepository {
  async findUserByEmail(email) {
    const query = "SELECT id, email, password FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  async createUser(userData) {
    const { email, password } = userData;
    const query =
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email";
    const result = await pool.query(query, [email, password]);
    return result.rows[0];
  }
}

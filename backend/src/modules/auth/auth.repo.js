import { pool } from "../../config/db.js";

export class AuthRepository {
  async findUserByEmail(email) {
    const query = `SELECT id, name, email, company, phone, address, 
                   gst, password, document, is_active, role, created_at 
                   FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  async findUserById(id) {
    const query = `SELECT id, name, email, company, phone, address, 
                   gst, document, is_active, role, created_at 
                   FROM users WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async createUser(userData) {
    const {
      name,
      email,
      company,
      phone,
      address,
      gst,
      password,
      document,
    } = userData;

    const query = `INSERT INTO users 
      (name, email, company, phone, address, gst, password, document) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id, name, email, company, phone, address, gst, document, created_at`;

    const result = await pool.query(query, [
      name,
      email,
      company,
      phone,
      address,
      gst,
      password,
      document || null,
    ]);
    return result.rows[0];
  }
}

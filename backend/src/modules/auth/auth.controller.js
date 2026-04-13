import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
        expires: new Date(Date.now() + 60 * 60 * 1000),
        path: "/",
      });

      res.status(200).json({ user: result.user });
    } catch (error) {
      console.error("Error at login = ", error);
      res.status(401).json({ error: error.message });
    }
  }

  async register(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.register(email, password);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

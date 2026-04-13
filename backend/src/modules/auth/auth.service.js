import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repo.js";

const authRepo = new AuthRepository();

export class AuthService {
  async login(email, password) {
    const user = await authRepo.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    if (String(password) !== String(user.password)) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      },
    );

    return { token, user: { id: user.id, email: user.email } };
  }

  async register(email, password) {
    const existingUser = await authRepo.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = await authRepo.createUser({
      email,
      password,
    });

    return newUser;
  }
}

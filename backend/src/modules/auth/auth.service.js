import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repo.js";

const authRepo = new AuthRepository();

export class AuthService {
  async login(email, password) {
    const user = await authRepo.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    
    const cleanInput = String(password).trim();
    const cleanDB = String(user.password).trim();
    
    console.log("Login attempt for:", email);
    console.log("Input password:", cleanInput);
    console.log("DB password:", cleanDB);
    console.log("Match:", cleanInput === cleanDB);
    
    if (cleanInput !== cleanDB) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      },
    );

    return { 
      token, 
      user: { 
        id: user.id, 
        name: user.name,
        email: user.email,
        company: user.company,
        phone: user.phone,
        address: user.address,
        gst: user.gst
      } 
    };
  }

  async register(userData) {
    const { name, email, company, phone, address, gst, password, confirmPassword, document } = userData;
    
    // Validation
    if (!name || !email || !company || !phone || !address || !gst || !password) {
      throw new Error("All fields are required");
    }
    
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    
    const existingUser = await authRepo.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const newUser = await authRepo.createUser({
      name,
      email,
      company,
      phone,
      address,
      gst,
      password,
      document
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      company: newUser.company,
      phone: newUser.phone,
      address: newUser.address,
      gst: newUser.gst,
      document: newUser.document,
      createdAt: newUser.created_at
    };
  }
}

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
export class TokenController {
  async createToken(req: Request, res: Response): Promise<void> {
    const secretKey = "YOUR_SECRET_KEY"; // La tua chiave segreta
    const payload = {
      userId: 2, // User ID
      username: "Prova", // Nome utente
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" }); // Genera un token con scadenza di 1 ora
    console.log("Generated Token:", token);
    res.json(token);
  }
}

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
export class TokenController {
  async createToken(req: Request, res: Response): Promise<void> {
    const secretKey = "YOUR_SECRET_KEY"; // La tua chiave segreta

    const token = jwt.sign(req.body, secretKey, { expiresIn: "1h" }); // Genera un token con scadenza di 1 ora
    res.json(token);
  }
}

// src/middleware/authMiddleware.ts
import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";

// Chiave segreta per la verifica del token
const secretKey = "YOUR_SECRET_KEY"; // Cambia con la tua chiave segreta

interface JwtPayload {
  userId: number;
  username: string;
}

export const authMiddleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): void => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Token non fornito" }));
    return;
  }

  try {
    // Verifica e decodifica il token JWT
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    (req as any).user = decoded; // Salva l'utente decodificato nella richiesta
    next(); // Passa al prossimo middleware
  } catch (error) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Token non valido o scaduto" }));
  }
};

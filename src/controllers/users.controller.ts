import { Request, Response } from "express";
import { UserService } from "../services/users.service";
import { ProjectService } from "../services/project.service";
import { User } from "../entity/user.entity";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const secretKey = "YOUR_SECRET_KEY"; // Your secret key
      const { username, password } = req.body; // Password sent by client

      const user = await this.userService.getUsernamePassword(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const payload = { userId: user.id, username: user.username };
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      return res.json({ token });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { search } = req.query; // Recupera il parametro di query "search"

      // Passa il parametro "search" al servizio per filtrare i risultati
      const users = await this.userService.getAllUsers(search as string);

      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const user = await this.userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ message: "Utente non trovato" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user: User = req.body as User;
      const createdUser = await this.userService.createUser(user);
      res.status(201).json(createdUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async getUserDetail(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ message: "Utente non trovato" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}

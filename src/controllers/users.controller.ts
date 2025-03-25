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

      // Get user from DB
      const user = await this.userService.getUsernamePassword(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // If password is correct, generate JWT
      const payload = { userId: user.id, username: user.username };
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      // Send the token to the user
      return res.json({ token });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
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

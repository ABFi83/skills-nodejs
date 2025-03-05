import { Request, Response } from "express";
import { UserService } from "../services/users.service";
import { UserDao } from "../dao/user.dao";
import { User } from "../models/user.model";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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

  // Aggiungi altri metodi del controller
}

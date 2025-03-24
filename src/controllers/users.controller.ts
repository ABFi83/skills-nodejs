import { Request, Response } from "express";
import { UserService } from "../services/users.service";
import { ProjectService } from "../services/project.service";
import { User } from "../entity/user.entity";

export class UserController {
  private userService: UserService;
  private projectService: ProjectService;
  constructor() {
    this.userService = new UserService();
    this.projectService = new ProjectService();
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

  async getUserProjects(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      console.log("userId", userId);
      const project = await this.projectService.getProjectsByUser(userId);
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Aggiungi altri metodi del controller
}

import { InitService } from "./../services/init.service";
import { Request, Response } from "express";
import { User } from "../entity/user.entity";
import { UserService } from "../services/users.service";

export class InitController {
  private userService: UserService;
  private initService: InitService;

  constructor() {
    this.userService = new UserService();
    this.initService = new InitService();
  }

  async init(req: Request, res: Response): Promise<void> {
    const user: User = req.body as User;
    const createdUser = await this.userService.createUser(user);
    let number = await this.initService.createProject();
    res.status(200).json(number);
  }
}

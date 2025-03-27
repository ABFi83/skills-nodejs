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
    const user1: User = {
      name: "zoro",
      surname: "zoro",
      username: "zoro",
      password: "zoro",
      code: "ZRO",
      id: 1,
    };
    await this.userService.createUser(user1);
    const user2: User = {
      name: "sanji",
      surname: "sanji",
      username: "sanji",
      password: "sanji",
      code: "SNJ",
      id: 2,
    };
    await this.userService.createUser(user2);
    let number = await this.initService.createProject();
    res.status(200).json(number);
  }
}

import { InitService } from "./../services/init.service";
import { Request, Response } from "express";
import { User } from "../entity/user.entity";
import { UserService } from "../services/users.service";
import { Repository } from "typeorm";
import { Role } from "../entity/role.entity";
import { AppDataSource } from "../database/database";

export class InitController {
  private userService: UserService;
  private initService: InitService;
  private roleRepository: Repository<Role>;
  constructor() {
    this.userService = new UserService();
    this.initService = new InitService();
    this.roleRepository = AppDataSource.getRepository(Role);
  }

  async init(req: Request, res: Response): Promise<void> {
    let role = await this.roleRepository.findOne({
      where: { name: "Team Leader" },
    });

    const user1: User = {
      name: "zoro",
      surname: "zoro",
      username: "zoro",
      password: "zoro",
      code: "ZRO",
      id: 1,
      isAdmin: false,
    };
    await this.userService.createUser(user1);
    const user2: User = {
      name: "sanji",
      surname: "sanji",
      username: "sanji",
      password: "sanji",
      code: "SNJ",
      id: 2,
      isAdmin: false,
    };
    await this.userService.createUser(user2);

    const user3: User = {
      name: "nami",
      surname: "nami",
      username: "nami",
      password: "nami",
      code: "NMI",
      id: 3,
      isAdmin: true,
    };
    await this.userService.createUser(user3);
    let number = await this.initService.createProject();

    res.status(200).json(number);
  }
}

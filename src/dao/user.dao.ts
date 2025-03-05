// src/dao/userDao.ts
import { AppDataSource } from "../database/database";
import { User } from "../entity/user.entity";

export class UserDao {
  private userRepository;
  constructor() {
    this.userRepository = AppDataSource.getRepository(User); // o prisma.user
  }
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  // Altri metodi DAO...
}

import { UserDao } from "./../dao/user.dao";
// src/services/items.service.ts
import { User } from "../models/user.model";

export class UserService {
  private userDao: UserDao;

  constructor(userDao: UserDao) {
    this.userDao = userDao;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userDao.getAllUsers();
  }

  async createUser(user: User): Promise<User> {
    return this.userDao.createUser(user);
  }

  // Aggiungi altri metodi del servizio
}

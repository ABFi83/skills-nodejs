import { UserDao } from "./../dao/user.dao";
// src/services/items.service.ts
import { User } from "../models/user.model";

export class UserService {
  private userDao: UserDao;

  constructor() {
    this.userDao = new UserDao();
  }

  async getAllUsers(): Promise<User[]> {
    console.log("ciao");
    return this.userDao.getAllUsers();
  }

  async createUser(user: User): Promise<User> {
    return this.userDao.createUser(user);
  }

  // Aggiungi altri metodi del servizio
}

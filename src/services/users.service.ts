// src/services/items.service.ts
import { User } from "../models/user.model";
import * as UsersRepository from "../repositories/users.repository";

export const getUsers = (): Promise<User> => {
  return UsersRepository.getUsers();
};

export const createUser = (user: User): Promise<number> => {
  return UsersRepository.createUser(user);
};

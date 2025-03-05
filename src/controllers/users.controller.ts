// src/controllers/items.controller.ts
import { Request, Response } from "express";
import * as UsersService from "../services/users.service";

export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await UsersService.getUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const id = await UsersService.createUser(req.body);
    res.json({ id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

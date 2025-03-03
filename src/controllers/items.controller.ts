// src/controllers/items.controller.ts
import { Request, Response } from "express";
import * as ItemsService from "../services/items.service";

export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await ItemsService.getItems();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const id = await ItemsService.createItem(req.body);
    res.json({ id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// src/services/items.service.ts
import * as ItemsRepository from "../repositories/items.repository";
import { Item } from "../models/item.model";

export const getItems = (): Promise<Item> => {
  return ItemsRepository.getItems();
};

export const createItem = (item: Item): Promise<number> => {
  return ItemsRepository.createItem(item);
};

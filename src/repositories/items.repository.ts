// src/repositories/items.repository.ts
import { getDb } from "../database/database";
import { Item } from "../models/item.model";

export const getItems = (): Promise<Item> => {
  // Restituisci Promise<Item>
  return new Promise((resolve, reject) => {
    getDb().then((db) => {
      db.all("SELECT * FROM items", (err: any, rows: Item) => {
        // Tipo corretto per rows
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });
};
export const createItem = (item: Item): Promise<number> => {
  return new Promise((resolve, reject) => {
    getDb().then((db) => {
      db.run(
        "INSERT INTO items (name) VALUES (?)",
        [item.name],
        function (this: { lastID: number }, err: any) {
          // Specifica il tipo di 'this'
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  });
};

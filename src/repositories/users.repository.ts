// src/repositories/items.repository.ts
import { getDb } from "../database/database";
import { User } from "../models/user.model";

export const getUsers = (): Promise<User> => {
  // Restituisci Promise<Item>
  return new Promise((resolve, reject) => {
    getDb().then((db) => {
      db.all("SELECT * FROM users", (err: any, rows: User) => {
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
export const createUser = (user: User): Promise<number> => {
  return new Promise((resolve, reject) => {
    getDb().then((db) => {
      console.log(user);
      db.run(
        "INSERT INTO users (name,surname,username) VALUES (?,?,?)",
        [user.name, user.surname, user.username],
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

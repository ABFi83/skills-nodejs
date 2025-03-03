// src/database/database.ts
import sqlite3 from "sqlite3";

let db: sqlite3.Database;

export const getDb = (): Promise<sqlite3.Database> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }
    db = new sqlite3.Database("./mydb.db", (err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log("Connected to the mydb database.");
      resolve(db);
    });
  });
};

export const initDb = async () => {
  const database = await getDb();
  return new Promise<void>((resolve, reject) => {
    database.run(
      "CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)",
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

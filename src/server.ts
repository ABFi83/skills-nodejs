import express from "express";
import * as ItemsController from "./controllers/items.controller";
import * as UsersController from "./controllers/users.controller";
import { getDb, initDb } from "./database/database";

const app = express();
const port = 3001;

app.use(express.json());

app.get("/items", ItemsController.getItems);
app.post("/items", ItemsController.createItem);
app.get("/users", UsersController.getUser);
app.post("/users", UsersController.createUser);
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

initDb();

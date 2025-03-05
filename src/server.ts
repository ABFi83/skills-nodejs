import express, { Application } from "express";
import bodyParser from "body-parser";
import { UserController } from "./controllers/users.controller";

const app: Application = express();
app.use(bodyParser.json());

const userController = new UserController();

app.get("/users", (req, res) => userController.getAllUsers(req, res));
app.post("/users", (req, res) => userController.createUser(req, res));

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

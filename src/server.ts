import express, { Application } from "express";
import bodyParser from "body-parser";
import { UserController } from "./controllers/users.controller";
import { ProjectController } from "./controllers/projects.controller";

const app: Application = express();
app.use(bodyParser.json());

const userController = new UserController();
const projectController = new ProjectController();
app.get("/users", (req, res) => userController.getAllUsers(req, res));
app.post("/users", (req, res) => userController.createUser(req, res));

app.get("/users", (req, res) => userController.getAllUsers(req, res));

// Crea un nuovo utente
app.post("/users", (req, res) => userController.createUser(req, res));

// Ottieni il dettaglio di un utente per ID
app.get("/users/:id", (req, res) => userController.getUserDetail(req, res));

// Ottieni i progetti di un utente
app.get("/users/:id/projects", (req, res) =>
  userController.getUserProjects(req, res)
);

app.post("/project", (req, res) => projectController.createProject(req, res));

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

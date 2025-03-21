import express, { Application } from "express";
import bodyParser from "body-parser";
import { UserController } from "./controllers/users.controller";
import { ProjectController } from "./controllers/projects.controller";
import { SkillController } from "./controllers/skills.controller";
import { Evaluation } from "./entity/evaluation.entity";
import { EvaluationController } from "./controllers/evaluations.controller";

const app: Application = express();
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

const userController = new UserController();
const skillsController = new SkillController();
const evaluationController = new EvaluationController();
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
app.delete("/project/:id", (req, res) =>
  projectController.deleteProject(req, res)
);
app.get("/project/:id", (req, res) =>
  projectController.getProjectsDetails(req, res)
);

app.get("/skills", (req, res) => skillsController.getAllSkills(req, res));
app.get("/evaluation", (req, res) =>
  evaluationController.getAllEvaluations(req, res)
);
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import express, { Application } from "express";
import bodyParser from "body-parser";
import { UserController } from "./controllers/users.controller";
import { ProjectController } from "./controllers/projects.controller";
import { SkillController } from "./controllers/skills.controller";
import { EvaluationController } from "./controllers/evaluations.controller";
import { authMiddleware } from "./middleware/authMiddleware"; // Importa il middleware
import { TokenController } from "./controllers/token.controller";
import { InitController } from "./controllers/init.controller";

import { ClientController } from "./controllers/client.controller";

const app: Application = express();
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

const path = require("path");
const userController = new UserController();
const skillsController = new SkillController();
const tokenController = new TokenController();
const initController = new InitController();
const evaluationController = new EvaluationController();
const projectController = new ProjectController();
const clientController = new ClientController();

// Aggiungi il middleware di autenticazione su rotte che richiedono l'autenticazione
app.get("/users", authMiddleware, (req, res) =>
  userController.getAllUsers(req, res)
);

app.get("/user", authMiddleware, (req, res) =>
  userController.getUser(req, res)
);
app.post("/users", (req, res) => userController.createUser(req, res));

app.post("/users/login", async (req, res) => {
  try {
    await userController.login(req, res); // Ensure async handling of the route
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users/:id", authMiddleware, (req, res) =>
  userController.getUserDetail(req, res)
);

app.get("/projects", authMiddleware, (req, res) =>
  projectController.getUserProjects(req, res)
);

app.get("/projects/all", authMiddleware, (req, res) =>
  projectController.getAllProject(req, res)
);

app.post("/projects", authMiddleware, (req, res) =>
  projectController.createProject(req, res)
);
app.delete("/projects/:id", authMiddleware, (req, res) =>
  projectController.deleteProject(req, res)
);
app.get("/projects/:id", authMiddleware, (req, res) =>
  projectController.getProjectsDetails(req, res)
);
app.post("/projects/:id/evaluation", authMiddleware, (req, res) =>
  projectController.createEvaluation(req, res)
);
app.put("/projects/:id/values", authMiddleware, (req, res) =>
  projectController.saveValue(req, res)
);

app.get("/skills", (req, res) => skillsController.getAllSkills(req, res));

app.get("/evaluation", (req, res) =>
  evaluationController.getAllEvaluations(req, res)
);

app.post("/token", (req, res) => tokenController.createToken(req, res));
app.post("/init", (req, res) => initController.init(req, res));
app.get("/client", (req, res) => clientController.getAllClients(req, res));

app.get("/logo/:clientId", (req, res) => {
  const { clientId } = req.params;
  const imagePath = path.join(__dirname, "images", `${clientId}.jpg`);

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).json({ error: "Logo non trovato" });
    }
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

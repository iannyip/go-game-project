import { resolve } from "path";
import db from "./models/index.mjs";

import initUsersController from "./controllers/usersController.mjs";
import initGamesController from "./controllers/gamesController.mjs";

export default function bindRoutes(app) {
  const UserController = initUsersController(db);
  const GameController = initGamesController(db);

  // special JS page. Include the webpack index.html file
  app.get("/home", (request, response) => {
    // response.sendFile(resolve('dist', 'main.html'));
    console.log("yay");
    response.send("yay");
  });

  app.get("/", UserController.root);
  app.post("/login", UserController.login);
  app.get("/users", UserController.index);
  app.get("/dashboard", UserController.gameindex);
  app.get("/stats", UserController.stats);

  // app.get("/users/:id/wins", UserController.wins);

  app.post("/newGame", GameController.create);
  app.get("/testGame", GameController.test);
  app.get("/testGame2", GameController.test2);
  app.post("/placepiece", GameController.update);
  app.get("/game/:id", GameController.show);
}

import "./styles.scss";
import axios from "axios";
import go from "go-game";
import { authUserLogin, renderLoginElements } from "./loginModule.js";
import {
  getGame,
  newGameClick,
  NewGameModal,
  renderUserDashboardElement,
} from "./dashboardModule.js";
import {
  updateGame,
  passGame,
  buildBoard,
  renderGameContainer,
} from "./gameModule.js";

// Declare game state elements
let currentGame = null;

// Get Main Container Element
const mainContainer = document.getElementById("mainContainer");
mainContainer.classList.add("container");

// GAME CALLBACKS
const placePiece = (i, j) => {
  const newCoord = {
    row: i,
    col: j,
    gameId: currentGame.id,
  };
  updateGame(newCoord)
    .then((result) => {
      currentGame = result.data;
      renderGameView();
    })
    .catch((error) => console.log(error));
};

const passCB = () => {
  const gameObj = {
    gameId: currentGame.id,
  };
  passGame(gameObj)
    .then((result) => {
      currentGame = result.data;
      renderGameView();
    })
    .catch((error) => console.log(error));
};

const runGame = (arr) => {
  const boardContainer = document.getElementById("boardContainer");
  boardContainer.innerHTML = "";
  const replayBoard = buildBoard(arr, placePiece, "replay");
  boardContainer.append(replayBoard);
};

const renderGameView = () => {
  console.log("Rendering board. Checking currentGame: ");
  console.log(currentGame);
  mainContainer.innerHTML = "";

  // Append main game container (gameViewContainer)
  const gameViewContainer = renderGameContainer(
    currentGame,
    makeDashboard,
    currentGameCallback,
    passCB,
    runGame
  );
  mainContainer.appendChild(gameViewContainer);

  // Build board and append to boardContainer
  const newGoObj = new go(JSON.stringify(currentGame.game));
  const builtBoard = buildBoard(newGoObj.field, placePiece, currentGame.status);
  const boardContainer = document.getElementById("boardContainer");
  boardContainer.append(builtBoard);
};

// DASHBOARD CALLBACKS
const newGameCallback = () => {
  const newGameInfo = {
    opponent: document.getElementById("opponentInput").value,
    board: document.getElementById("boardSizeInput").value,
  };
  newGameClick(newGameInfo)
    .then((result) => {
      // Update currentGame and render game view
      currentGame = result.data;
      renderGameView();
    })
    .catch((error) => console.log(error));
};

const currentGameCallback = (gameId) => {
  getGame(gameId)
    .then((result) => {
      // Update currentGame and render game view
      currentGame = result.data;
      renderGameView();
    })
    .catch((error) => console.log(error));
};

const refreshDashboardCB = () => {
  makeDashboard();
};

const makeDashboard = () => {
  mainContainer.innerHTML = "";
  const dashboardElement = renderUserDashboardElement(
    currentGameCallback,
    refreshDashboardCB
  );
  const modalElement = NewGameModal(newGameCallback);
  document.body.appendChild(dashboardElement);
  document.body.appendChild(modalElement);
};

// LOGIN CALLBACK
const loginClickCallback = () => {
  const name = document.getElementById("Username").value;
  const password = document.getElementById("Password").value;
  authUserLogin(name, password)
    .then((result) => {
      if (result.data === "valid user") {
        makeDashboard();
      } else {
        // renderLoginView();
        // TO DO
      }
    })
    .catch((error) => console.log(error));
};

const main = () => {
  // Create the login view
  const loginContainer = renderLoginElements(loginClickCallback);
  mainContainer.innerHTML = "";
  mainContainer.appendChild(loginContainer);
};

main();

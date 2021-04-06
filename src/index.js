import './styles.scss';
import axios from 'axios';
import go from 'go-game';
import { authUserLogin, renderLoginElements } from './loginModule.js';
import {
  getGame,
  newGameClick, NewGameModal, renderUserDashboardElement,
} from './dashboardModule.js';
import { updateGame, buildBoard, renderGameContainer } from './gameModule.js';

// const loginModule = loginModules();
let currentGame = null;

// Get Main Container Element
const mainContainer = document.getElementById('mainContainer');
mainContainer.classList.add('container');

// GAME CALLBACKS
const placePiece = (i, j) => {
  console.log(`coordinates: ${i}, ${j}`);
  console.log(`current game id: ${currentGame.id}`);
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

const renderGameView = () => {
  mainContainer.innerHTML = '';
  const gameViewContainer = renderGameContainer(currentGame, makeDashboard, currentGameCallback);
  mainContainer.appendChild(gameViewContainer);
  const newGoObj = new go(JSON.stringify(currentGame.game));
  const builtBoard = buildBoard(newGoObj.field, placePiece);
  const boardContainer = document.getElementById('boardContainer');
  boardContainer.append(builtBoard);
};

// DASHBOARD CALLBACKS
const newGameCallback = () => {
  const newGameInfo = {
    opponent: document.getElementById('opponentInput').value,
    board: document.getElementById('boardSizeInput').value,
  };
  console.log(newGameInfo);
  newGameClick(newGameInfo)
    .then((result) => {
      console.log('new game posted successfully');
      // Update currentGame and render game view
      currentGame = result.data;
      renderGameView();
    })
    .catch((error) => console.log(error));
};

const currentGameCallback = (gameId) => {
  getGame(gameId)
    .then((result) => {
      console.log('retrieving game... ', result.data);
      // Update currentGame and render game view
      currentGame = result.data;
      renderGameView();
      // renderGameView();
    })
    .catch((error) => console.log(error));
};

const makeDashboard = () => {
  mainContainer.innerHTML = '';
  const dashboardElement = renderUserDashboardElement(currentGameCallback);
  const modalElement = NewGameModal(newGameCallback);
  document.body.appendChild(dashboardElement);
  document.body.appendChild(modalElement);
};

// LOGIN CALLBACK
const loginClickCallback = () => {
  const name = document.getElementById('Username').value;
  const password = document.getElementById('Password').value;
  authUserLogin(name, password)
    .then((result) => {
      console.log(result.data);
      if (result.data === 'valid user') {
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
  mainContainer.innerHTML = '';
  mainContainer.appendChild(loginContainer);
};

main();

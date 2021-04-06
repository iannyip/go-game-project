import './styles.scss';
import axios from 'axios';
import go from 'go-game';
import { authUserLogin, renderLoginElements } from './loginModule.js';
import {
  getGame,
  newGameClick, NewGameModal, renderUserDashboardElement,
} from './dashboardModule.js';

// const loginModule = loginModules();
let currentGame = null;

// Get Main Container Element
const mainContainer = document.getElementById('mainContainer');
mainContainer.classList.add('container');

// Game View Elements
const gameViewContainer = document.createElement('div');
const boardContainer = document.createElement('div');
const gameInfoContainer = document.createElement('div');
const backToDashboardBtn = document.createElement('button');
const refreshGameBtn = document.createElement('button');

// GAME PLAY FUNCTIONS
const placePiece = (i, j) => {
  console.log(`coordinates: ${i}, ${j}`);
  console.log(`current game id: ${currentGame.id}`);
  const newCoord = {
    row: i,
    col: j,
    gameId: currentGame.id,
  };
  axios
    .post('/placepiece', newCoord)
    .then((result) => {
      console.log('piece placed successfully');
      currentGame = result.data;
      console.log(currentGame.game);
      const newGoObj = new go(JSON.stringify(currentGame.game));
      console.log('#######################');
      console.log(newGoObj.printField());
      renderBoard(newGoObj.field);
    })
    .catch((error) => {
      console.log(error);
    });
};

const renderBoard = (boardArr) => {
  boardContainer.innerHTML = '';
  const boardGrid = document.createElement('div');
  boardGrid.classList.add('grid-display');
  const boardLen = boardArr.length;
  console.log(boardLen);
  for (let i = 0; i < boardLen; i += 1) {
    for (let j = 0; j < boardLen; j += 1) {
      const box = document.createElement('div');
      const piece = document.createElement('div');
      boardGrid.appendChild(box);
      box.addEventListener('click', () => {
        placePiece(i, j);
      });
      box.classList.add('cell');
      piece.classList.add('piece');
      if (i === 0) {
        box.classList.add('v-b');
      } else if (i === boardLen - 1) {
        box.classList.add('v-t');
      } else {
        box.classList.add('v-f');
      }
      if (j === 0) {
        box.classList.add('h-r');
      } else if (j === boardLen - 1) {
        box.classList.add('h-l');
      } else {
        box.classList.add('h-f');
      }
      if (boardArr[i][j] === 1) {
        piece.innerText = '⚫';
        box.appendChild(piece);
      } else if (boardArr[i][j] === 0) {
        piece.innerText = '⚪';
        box.appendChild(piece);
      }
    }
  }
  boardContainer.appendChild(boardGrid);
};

const renderGameView = () => {
  // 1. Clear the screen
  mainContainer.innerHTML = '';
  const dashboardElement = document.getElementById('dashboardContainer');
  dashboardElement.remove();

  // 2. Get the game object from variable <currentGame>
  console.log(currentGame.game);
  const newGoObj = new go(JSON.stringify(currentGame.game));
  console.log('#######################');
  console.log(newGoObj.printField());
  renderBoard(newGoObj.field);

  // 3. Make the page view outline
  gameViewContainer.classList.add('row');
  [boardContainer, gameInfoContainer].forEach((element) => {
    element.classList.add('col');
    gameViewContainer.appendChild(element);
  });
  [backToDashboardBtn, refreshGameBtn].forEach((button) => {
    button.classList.add('btn', 'btn-primary');
  });
  refreshGameBtn.innerText = 'Refresh Game';
  backToDashboardBtn.innerText = 'Back to Home';
  // 4. Add the buttons
  backToDashboardBtn.addEventListener('click', () => {
    makeDashboard();
  });
  refreshGameBtn.addEventListener('click', () => {
    renderGameView();
  });

  gameInfoContainer.appendChild(backToDashboardBtn);
  gameInfoContainer.appendChild(refreshGameBtn);
  mainContainer.appendChild(gameViewContainer);
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
    });
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

// loginModule.renderLoginView();

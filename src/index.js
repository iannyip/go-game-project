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

// DASHBOARD FUNCTIONS
// const newGameClick = () => {
//   const newGameInfo = {
//     opponent: document.getElementById('opponentInput').value,
//     board: document.getElementById('boardSizeInput').value,
//   };
//   console.log(newGameInfo);
//   axios
//     .post('/newGame', newGameInfo)
//     .then((result) => {
//       console.log('new game posted successfully');
//       currentGame = result.data;
//       renderGameView();

//       // const modalToClose = document.getElementById("newGameModal");
//       // modalToClose.remove();
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// const NewGameModal = () => {
//   const previousModal = document.getElementById('newGameModal');
//   if (previousModal) {
//     console.log('previous modal found!');
//     document.body.removeChild(previousModal);
//   }

//   const modalDiv = document.createElement('div');
//   const modalDialogDiv = document.createElement('div');
//   const modalContentDiv = document.createElement('div');
//   const modalHeaderDiv = document.createElement('div');
//   const modalBodyDiv = document.createElement('div');
//   const modalFooterDiv = document.createElement('div');
//   const words = document.createElement('label');
//   const boardSelectText = document.createElement('label');
//   const modalCloseBtn = document.createElement('button');
//   const modalSubmit = document.createElement('button');
//   const opponentInput = document.createElement('input');
//   const boardSizeInput = document.createElement('select');
//   const userDataList = document.createElement('datalist');
//   // MODIFY BOARDSIZEINPUT VARIABLE TO ALLOW USER TO SET BOARD SIZE
//   // const boardSelect = document.createElement("select");
//   const boardSize = [5, 9, 13, 17, 19, 21];

//   boardSize.forEach((board) => {
//     const element = document.createElement('option');
//     element.value = board;
//     element.innerText = `${board} x ${board}`;
//     boardSizeInput.appendChild(element);
//   });

//   words.innerText = 'Choose your opponent';
//   boardSelectText.innerText = 'Select your board size';
//   modalSubmit.innerText = 'Create Game!';

//   modalDiv.setAttribute('tabindex', '-1');
//   modalDiv.id = 'newGameModal';
//   modalDiv.classList.add('modal', 'fade');
//   modalDialogDiv.classList.add('modal-dialog');
//   modalContentDiv.classList.add('modal-content');
//   modalHeaderDiv.classList.add('modal-header');
//   modalBodyDiv.classList.add('modal-body');
//   modalFooterDiv.classList.add('modal-footer');
//   modalCloseBtn.classList.add('btn-close');
//   modalCloseBtn.setAttribute('data-bs-dismiss', 'modal');
//   modalSubmit.classList.add('btn', 'btn-primary');
//   words.classList.add('form-label');
//   boardSelectText.classList.add('form-label');
//   opponentInput.classList.add('form-control');
//   // boardSizeInput.classList.add("form-control");
//   boardSizeInput.classList.add('form-select');
//   opponentInput.setAttribute('list', 'dataListOptions');
//   userDataList.id = 'dataListOptions';
//   opponentInput.id = 'opponentInput';
//   boardSizeInput.id = 'boardSizeInput';

//   axios
//     .get('/users')
//     .then((result) => {
//       console.log(result.data);
//       const usersArr = result.data;
//       usersArr.forEach((user) => {
//         const optionEle = document.createElement('option');
//         // optionEle.value = user.id;
//         optionEle.value = user.name;
//         userDataList.appendChild(optionEle);
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//     });

//   modalSubmit.addEventListener('click', newGameClick);

//   modalDiv.appendChild(modalDialogDiv);
//   modalDialogDiv.appendChild(modalContentDiv);
//   modalContentDiv.appendChild(modalHeaderDiv);
//   modalContentDiv.appendChild(modalBodyDiv);
//   modalContentDiv.appendChild(modalFooterDiv);
//   modalHeaderDiv.appendChild(modalCloseBtn);
//   modalFooterDiv.appendChild(modalSubmit);
//   modalBodyDiv.appendChild(words);
//   modalBodyDiv.appendChild(opponentInput);
//   modalBodyDiv.appendChild(userDataList);
//   modalBodyDiv.appendChild(boardSelectText);
//   modalBodyDiv.appendChild(boardSizeInput);
//   document.body.appendChild(modalDiv);
// };

// const openCurrentGame = (gameId) => {
//   axios
//     .get(`/game/${gameId}`)
//     .then((result) => {
//       console.log('retrieving game... ', result.data);
//       currentGame = result.data;
//       renderGameView();
//       // return result.data;
//     })
//     .catch((error) => console.log(error));
// };

// const renderUserDashboard = () => {
//   // 1. Clear the view
//   mainContainer.innerHTML = '';
//   dashboardContainer.innerHTML = '';
//   sidebarList.innerHTML = '';
//   // gameTable.innerHTML = "";
//   gameTableBody.innerHTML = '';

//   // 2. Add newGameBtn
//   newGameBtn.classList.add('btn', 'btn-primary');
//   newGameBtn.innerText = 'Create new game';

//   // 3. Create modal (to create new game) and assign to newGameBtn
//   newGameBtn.setAttribute('data-bs-toggle', 'modal');
//   newGameBtn.setAttribute('data-bs-target', '#newGameModal');
//   NewGameModal();
//   // mainContainer.appendChild(newGameBtn);
//   rightContent.appendChild(newGameBtn);

//   // 4. Get the list of all ongoing games
//   gameTable.classList.add('table');
//   gameTable.appendChild(gameTableHead);
//   gameTable.appendChild(gameTableBody);
//   rightContent.appendChild(gameTable);
//   axios
//     .get('/dashboard')
//     .then((result) => {
//       const userInfo = result.data;
//       console.log(userInfo);
//       userInfo.games.forEach((usergame) => {
//         console.log(usergame.gameId);
//         const gameRow = document.createElement('tr');
//         const gameNo = document.createElement('th');
//         const gameLink = document.createElement('td');
//         const gameBtn = document.createElement('button');
//         gameNo.innerText = usergame.gameId;
//         gameBtn.classList.add('btn', 'btn-secondary', 'btn-sm');
//         gameBtn.innerText = 'Link';
//         gameBtn.addEventListener('click', () => {
//           currentGame = openCurrentGame(usergame.gameId);
//         });
//         // gameRow.innerHTML = `
//         // <th scope='row'>${usergame.gameId}</th>
//         // <td><a href='/game/${usergame.gameId}'>Play</a></td>
//         // `;
//         gameRow.appendChild(gameNo);
//         gameRow.appendChild(gameLink);
//         gameLink.appendChild(gameBtn);
//         gameTableBody.appendChild(gameRow);
//       });
//     })
//     .catch((error) => console.log(error));

//   // 5. Sidebar list
//   const sidebarItems = ['User', 'Games', 'Win', 'Lose'];
//   sidebarItems.forEach((item) => {
//     const itemElement = document.createElement('li');
//     itemElement.id = item;
//     itemElement.innerText = item;
//     itemElement.classList.add();
//     sidebarList.appendChild(itemElement);
//   });

//   // Create the dashboard layout
//   dashboardContainer.appendChild(sidebar);
//   dashboardContainer.appendChild(rightContent);
//   sidebar.appendChild(sidebarHeader);
//   sidebar.appendChild(sidebarList);
//   document.body.appendChild(dashboardContainer);
// };

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

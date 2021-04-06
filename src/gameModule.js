import axios from 'axios';
import go from 'go-game';

export function updateGame(coordObj) {
  // coordObj is an object containing the row, col, and gameId
  return axios
    .post('/placepiece', coordObj)
    // .then((result) => {
    //   currentGame = result.data;
    //   console.log(currentGame.game);
    //   const newGoObj = new go(JSON.stringify(currentGame.game));
    //   console.log('#######################');
    //   console.log(newGoObj.printField());
    //   renderBoard(newGoObj.field);
    // })
    .catch((error) => {
      console.log(error);
    });
}

// const placePiece = (i, j, gameId) => {
//   console.log(`coordinates: ${i}, ${j}`);
//   console.log(`current game id: ${currentGame.id}`);
//   const newCoord = {
//     row: i,
//     col: j,
//     gameId,
//   };
//   axios
//     .post('/placepiece', newCoord)
//     .then((result) => {
//       console.log('piece placed successfully');
//       currentGame = result.data;
//       console.log(currentGame.game);
//       const newGoObj = new go(JSON.stringify(currentGame.game));
//       console.log('#######################');
//       console.log(newGoObj.printField());
//       renderBoard(newGoObj.field);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

export function buildBoard(boardArr, callbackFn) {
  const boardGrid = document.createElement('div');
  boardGrid.classList.add('grid-display');
  const boardLen = boardArr.length;

  for (let i = 0; i < boardLen; i += 1) {
    for (let j = 0; j < boardLen; j += 1) {
      // For each coordinate, create a box and a piece
      const box = document.createElement('div');
      const piece = document.createElement('div');
      boardGrid.appendChild(box);
      // CALLBACK FUNCTION
      box.addEventListener('click', () => {
        callbackFn(i, j);
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
  return boardGrid;
}

export function renderGameContainer(currentGame, backBtnCB, refreshCB) {
  // 0. Clear any dashboard elements
  const dashboardElement = document.getElementById('dashboardContainer');
  if (dashboardElement) {
    document.body.removeChild(dashboardElement);
  }

  // 1. Declare elements
  const gameViewContainer = document.createElement('div');
  const boardContainer = document.createElement('div');
  const gameInfoContainer = document.createElement('div');
  const backToDashboardBtn = document.createElement('button');
  const refreshGameBtn = document.createElement('button');

  // 2. Get the game object from variable <currentGame>
  console.log(currentGame.game);
  const newGoObj = new go(JSON.stringify(currentGame.game));
  console.log('#######################');
  console.log(newGoObj.printField());

  // 3. Make the page view outline
  gameViewContainer.classList.add('row');
  [boardContainer, gameInfoContainer].forEach((element) => {
    element.classList.add('col');
    gameViewContainer.appendChild(element);
  });
  boardContainer.id = 'boardContainer';

  [backToDashboardBtn, refreshGameBtn].forEach((button) => {
    button.classList.add('btn', 'btn-primary');
  });
  refreshGameBtn.innerText = 'Refresh Game';
  backToDashboardBtn.innerText = 'Back to Home';

  // 4. Add the buttons
  backToDashboardBtn.addEventListener('click', () => {
    backBtnCB();
  });
  refreshGameBtn.addEventListener('click', () => {
    // renderGameContainer(currentGame)
    refreshCB(currentGame.id);
  });

  // 4. Make the board and append
  // const builtBoard = buildBoard(newGoObj.field);
  // boardContainer.appendChild(builtBoard);

  gameInfoContainer.appendChild(backToDashboardBtn);
  gameInfoContainer.appendChild(refreshGameBtn);
  return gameViewContainer;
  // mainContainer.appendChild(gameViewContainer);
}

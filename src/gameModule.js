import axios from 'axios';
import go from 'go-game';

export function updateGame(coordObj) {
  // coordObj is an object containing the row, col, and gameId
  return axios
    .post('/placepiece', coordObj)
    .catch((error) => {
      console.log(error);
    });
}

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
        piece.innerText = '⚪';
        box.appendChild(piece);
      } else if (boardArr[i][j] === 0) {
        piece.innerText = '⚫';
        box.appendChild(piece);
      }
    }
  }
  return boardGrid;
}

const makePlayerDiv = (playerNo, currentGame) => {
  console.log(`generating info for ${playerNo}`);

  const playerCol = document.createElement('div');
  playerCol.classList.add('col', `player-col-${playerNo}`);
  const playerName = document.createElement('p');
  const playerScore = document.createElement('p');
  console.log('testing for 0: ...');
  // console.log(currentGame.game.users[0]);
  playerName.innerText = currentGame.players[playerNo];
  playerScore.innerText = `${currentGame.game.score[playerNo]} Captures`;

  playerCol.appendChild(playerName);
  playerCol.appendChild(playerScore);
  return playerCol;
};

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
  const buttonsRow = document.createElement('div');
  const gameMsgRow = document.createElement('div');
  const playersRow = document.createElement('div');
  const backToDashboardBtn = document.createElement('button');
  const refreshGameBtn = document.createElement('button');

  gameViewContainer.classList.add('row');
  [buttonsRow, gameMsgRow, playersRow].forEach((element) => {
    element.classList.add('row', 'my-4');
    gameInfoContainer.appendChild(element);
  });

  // 2. Get the game object from variable <currentGame>
  console.log('~~~~ CURRENT GAME OBJECT ~~~~');
  console.log(currentGame);
  console.log(currentGame.game);
  const newGoObj = new go(JSON.stringify(currentGame.game));
  console.log('#######################');
  // console.log(newGoObj.printField());
  const moveCount = currentGame.game.moves.length;
  const nextPlayer = moveCount % 2;
  console.log(`Number of moves: ${moveCount}`);
  console.log(`next player: ${nextPlayer}`);

  const blackPlayer = makePlayerDiv(0, currentGame);
  const whitePlayer = makePlayerDiv(1, currentGame);
  playersRow.appendChild(blackPlayer);
  playersRow.appendChild(whitePlayer);

  // 3. Make the page view outline
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
    refreshCB(currentGame.id);
  });

  buttonsRow.appendChild(backToDashboardBtn);
  buttonsRow.appendChild(refreshGameBtn);
  return gameViewContainer;
  // mainContainer.appendChild(gameViewContainer);
}

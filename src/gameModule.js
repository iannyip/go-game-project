import axios from 'axios';
import go from 'go-game';

export function updateGame(coordObj) {
  // coordObj is an object containing the row, col, and gameId
  return axios.post('/placepiece', coordObj).catch((error) => {
    console.log(error);
  });
}

export function passGame(gameObj) {
  // gameId is an object contain just the game id
  return axios.post('/pass', gameObj).catch((error) => console.log(error));
}

export function buildBoard(boardArr, callbackFn, gameStatus) {
  const boardGrid = document.createElement('div');
  const boardLen = boardArr.length;
  boardGrid.classList.add(`board-${boardLen}`);
  // "grid-display"

  for (let i = 0; i < boardLen; i += 1) {
    for (let j = 0; j < boardLen; j += 1) {
      // For each coordinate, create a box and a piece
      const box = document.createElement('div');
      const piece = document.createElement('div');
      boardGrid.appendChild(box);
      // CALLBACK FUNCTION
      if (gameStatus === 'Ongoing' || gameStatus === 'Pass') {
        box.addEventListener('click', () => {
          callbackFn(i, j);
        });
      }
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
  const playerCol = document.createElement('div');
  playerCol.classList.add('col-sm-6', `player-col-${playerNo}`);
  const playerName = document.createElement('b');
  const playerScore = document.createElement('p');

  playerName.innerText = currentGame.players[playerNo];
  playerScore.innerText = `${currentGame.game.score[playerNo]} Captures`;

  playerCol.appendChild(playerName);
  playerCol.appendChild(playerScore);
  return playerCol;
};

const calculateArea = (boardArray, playerNo) => {
  const boardLen = boardArray.length;
  const boardArea = boardLen ** 2;
  let score = 0;
  for (let i = 0; i < boardLen; i += 1) {
    for (let j = 0; j < boardLen; j += 1) {
      if (Number(boardArray[i][j]) === Number(playerNo)) {
        score += 1;
      }
    }
  }
  const scorePercent = score / boardArea;
  return scorePercent;
};

export function renderGameContainer(
  currentGame,
  backBtnCB,
  refreshCB,
  passCB,
  runGame,
) {
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
  const gameMsgText = document.createElement('p');
  const playersRow = document.createElement('div');
  const backToDashboardBtn = document.createElement('button');
  const refreshGameBtn = document.createElement('button');
  const passGameBtn = document.createElement('button');
  const replayBtn = document.createElement('button');

  const percentRow = document.createElement('div');
  const progressBar = document.createElement('div');
  const whiteProgress = document.createElement('div');
  const blackProgress = document.createElement('div');
  const unoccupiedProgress = document.createElement('div');

  gameViewContainer.classList.add('row', 'pt-4');
  buttonsRow.classList.add('justify-content-around');
  [buttonsRow, gameMsgRow, playersRow, percentRow].forEach((element) => {
    element.classList.add('row', 'my-3');
    gameInfoContainer.appendChild(element);
  });

  // 2. Get the game object from variable <currentGame>
  const newGoObj = new go(JSON.stringify(currentGame.game));
  const moveCount = currentGame.game.moves.length;
  const nextPlayer = moveCount % 2;

  const blackPlayer = makePlayerDiv(0, currentGame);
  const whitePlayer = makePlayerDiv(1, currentGame);
  playersRow.appendChild(blackPlayer);
  playersRow.appendChild(whitePlayer);

  gameMsgRow.appendChild(gameMsgText);
  gameMsgText.classList.add('lead', 'text-center', 'game-msg');
  if (nextPlayer === 0 || currentGame.game.moves[0].score === null) {
    gameMsgText.innerText = 'Black to move';
  } else {
    gameMsgText.innerText = 'White to move';
  }
  if (currentGame.status === 'End') {
    gameMsgText.innerText = 'Both players passed. Game has ended';
  } else if (currentGame.status === 'Pass') {
    gameMsgText.innerText += '. Previous player passed';
  }
  // 3. Make the page view outline
  [boardContainer, gameInfoContainer].forEach((element) => {
    element.classList.add('col');
    gameViewContainer.appendChild(element);
  });
  boardContainer.id = 'boardContainer';

  // 4.1 Add the buttons
  [backToDashboardBtn, refreshGameBtn, passGameBtn, replayBtn].forEach(
    (button) => {
      button.classList.add(
        'btn',
        'btn-outline-dark',
        'btn-sm',
        'col-lg-2',
        'col-sm-5',
        'col-12',
        'my-2',
      );
      buttonsRow.appendChild(button);
    },
  );
  refreshGameBtn.innerText = 'Refresh Game';
  backToDashboardBtn.innerText = 'Back to Home';
  passGameBtn.innerText = 'Pass';
  replayBtn.innerText = 'Replay';

  // Make Progress Bar here
  const whiteValue = Math.round(calculateArea(newGoObj.field, 1) * 100);
  const blackValue = Math.round(calculateArea(newGoObj.field, 0) * 100);
  const unoccupiedValue = Math.round(calculateArea(newGoObj.field, -1) * 100);
  [blackProgress, unoccupiedProgress, whiteProgress].forEach((item) => {
    //
    item.classList.add('progress-bar');
    item.setAttribute('role', 'progressbar');
    progressBar.appendChild(item);
  });
  console.log(`%%%: ${whiteValue}, ${blackValue}, ${unoccupiedValue}`);
  whiteProgress.style.width = `${whiteValue}%`;
  whiteProgress.innerText = `${whiteValue}%`;
  whiteProgress.classList.add('white-progress');
  blackProgress.style.width = `${blackValue}%`;
  blackProgress.innerText = `${blackValue}%`;
  blackProgress.classList.add('black-progress');
  unoccupiedProgress.style.width = `${unoccupiedValue}%`;
  unoccupiedProgress.innerText = `${unoccupiedValue}%`;
  unoccupiedProgress.classList.add('unoccupied-progress');

  progressBar.classList.add('progress', 'px-0');
  progressBar.style.height = '40px';
  percentRow.innerText = 'Area occupied:';
  percentRow.style.color = '#7f868d';
  percentRow.appendChild(progressBar);

  // 4.2 Button event listeners
  // let stopRefreshStatus = false;

  // const autoRefresh = setInterval(() => {
  //   console.log('refreshing...');
  //   refreshCB(currentGame.id);
  //   if (stopRefreshStatus) {
  //     console.log('i happened');
  //     clearInterval(autoRefresh);
  //   }
  // }, 3000);

  // backToDashboardBtn.addEventListener('click', () => {
  //   clearInterval(autoRefresh);
  //   console.log('clearing interval');
  //   stopRefreshStatus = true;
  //   backBtnCB();
  // });

  backToDashboardBtn.addEventListener('click', () => {
    // clearInterval(autoRefresh);
    // console.log('clearing interval');
    backBtnCB();
  });

  refreshGameBtn.addEventListener('click', () => {
    refreshCB(currentGame.id);
  });
  passGameBtn.addEventListener('click', () => {
    passCB();
  });
  replayBtn.addEventListener('click', () => {
    let moveNo = 0;
    const playBoard = setInterval(() => {
      runGame(currentGame.game.moves[moveNo].field);
      moveNo += 1;
      if (moveNo > moveCount - 1) {
        clearInterval(playBoard);
      }
    }, 500);
  });

  return gameViewContainer;
}

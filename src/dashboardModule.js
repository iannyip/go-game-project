import "./styles.scss";
import axios from "axios";

export function newGameClick(gameInfoObj) {
  // gameInfoObj is an object that contains:
  // opponent: <OPPONENT_NAME> E.g. Tybi as string
  // board: <BOARD_LENGTH> E.g. 5 as string
  return axios.post("/newGame", gameInfoObj).catch((error) => {
    console.log(error);
  });
}

export function instructionModal() {
  // 1. Clear any existing modals
  const previousModal = document.getElementById("instructionModal");
  if (previousModal) {
    document.body.removeChild(previousModal);
  }

  // 2. Declare all the modal elements
  const modalDiv = document.createElement("div");
  const modalDialogDiv = document.createElement("div");
  const modalContentDiv = document.createElement("div");
  const modalHeaderDiv = document.createElement("div");
  const modalBodyDiv = document.createElement("div");
  const modalFooterDiv = document.createElement("div");
  const modalCloseBtn = document.createElement("button");
  const modalTitle = document.createElement("h5");
  const gameRules = document.createElement("ol");
  const moreInfoLink = document.createElement("p");

  // 4. Accompanying instructions
  modalTitle.innerText = "How to play GO";
  gameRules.innerHTML = `
  <li>Black goes first</li>
  <li>Players take turns to place a stone of one's colour on an empty intersection on the board</li>
  <li>Two consecutive passes end the game</li>
  <li>The player with more area wins</li>
  `;
  moreInfoLink.innerHTML = `
  <i>
  Read the full rules on <a href="https://en.wikipedia.org/wiki/Rules_of_Go" target="_blank" >wikipedia</a>
  </i>
  `;

  // 5. Set attributes and classes of modal elements
  modalDiv.setAttribute("tabindex", "-1");
  modalDiv.id = "instructionModal";
  modalDiv.classList.add("modal", "fade");
  modalDialogDiv.classList.add("modal-dialog");
  modalContentDiv.classList.add("modal-content");
  modalHeaderDiv.classList.add("modal-header");
  modalTitle.classList.add("modal-title");
  modalBodyDiv.classList.add("modal-body");
  modalFooterDiv.classList.add("modal-footer");
  modalCloseBtn.classList.add("btn-close");
  modalCloseBtn.setAttribute("data-bs-dismiss", "modal");

  // 8. Append elements to form the modal form
  modalDiv.appendChild(modalDialogDiv);
  modalDialogDiv.appendChild(modalContentDiv);
  modalContentDiv.appendChild(modalHeaderDiv);
  modalContentDiv.appendChild(modalBodyDiv);
  modalContentDiv.appendChild(modalFooterDiv);
  modalHeaderDiv.appendChild(modalTitle);
  modalHeaderDiv.appendChild(modalCloseBtn);
  modalBodyDiv.appendChild(gameRules);
  modalBodyDiv.appendChild(moreInfoLink);

  // 9. Return modal element
  return modalDiv;
}

export function NewGameModal(callbackFn) {
  // 1. Clear any existing modals
  const previousModal = document.getElementById("newGameModal");
  if (previousModal) {
    document.body.removeChild(previousModal);
  }

  // 2. Declare all the modal elements
  const modalDiv = document.createElement("div");
  const modalDialogDiv = document.createElement("div");
  const modalContentDiv = document.createElement("div");
  const modalHeaderDiv = document.createElement("div");
  const modalBodyDiv = document.createElement("div");
  const modalFooterDiv = document.createElement("div");
  const words = document.createElement("label");
  const boardSelectText = document.createElement("label");
  const modalCloseBtn = document.createElement("button");
  const modalSubmit = document.createElement("button");
  const opponentInput = document.createElement("input");
  const boardSizeInput = document.createElement("select");
  const userDataList = document.createElement("datalist");

  // 3. Declare boardsize
  const boardSize = [5, 9, 13, 17, 19, 21];

  boardSize.forEach((board) => {
    const element = document.createElement("option");
    element.value = board;
    element.innerText = `${board} x ${board}`;
    boardSizeInput.appendChild(element);
  });

  // 4. Accompanying instructions
  words.innerText = "Choose your opponent";
  boardSelectText.innerText = "Select your board size";
  modalSubmit.innerText = "Create Game!";

  // 5. Set attributes and classes of modal elements
  modalDiv.setAttribute("tabindex", "-1");
  modalDiv.id = "newGameModal";
  modalDiv.classList.add("modal", "fade");
  modalDialogDiv.classList.add("modal-dialog");
  modalContentDiv.classList.add("modal-content");
  modalHeaderDiv.classList.add("modal-header");
  modalBodyDiv.classList.add("modal-body");
  modalFooterDiv.classList.add("modal-footer");
  modalCloseBtn.classList.add("btn-close");
  modalCloseBtn.setAttribute("data-bs-dismiss", "modal");
  modalSubmit.classList.add("btn", "btn-primary");
  words.classList.add("form-label");
  boardSelectText.classList.add("form-label");
  opponentInput.classList.add("form-control");
  boardSizeInput.classList.add("form-select");
  opponentInput.setAttribute("list", "dataListOptions");
  userDataList.id = "dataListOptions";
  opponentInput.id = "opponentInput";
  boardSizeInput.id = "boardSizeInput";

  // 6. Get list of users for the userDataList input field
  axios
    .get("/users")
    .then((result) => {
      const usersArr = result.data;
      usersArr.forEach((user) => {
        const optionEle = document.createElement("option");
        optionEle.value = user.name;
        userDataList.appendChild(optionEle);
      });
    })
    .catch((error) => {
      console.log(error);
    });

  // 7. Add callback function to submit button
  modalSubmit.addEventListener("click", callbackFn);

  // 8. Append elements to form the modal form
  modalDiv.appendChild(modalDialogDiv);
  modalDialogDiv.appendChild(modalContentDiv);
  modalContentDiv.appendChild(modalHeaderDiv);
  modalContentDiv.appendChild(modalBodyDiv);
  modalContentDiv.appendChild(modalFooterDiv);
  modalHeaderDiv.appendChild(modalCloseBtn);
  modalFooterDiv.appendChild(modalSubmit);
  modalBodyDiv.appendChild(words);
  modalBodyDiv.appendChild(opponentInput);
  modalBodyDiv.appendChild(userDataList);
  modalBodyDiv.appendChild(boardSelectText);
  modalBodyDiv.appendChild(boardSizeInput);

  // 9. Return modal element
  return modalDiv;
}

export function getGame(gameId) {
  return axios.get(`/game/${gameId}`).catch((error) => console.log(error));
}

const createSidebarList = () => {
  const sidebarList = document.createElement("ul");
  sidebarList.innerHTML = "";
  sidebarList.classList.add("list-unstyled", "components", "text-center");

  axios
    .get("/stats")
    .then((result) => {
      const playerStats = result.data;
      console.log(playerStats);

      const sidebarItems = ["user", "games", "wins", "lose"];
      sidebarItems.forEach((item) => {
        const itemTitleElement = document.createElement("li");
        const itemContentElement = document.createElement("li");
        if (item !== "user") {
          itemTitleElement.innerText = item;
        }
        itemContentElement.innerText = playerStats[item];
        itemContentElement.classList.add("player-stat");
        itemTitleElement.classList.add("h6");
        sidebarList.appendChild(itemContentElement);
        sidebarList.appendChild(itemTitleElement);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  return sidebarList;
};

export function renderUserDashboardElement(callbackFn, refreshCB) {
  // -1. Clear any previous dashboards
  const dashboardElement = document.getElementById("dashboardContainer");
  if (dashboardElement) {
    document.body.removeChild(dashboardElement);
  }

  // 0. Declare elements
  const dashboardContainer = document.createElement("div");
  const sidebar = document.createElement("div");
  const rightContent = document.createElement("div");
  const rightHeader = document.createElement("h1");
  const rightHeaderLine = document.createElement("hr");
  const sidebarHeader = document.createElement("div");
  const btnContainer = document.createElement("div");
  const gameCardsContainer = document.createElement("div");
  const newGameBtn = document.createElement("button");
  const refreshPgBtn = document.createElement("button");
  const instructionBtn = document.createElement("button");

  dashboardContainer.id = "dashboardContainer";
  dashboardContainer.classList.add("wrapper");

  sidebarHeader.innerText = "GO";
  sidebarHeader.classList.add("sidebar-header");
  // sidebarList.classList.add("list-unstyled", "components");
  sidebar.id = "sidebar";
  rightContent.id = "content";

  // 1. Clear the view
  dashboardContainer.innerHTML = "";

  // 2.1 Define BUTTONS in SIDEBAR
  [newGameBtn, refreshPgBtn, instructionBtn].forEach((button) => {
    button.classList.add("btn", "btn-dark");
    btnContainer.appendChild(button);
  });
  newGameBtn.innerText = "New Game";
  refreshPgBtn.innerText = "Refresh Page";
  instructionBtn.innerText = "How To Play";
  refreshPgBtn.addEventListener("click", () => {
    refreshCB();
  });
  // 2.2 BUTTONS with modals
  newGameBtn.setAttribute("data-bs-toggle", "modal");
  newGameBtn.setAttribute("data-bs-target", "#newGameModal");
  instructionBtn.setAttribute("data-bs-toggle", "modal");
  instructionBtn.setAttribute("data-bs-target", "#instructionModal");
  NewGameModal();
  btnContainer.classList.add("btn-container", "d-grid", "gap-2");

  // 3. RIGHTCONTENT: Get the table of all ongoing games
  rightHeader.innerText = "Your Games";
  rightContent.classList.add("container");
  rightHeaderLine.classList.add("my-4");
  gameCardsContainer.classList.add("row", "justify-content-left");
  rightContent.appendChild(rightHeader);
  rightContent.appendChild(rightHeaderLine);
  rightContent.appendChild(gameCardsContainer);

  axios
    .get("/dashboard")
    .then((result) => {
      const userInfo = result.data;
      console.log(userInfo);
      userInfo.games.forEach((playedGame) => {
        const pTurn = playedGame.game.gameState.moves.length % 2;

        // CARD VERSION
        const gameCard = document.createElement("div");
        const gameCardNo = document.createElement("div");
        const gameCardOpponent = document.createElement("div");
        const gameCardTurn = document.createElement("div");
        const gameCardStatus = document.createElement("div");
        const gameCardBtn = document.createElement("button");
        gameCard.classList.add(
          "col-md-4",
          "col-lg-2",
          "game-card",
          "rounded-3",
          "zoom"
        );
        gameCardNo.classList.add("card-no");
        gameCardStatus.classList.add("card-status");

        gameCardBtn.classList.add(
          "btn",
          "btn-secondary",
          "btn-sm",
          "board-link"
        );
        gameCardBtn.innerText = "Go";
        gameCardBtn.addEventListener("click", () => {
          callbackFn(playedGame.gameId);
        });

        gameCardNo.innerText = `Game #${playedGame.gameId}`;
        gameCardOpponent.innerHTML = `${playedGame.opponent}`;
        gameCardStatus.innerText = playedGame.game.status;
        gameCardStatus.classList.add(
          `status-${playedGame.game.status.toLowerCase()}`
        );
        if (gameCardStatus.innerText === "End") {
          console.log("value is end");
        } else {
          if (playedGame.game.players[pTurn] === userInfo.username) {
            gameCardTurn.innerText = "Your turn";
            gameCardBtn.classList.add("btn-success");
          } else {
            gameCardTurn.innerText = `${playedGame.game.players[pTurn]}'s turn`;
            gameCardBtn.classList.add("btn-danger");
          }
        }

        gameCardTurn.classList.add("game-turn");
        gameCardOpponent.classList.add("game-opponent");

        gameCard.appendChild(gameCardNo);
        gameCard.appendChild(gameCardOpponent);
        gameCard.appendChild(gameCardTurn);
        gameCard.appendChild(gameCardStatus);
        gameCard.appendChild(gameCardBtn);
        gameCardsContainer.appendChild(gameCard);
      });
    })
    .catch((error) => console.log(error));

  // 5. Sidebar list
  const sidebarList = createSidebarList();

  // 6. Create the dashboard layout by combining SIDEBAR and RIGHTCONTENT
  dashboardContainer.appendChild(sidebar);
  dashboardContainer.appendChild(rightContent);
  sidebar.appendChild(sidebarHeader);
  sidebar.appendChild(btnContainer);
  sidebar.appendChild(sidebarList);

  // 7. Pass the element back to user
  return dashboardContainer;
}

import "./styles.scss";
import axios from "axios";
import go from "go-game";
import loginModules from "./loginModule";

const loginModule = loginModules();
let currentGame = null;

// var myModal = new bootstrap.Modal(document.getElementById("myModal"), options);
// document.body.append(myModal);

const getCookie = (cname) => {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

const game = new go(3);
game.playerTurn(go.BLACK, [0, 1]);
console.log(game.printField());

console.log("helloooo");

// const mainContainer = document.createElement("div");
// mainContainer.id = "mainContainer";
const mainContainer = document.getElementById("mainContainer");
mainContainer.classList.add("container");
// document.body.appendChild(mainContainer);

const loginContainer = document.createElement("div");
const loginCol = document.createElement("div");
const loginName = document.createElement("input");
const loginPassword = document.createElement("input");
const loginBtn = document.createElement("button");

const dashboardContainer = document.createElement("div");
const newGameBtn = document.createElement("button");

const gameViewContainer = document.createElement("div");
const boardContainer = document.createElement("div");
const gameInfoContainer = document.createElement("div");
const backToDashboardBtn = document.createElement("button");

const placePiece = (i, j) => {
  console.log(`coordinates: ${i}, ${j}`);
  console.log(`current game id: ${currentGame.id}`);
  const newCoord = {
    row: i,
    col: j,
    gameId: currentGame.id,
  };
  axios
    .post("/placepiece", newCoord)
    .then((result) => {
      console.log("piece placed successfully");
      currentGame = result.data;
      console.log(currentGame.game);
      let newGoObj = new go(JSON.stringify(currentGame.game));
      console.log("#######################");
      console.log(newGoObj.printField());
      renderBoard(newGoObj.field);
    })
    .catch((error) => {
      console.log(error);
    });
};

const renderBoard = (boardArr) => {
  boardContainer.innerHTML = "";
  const boardGrid = document.createElement("div");
  boardGrid.classList.add("grid-display");
  const boardLen = boardArr.length;
  console.log(boardLen);
  for (let i = 0; i < boardLen; i += 1) {
    for (let j = 0; j < boardLen; j += 1) {
      const box = document.createElement("div");
      const piece = document.createElement("div");
      boardGrid.appendChild(box);
      box.addEventListener("click", () => {
        placePiece(i, j);
      });
      box.classList.add("cell");
      piece.classList.add("piece");
      if (i === 0) {
        box.classList.add("v-b");
      } else if (i === boardLen - 1) {
        box.classList.add("v-t");
      } else {
        box.classList.add("v-f");
      }
      if (j === 0) {
        box.classList.add("h-r");
      } else if (j === boardLen - 1) {
        box.classList.add("h-l");
      } else {
        box.classList.add("h-f");
      }
      if (boardArr[i][j] === 1) {
        piece.innerText = "⚫";
        box.appendChild(piece);
      } else if (boardArr[i][j] === 0) {
        piece.innerText = "⚪";
        box.appendChild(piece);
      }
    }
  }
  boardContainer.appendChild(boardGrid);
};

const renderGameView = () => {
  mainContainer.innerHTML = "";
  console.log(currentGame.game);
  let newGoObj = new go(JSON.stringify(currentGame.game));
  console.log("#######################");
  console.log(newGoObj.printField());
  renderBoard(newGoObj.field);

  gameViewContainer.classList.add("row");
  [boardContainer, gameInfoContainer].forEach((element) => {
    element.classList.add("col");
    gameViewContainer.appendChild(element);
  });
  backToDashboardBtn.classList.add("btn", "btn-primary");
  backToDashboardBtn.innerText = "Back to Home";
  backToDashboardBtn.addEventListener("click", () => {
    renderUserDashboard();
  });
  gameInfoContainer.appendChild(backToDashboardBtn);
  mainContainer.appendChild(gameViewContainer);
};

const newGameClick = () => {
  const newGameInfo = {
    opponent: document.getElementById("opponentInput").value,
    board: document.getElementById("boardSizeInput").value,
  };
  console.log(newGameInfo);
  axios
    .post("/newGame", newGameInfo)
    .then((result) => {
      console.log("new game posted successfully");
      currentGame = result.data;
      renderGameView();

      // const modalToClose = document.getElementById("newGameModal");
      // modalToClose.remove();
    })
    .catch((error) => {
      console.log(error);
    });
};

const NewGameModal = () => {
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
  // MODIFY BOARDSIZEINPUT VARIABLE TO ALLOW USER TO SET BOARD SIZE
  // const boardSelect = document.createElement("select");
  const boardSize = [5, 9, 13, 17, 19, 21];

  boardSize.forEach((board) => {
    const element = document.createElement("option");
    element.value = board;
    element.innerText = `${board} x ${board}`;
    boardSizeInput.appendChild(element);
  });

  words.innerText = "Choose your opponent";
  boardSelectText.innerText = "Select your board size";
  modalSubmit.innerText = "Create Game!";

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
  // boardSizeInput.classList.add("form-control");
  boardSizeInput.classList.add("form-select");
  opponentInput.setAttribute("list", "dataListOptions");
  userDataList.id = "dataListOptions";
  opponentInput.id = "opponentInput";
  boardSizeInput.id = "boardSizeInput";

  axios
    .get("/users")
    .then((result) => {
      console.log(result.data);
      const usersArr = result.data;
      usersArr.forEach((user) => {
        const optionEle = document.createElement("option");
        // optionEle.value = user.id;
        optionEle.value = user.name;
        userDataList.appendChild(optionEle);
      });
    })
    .catch((error) => {
      console.log(error);
    });

  modalSubmit.addEventListener("click", newGameClick);

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
  document.body.appendChild(modalDiv);
};

const renderUserDashboard = () => {
  mainContainer.innerHTML = "";
  newGameBtn.classList.add("btn", "btn-primary");
  newGameBtn.innerText = "Create new game";

  // document.body.appendChild(newGameBtn);
  newGameBtn.setAttribute("data-bs-toggle", "modal");
  newGameBtn.setAttribute("data-bs-target", "#newGameModal");
  // newGameBtn.addEventListener("click", newGameClick);
  NewGameModal();
  mainContainer.appendChild(newGameBtn);
};

const authUserLogin = () => {
  const userInfo = {
    name: document.getElementById("Username").value,
    password: document.getElementById("Password").value,
  };
  axios
    .post("/login", userInfo)
    .then((result) => {
      console.log(result.data);
      if (result.data == "valid user") {
        renderUserDashboard();
      } else {
        renderLoginView();
      }
    })
    .catch((error) => console.log(error));
};

const renderLoginView = () => {
  mainContainer.innerHTML = "";
  loginName.placeholder = "Username";
  loginPassword.placeholder = "Password";
  loginBtn.innerText = "Login";

  loginBtn.classList.add("btn", "btn-primary");
  loginBtn.setAttribute("type", "submit");
  loginBtn.addEventListener("click", authUserLogin);

  [loginName, loginPassword, loginBtn].forEach((element) => {
    element.id = element.placeholder || element.innerText;
    element.classList.add("form-control", "my-4");
    loginCol.appendChild(element);
  });

  loginContainer.classList.add("row", "justify-content-center", "my-4");
  loginCol.classList.add("col-md-6");
  loginContainer.appendChild(loginCol);
  mainContainer.appendChild(loginContainer);
};

renderLoginView();

// loginModule.renderLoginView();

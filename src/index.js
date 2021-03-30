let currentGame = null;

// var myModal = new bootstrap.Modal(document.getElementById("myModal"), options);
// document.body.append(myModal);

import "./styles.scss";
import axios from "axios";
import go from "go-game";

const game = new go(3);
game.playerTurn(go.BLACK, [0, 1]);
console.log(game.printField());

console.log("helloooo");

const mainContainer = document.createElement("div");
mainContainer.classList.add("container");
document.body.appendChild(mainContainer);

const loginContainer = document.createElement("div");
const loginCol = document.createElement("div");
const loginName = document.createElement("input");
const loginPassword = document.createElement("input");
const loginBtn = document.createElement("button");

const dashboardContainer = document.createElement("div");
const newGameBtn = document.createElement("button");

const newGameClick = () => {
  axios
    .post("/newGame")
    .then((result) => {
      console.log(result);
      currentGame = result.data.game;
      let newGoObj = new go(JSON.stringify(currentGame));
      console.log(newGoObj.printField());
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
  const words = document.createElement("p");
  const modalCloseBtn = document.createElement("button");
  const modalSubmit = document.createElement("button");
  const opponentInput = document.createElement("input");
  const boardSizeInput = document.createElement("input");
  const userDataList = document.createElement("datalist");
  // MODIFY BOARDSIZEINPUT VARIABLE TO ALLOW USER TO SET BOARD SIZE

  words.innerText = "Choose your opponent";
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
  opponentInput.classList.add("form-control");
  boardSizeInput.classList.add("form-control");
  opponentInput.setAttribute("list", "dataListOptions");
  userDataList.id = "dataListOptions";

  axios
    .get("/users")
    .then((result) => {
      console.log(result.data);
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
  document.body.appendChild(modalDiv);
};

const renderUserDashboard = () => {
  mainContainer.innerHTML = "";
  newGameBtn.classList.add("btn", "btn-primary");
  newGameBtn.innerText = "Create new game";

  document.body.appendChild(newGameBtn);
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

let currentGame = null;

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

const renderUserDashboard = () => {
  mainContainer.innerHTML = "";
  newGameBtn.classList.add("btn", "btn-primary");
  newGameBtn.innerText = "Create new game";
  newGameBtn.addEventListener("click", newGameClick);
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

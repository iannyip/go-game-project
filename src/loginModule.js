import "./styles.scss";
import axios from "axios";

export function renderLoginElements(callbackFunction) {
  // Declare login elements
  const loginContainer = document.createElement("div");
  const logoElement = document.createElement("div");
  const loginCol = document.createElement("div");
  const loginName = document.createElement("input");
  const loginPassword = document.createElement("input");
  const loginBtn = document.createElement("button");

  const blackPiece = document.createElement("div");
  const whitePiece = document.createElement("div");

  // Set placeholders, text and classes
  loginName.placeholder = "Username";
  loginPassword.placeholder = "Password";
  loginPassword.type = "password";

  // Define logo
  logoElement.innerText = "GO";
  logoElement.classList.add("login-logo");
  blackPiece.innerText = "⚫";
  blackPiece.classList.add("black-logo");
  whitePiece.innerText = "⚪";
  whitePiece.classList.add("white-logo");
  logoElement.appendChild(blackPiece);
  logoElement.appendChild(whitePiece);
  loginCol.appendChild(logoElement);

  // Set attributes, class, CALLBACK of login button
  loginBtn.innerText = "Login";
  loginBtn.classList.add("btn", "btn-primary");
  loginBtn.setAttribute("type", "submit");
  loginBtn.addEventListener("click", callbackFunction);

  // Assign id, add class, and append
  [loginName, loginPassword, loginBtn].forEach((element) => {
    element.id = element.placeholder || element.innerText;
    element.classList.add("form-control", "my-4");
    loginCol.appendChild(element);
  });

  // Modify main container
  loginContainer.classList.add("row", "justify-content-center", "my-4");
  loginCol.classList.add("col-md-6");
  loginContainer.appendChild(loginCol);

  return loginContainer;
}

export function authUserLogin(name, password) {
  const userInfo = {
    name,
    password,
  };
  return axios.post("/login", userInfo).catch((error) => console.log(error));
}

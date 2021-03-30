import "./styles.scss";

console.log("helloooo");

const mainContainer = document.createElement("div");
mainContainer.classList.add("container");
document.body.appendChild(mainContainer);

const loginContainer = document.createElement("div");
const loginName = document.createElement("input");
const loginPassword = document.createElement("input");
const loginBtn = document.createElement("button");

const authUserLogin = () => {
  const userInfo = {
    name: document.getElementById("Username").value,
    password: document.getElementById("Password").value,
  };
  axios.post("/login", userInfo);
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
    loginContainer.appendChild(element);
  });

  loginContainer.classList.add("");
  mainContainer.appendChild(loginContainer);
};

renderLoginView();

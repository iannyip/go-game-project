import "./styles.scss";
import axios from "axios";
import go from "go-game";

const mainContainer = document.getElementById("mainContainer");

const loginContainer = document.createElement("div");
const loginCol = document.createElement("div");
const loginName = document.createElement("input");
const loginPassword = document.createElement("input");
const loginBtn = document.createElement("button");

export default function loginFeatures() {
  const renderLoginView = () => {
    console.log("i ran!");
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

  const authUserLogin = () => {
    console.log("checking for login...");
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

  return {
    renderLoginView,
    authUserLogin,
  };
}

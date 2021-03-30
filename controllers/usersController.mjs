import { resolve } from "path";
export default function initUsersController(db) {
  const root = (request, response) => {
    // response.render("../dist/main.html");
    response.sendFile(resolve("dist", "main.html"));
  };

  const index = async (request, response) => {
    try {
      const users = await db.User.findAll();
      users.forEach((user) => {
        console.log(`${user.id}: ${user.name}`);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (request, response) => {
    console.log(request.body);
    try {
      const authedUser = await db.User.findOne({ where: request.body });
      console.log(authedUser);
      if (authedUser === null) {
        response.send("invalid user");
      } else {
        response.cookie("userId", authedUser.id);
        response.send("valid user");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    root,
    login,
    index,
  };
}

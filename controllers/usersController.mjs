import { resolve } from "path";
export default function initUsersController(db) {
  const root = (request, response) => {
    // response.render("../dist/main.html");
    response.sendFile(resolve("dist", "main.html"));
  };

  const single = async (request, response) => {
    const { userId } = request.cookies;
    const user = await db.User.findOne({ where: { id: userId } });
    response.send(user);
  };

  const index = async (request, response) => {
    try {
      const users = await db.User.findAll();
      const { userId } = request.cookies;
      console.log(userId);
      const userArr = [];
      users.forEach((user) => {
        if (Number(user.id) !== Number(userId)) {
          userArr.push({
            id: user.id,
            name: user.name,
          });
        }
      });
      console.log(userArr);
      response.send(userArr);
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

  const gameindex = async (request, response) => {
    try {
      const { userId } = request.cookies;
      console.log(`~~~~~~~~~~~~~~~~~~~~~~`);
      console.log("userId", userId);
      const userGames = await db.User.findOne({
        where: { id: userId },
        include: [
          {
            model: db.GameUser,
          },
        ],
      });
      console.log(userGames);
      console.log("userGame ID: ", userGames.id);
      console.log("userGame name: ", userGames.name);
      console.log("userGame games: ", userGames.gameUsers[0]);
      const result = {
        username: userGames.name,
        games: userGames.gameUsers,
      };
      response.send(result);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    root,
    single,
    login,
    index,
    gameindex,
  };
}

import { resolve } from "path";
import pkg from "sequelize";
const { Op } = pkg;

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
      const userArr = [];
      users.forEach((user) => {
        if (Number(user.id) !== Number(userId)) {
          userArr.push({
            id: user.id,
            name: user.name,
          });
        }
      });
      response.send(userArr);
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (request, response) => {
    try {
      const authedUser = await db.User.findOne({ where: request.body });
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
      let playedGames = await db.User.findOne({
        where: { id: userId },
        include: [
          {
            model: db.GameUser,
            include: [
              {
                model: db.Game,
              },
            ],
          },
        ],
      });
      playedGames = playedGames.toJSON();
      playedGames.gameUsers.forEach((gameItem) => {
        if (gameItem.game.players !== "") {
          let opponentName;
          if (gameItem.game.players[0] === playedGames.name) {
            opponentName = gameItem.game.players[1];
          } else {
            opponentName = gameItem.game.players[0];
          }
          gameItem["opponent"] = opponentName;
        }
      });
      const result = {
        username: playedGames.name,
        games: playedGames.gameUsers,
      };
      // response.send(playedGames);
      response.send(result);
    } catch (error) {
      console.log(error);
    }
  };

  const stats = async (request, response) => {
    const { userId } = request.cookies;

    const user = await db.User.findOne({
      where: { id: userId },
    });
    const countOngoing = await db.User.count({
      where: { id: userId },
      include: [{ model: db.GameUser, where: { outcome: null } }],
    });
    const countWins = await db.User.count({
      where: { id: userId },
      include: [{ model: db.GameUser, where: { outcome: "Win" } }],
    });
    const countLose = await db.User.count({
      where: { id: userId },
      include: [{ model: db.GameUser, where: { outcome: "Lose" } }],
    });

    const result = {
      user: user.name,
      games: countOngoing,
      wins: countWins,
      lose: countLose,
    };
    response.send(result);
  };

  return {
    root,
    single,
    login,
    index,
    gameindex,
    stats,
  };
}

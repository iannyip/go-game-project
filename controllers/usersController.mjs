import { resolve } from 'path';

export default function initUsersController(db) {
  const root = (request, response) => {
    // response.render("../dist/main.html");
    response.sendFile(resolve('dist', 'main.html'));
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
        response.send('invalid user');
      } else {
        response.cookie('userId', authedUser.id);
        response.send('valid user');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const gameindex = async (request, response) => {
    try {
      const { userId } = request.cookies;
      const userGames = await db.User.findOne({
        where: { id: userId },
        include: [
          {
            model: db.GameUser,
          },
        ],
      });
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

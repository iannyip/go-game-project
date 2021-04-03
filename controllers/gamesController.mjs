import { response } from "express";

// Helper functions
const makeBlankBoard = (boardLength) => {
  let array = [];
  for (let i = 0; i < boardLength; i += 1) {
    let subArray = [];
    for (let j = 0; j < boardLength; j += 1) {
      subArray.push(-1);
    }
    array.push(subArray);
  }
  return array;
};

// Controllers
export default function initGamesController(db) {
  const index = (request, response) => {};

  const create = async (request, response) => {
    try {
      const { userId } = request.cookies;
      console.log(request.body);
      const opponentId = await db.User.findOne({
        where: {
          name: request.body.opponent,
        },
      });
      const users = {
        // `${opponentId.id}`: 1,
        // `${Number(userId)}`: 0,
        white: opponentId.id,
        black: Number(userId),
      };
      const players = {
        white: 1,
        black: 0,
      };
      const moves = [
        {
          player: null,
          field: makeBlankBoard(Number(request.body.board)),
          score: null,
          cord: null,
        },
      ];
      const score = { 0: 0, 1: 0 };
      const newGame = {
        gameState: {
          users,
          players,
          moves,
          score,
        },
      };
      const createdGame = await db.Game.create(newGame);
      // TO FIX
      const blackPlayer = await db.Game.createGameUser({
        userId: Number(userId),
        colour: "black",
      });
      const whitePlayer = await db.Game.createGameUser({
        userId: opponentId.id,
        colour: "white",
      });
      response.send({
        id: createdGame.id,
        game: createdGame.gameState,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const test = async (request, response) => {
    try {
      const newGame = await db.Game.create({
        gameState: "{}",
      });
      console.log(newGame.id);
      const player1 = await newGame.createGameUser({
        userId: 1,
        colour: 0,
      });
      console.log(player1);
      // const games = await db.Game.findOne({
      //   where: { id: 1 },
      //   // include: db.GameUser,
      // });
      // const whitePlayer = await games.getGameUsers({ where: { colour: 1 } });
      // // console.log(games.gameUsers);
      // // games.gameUsers.forEach((user) => {
      // // console.log(`${user.id}: ${user.colour}`);
      // // });
      // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      // console.log(whitePlayer);
      // console.log(`${whitePlayer[0].id}: ${whitePlayer[0].colour}`);
      // // players.forEach((player) => {
      // //   console.log(`${player.id}: ${player.colour}`);
      // // });
      response.send("yay");
    } catch (error) {
      console.log(error);
    }
  };
  const update = async (request, response) => {
    const { userId } = request.cookies;
    console.log(`${userId}'s move:`);
    console.log(request.body);
    const updatedGame = await db.Game.findOne({
      where: {
        id: request.body.gameId,
      },
    });
    console.log(`The game is: `);
    console.log(updatedGame);
    response.send(`received`);
  };

  // return all methods we define in an object
  // refer to the routes file above to see this used
  return {
    index,
    create,
    test,
    update,
  };
}

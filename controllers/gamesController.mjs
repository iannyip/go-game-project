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
      console.log(request.body);
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
          players,
          moves,
          score,
        },
      };
      const createdGame = await db.Game.create(newGame);
      response.send({
        game: createdGame.gameState,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const test = async () => {
    try {
      const games = await db.Game.findAll();
      console.log(games);
    } catch (error) {
      console.log(error);
    }
  };

  // return all methods we define in an object
  // refer to the routes file above to see this used
  return {
    index,
    create,
    test,
  };
}

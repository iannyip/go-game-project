// db is an argument to this function so

import { response } from "express";

// that we can make db queries inside
export default function initGamesController(db) {
  const index = (request, response) => {};

  const create = async (request, response) => {
    try {
      const players = {
        white: 1,
        black: 0,
      };
      const moves = [];
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

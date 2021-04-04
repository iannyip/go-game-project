import { response } from "express";
import go from "go-game";

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
      // TO FIX
      const blackPlayer = await createdGame.createGameUser({
        userId: Number(userId),
        colour: 0,
      });
      const whitePlayer = await createdGame.createGameUser({
        userId: opponentId.id,
        colour: 1,
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
      console.log(newGame);
      console.log("~~~~~~~~~~~~~ updated gameState ~~~~~~~~~~~~~~");

      newGame.gameState = JSON.stringify({ hello: 1 });
      console.log(newGame);
      await newGame.save();
      console.log("~~~~~~~~~~~~~ retrieve gameState ~~~~~~~~~~~~~~");
      const checkGame = await db.Game.findOne({ where: { id: 1 } });
      console.log(checkGame);
      // const updatedGame = await newGame.update({
      //   gameState: JSON.stringify({ hello: 1 }),
      // });
      // console.log(updatedGame);

      response.send("yay");
    } catch (error) {
      console.log(error);
    }
  };

  const test2 = async (request, response) => {
    try {
      const game = await db.Game.findOne({ where: { id: 2 } });
      console.log(game.gameState);
      let goGame;
      if (game.gameState.moves[0].score == null) {
        console.log("first time");
        const boardLen = game.gameState.moves[0].field.length;
        goGame = new go(boardLen);
      } else {
        console.log("second time");
        goGame = new go(JSON.stringify(game.gameState));
      }

      console.log("field length: ", game.gameState.moves[0].field.length);
      goGame.playerTurn(go.BLACK, [2, 1]);
      goGame.playerTurn(go.BLACK, [2, 2]);
      goGame.playerTurn(go.BLACK, [2, 3]);
      goGame.playerTurn(go.WHITE, [1, 1]);
      goGame.playerTurn(go.BLACK, [2, 2]);
      // const stringifiedGame = JSON.stringify(goGame);

      console.log(goGame);
      console.log(goGame.moves);
      const updatedGame = await db.Game.update(
        { gameState: goGame.moves },
        { where: { id: game.id } }
      );
      console.log(updatedGame);
      response.send("test2");
    } catch (error) {
      console.log(error);
    }
  };
  const update = async (request, response) => {
    const playerId = request.cookies.userId;
    console.log(`${playerId}'s move:`);
    console.log(request.body);
    // Get the game from db
    const game = await db.Game.findOne({
      where: {
        id: request.body.gameId,
      },
    });
    // Get the current player
    const currentPlayer = await db.GameUser.findOne({
      where: {
        gameId: request.body.gameId,
        userId: playerId,
      },
    });

    console.log(`Current player colour : ${currentPlayer.colour}`);

    // Create the go-game object
    let goGame;
    if (game.gameState.moves[0].score == null) {
      console.log("first time");
      const boardLen = game.gameState.moves[0].field.length;
      goGame = new go(boardLen);
    } else {
      console.log("second time");
      goGame = new go(JSON.stringify(game.gameState));
    }

    console.log(goGame.field);

    // Let user play
    if (currentPlayer.colour === 0) {
      goGame.playerTurn(go.BLACK, [request.body.row, request.body.col]);
    } else {
      goGame.playerTurn(go.WHITE, [request.body.row, request.body.col]);
    }
    // Update db
    console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~`);
    game.gameState.moves = goGame.moves;
    console.log(game.gameState);
    await db.Game.update(
      { gameState: game.gameState },
      { where: { id: game.id } }
    );
    const updatedGame = await db.Game.findOne({ where: { id: game.id } });
    console.log(`updated Game:`);
    console.log(updatedGame);
    console.log(`updated Game State:`);
    console.log(updatedGame.gameState);
    // Send back to front end
    response.send({
      id: updatedGame.id,
      game: updatedGame.gameState,
    });
  };

  const show = async (request, response) => {
    try {
      const gameId = request.params.id;
      const game = await db.Game.findOne({ where: { id: gameId } });
      const result = {
        id: gameId,
        game: game.gameState,
      };
      response.send(result);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
    create,
    test,
    test2,
    update,
    show,
  };
}

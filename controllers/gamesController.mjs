import go from "go-game";

// Helper functions
const makeBlankBoard = (boardLength) => {
  const array = [];
  for (let i = 0; i < boardLength; i += 1) {
    const subArray = [];
    for (let j = 0; j < boardLength; j += 1) {
      subArray.push(-1);
    }
    array.push(subArray);
  }
  return array;
};

const calculateArea = (boardArray, playerNo) => {
  const boardLen = boardArray.length;
  const boardArea = boardLen ** 2;
  let score = 0;
  for (let i = 0; i < boardLen; i += 1) {
    for (let j = 0; j < boardLen; j += 1) {
      if (Number(boardArray[i][j]) === Number(playerNo)) {
        score += 1;
      }
    }
  }
  const scorePercent = score / boardArea;
  return scorePercent;
};

// Controllers
export default function initGamesController(db) {
  const index = (request, response) => {};

  const create = async (request, response) => {
    try {
      const { userId } = request.cookies;
      const opponentId = await db.User.findOne({
        where: {
          name: request.body.opponent,
        },
      });

      // Make info needed for a go game obj. Store in newGame
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
      // INSERT INTO games table
      const createdGame = await db.Game.create(newGame);

      // INSERT INTO game_users table
      const blackPlayer = await createdGame.createGameUser({
        userId: Number(userId),
        colour: 0,
      });
      const blackPlayerInfo = await blackPlayer.getUser();
      const whitePlayer = await createdGame.createGameUser({
        userId: opponentId.id,
        colour: 1,
      });
      const whitePlayerInfo = await whitePlayer.getUser();

      // UPDATE players column in games table
      const users = {
        0: blackPlayerInfo.name,
        1: whitePlayerInfo.name,
      };
      createdGame.gameState.users = users;
      await db.Game.update(
        { players: users },
        { where: { id: createdGame.id } }
      );
      response.send({
        id: createdGame.id,
        game: createdGame.gameState,
        players: users,
        status: createdGame.status,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const test = async (request, response) => {
    try {
      // const gameId = 13
      // await db.GameUser.update(
      //   { outcome: "Win" },
      //   { where: { id: game.id, colour: 1 } }
      // );
      // await db.GameUser.update(
      //   { outcome: "Lose" },
      //   { where: { id: game.id, colour: 0 } }
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

    // Get the game from db
    const game = await db.Game.findOne({
      where: {
        id: request.body.gameId,
      },
    });

    // Get the current player (to find out which color he is)
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
      // If first time, make the game obj using board size
      console.log("first time");
      const boardLen = game.gameState.moves[0].field.length;
      goGame = new go(boardLen);
    } else {
      // If 2nd time, make the game object using JSON
      console.log("second time");
      goGame = new go(JSON.stringify(game.gameState));
    }

    // update the game object with player's turn
    if (currentPlayer.colour === 0) {
      goGame.playerTurn(go.BLACK, [request.body.row, request.body.col]);
    } else {
      goGame.playerTurn(go.WHITE, [request.body.row, request.body.col]);
    }

    // Update db
    game.gameState = goGame;
    await db.Game.update(
      { gameState: game.gameState },
      { where: { id: game.id } }
    );
    const updatedGame = await db.Game.findOne({ where: { id: game.id } });

    // Send back to front end
    response.send({
      id: updatedGame.id,
      game: updatedGame.gameState,
      players: updatedGame.players,
      status: updatedGame.status,
    });
  };

  const show = async (request, response) => {
    try {
      const gameId = request.params.id;
      const game = await db.Game.findOne({ where: { id: gameId } });
      const result = {
        id: gameId,
        game: game.gameState,
        players: game.players,
        status: game.status,
      };
      response.send(result);
    } catch (error) {
      console.log(error);
    }
  };

  const pass = async (request, response) => {
    try {
      const { userId } = request.cookies;

      // Get the game from db
      const game = await db.Game.findOne({
        where: { id: request.body.gameId },
        include: [{ model: db.GameUser }],
      });
      let playerColour;
      if (Number(game.gameUsers[0].userId) === Number(userId)) {
        playerColour = game.gameUsers[0].colour;
      } else {
        playerColour = game.gameUsers[1].colour;
      }

      console.log("~~~~~ GAME ~~~~~~");
      console.log(game.gameUsers[0].colour);
      console.log(game.gameUsers[1].colour);
      console.log(`Player who clicked: ${userId}`);
      console.log(game);
      console.log(`Player color: ${playerColour}`);

      // Get last board and user
      const moveNumber = game.gameState.moves.length;
      console.log(`The played index is: ${moveNumber}`);
      const lastMove = game.gameState.moves[moveNumber - 1];
      console.log(lastMove);

      // If the previous player passed,

      if (Number(playerColour) !== Number(lastMove.player)) {
        const newMove = {
          player: playerColour,
          field: lastMove.field,
          score: 0,
          coord: "pass",
        };
        const updatedGameState = game.gameState;
        updatedGameState.moves.push(newMove);
        await db.Game.update(
          { gameState: updatedGameState, status: "Pass" },
          { where: { id: game.id } }
        );
        // If the previous player passed, END the game
        if (lastMove.coord === "pass") {
          await db.Game.update({ status: "End" }, { where: { id: game.id } });
          const whiteScore = calculateArea(lastMove.field, 1);
          const blackScore = calculateArea(lastMove.field, 0);
          console.log(`SCORE TALLY: ${whiteScore} vs ${blackScore}`);
          console.log(`GOING TO UPDATE GAME: ${game.id}`);
          if (whiteScore > blackScore) {
            await db.GameUser.update(
              { outcome: "Win" },
              { where: { gameId: game.id, colour: 1 } }
            );
            await db.GameUser.update(
              { outcome: "Lose" },
              { where: { gameId: game.id, colour: 0 } }
            );
          } else {
            await db.GameUser.update(
              { outcome: "Lose" },
              { where: { gameId: game.id, colour: 1 } }
            );
            await db.GameUser.update(
              { outcome: "Win" },
              { where: { gameId: game.id, colour: 0 } }
            );
          }
        }
      }

      // Get updatedGame
      const updatedGame = await db.Game.findOne({ where: { id: game.id } });
      console.log(updatedGame);

      response.send({
        id: updatedGame.id,
        game: updatedGame.gameState,
        players: updatedGame.players,
        status: updatedGame.status,
      });

      // response.send("yay");
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
    pass,
  };
}

import go from "go-game";

const game = new go(3);

// be sure to pass correct player on queue
// you can use game.currentPlayer to get one
game.playerTurn(go.BLACK, [0, 1]);
game.playerTurn(go.WHITE, [2, 2]);

console.log(game.printField());
let json = JSON.stringify(game);
console.log(json);

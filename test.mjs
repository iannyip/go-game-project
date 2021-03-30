import go from "go-game";

const game = new go(3);

// be sure to pass correct player on queue
// you can use game.currentPlayer to get one
console.log("game object type: ", typeof game);
let json2 = JSON.stringify(game);
console.log("string contents of json2 : ", json2);
console.log("creating new go instance using json2");
const newGame2 = new go(json2);
game.playerTurn(go.BLACK, [0, 1]);
game.playerTurn(go.WHITE, [2, 2]);

console.log(game.printField());
let json = JSON.stringify(game);
console.log("type of variable json: ", typeof json);
console.log("string contents of json: ", json);
let prevGame = new go(json);

console.log("###############");
console.log("printing out previous field:");
console.log(prevGame.printField());

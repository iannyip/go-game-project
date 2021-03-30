import go from "go-game";

const game = new go(3);

// be sure to pass correct player on queue
// you can use game.currentPlayer to get one
// console.log("game object type: ", typeof game);
// let json2 = JSON.stringify(game);
// console.log("string contents of json2 : ", json2);
// console.log("creating new go instance using json2");
// const newGame2 = new go(json2);
// game.playerTurn(go.BLACK, [0, 1]);
// game.playerTurn(go.WHITE, [2, 2]);

// console.log(game.printField());
// let json = JSON.stringify(game);
// console.log("type of variable json: ", typeof json);
// console.log("string contents of json: ", json);
// let prevGame = new go(json);

// console.log("###############");
// console.log("printing out previous field:");
// console.log(prevGame.printField());

const string =
  '{"hello": {"0":4,"1":3}, "players":{"white":1,"black":0},"moves":[{"player":0,"field":[[-1,0,-1],[-1,-1,-1],[-1,-1,-1]],"score":0,"coord":[0,1]},{"player":1,"field":[[-1,0,-1],[-1,-1,-1],[-1,-1,1]],"score":0,"coord":[2,2]}],"score":{"0":0,"1":0}}';
const stringedGo = new go(string);
console.log(stringedGo.printField());
console.log(stringedGo);
const json = JSON.stringify(stringedGo);
console.log(json);

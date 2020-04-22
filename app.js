import Movable from "./movable.js";
import Infectable from "./InfectableMovable.js";
import Person from "./Person.js";
const canvas = document.getElementById("canvas");
const placeSound = new Audio("./assets/sounds/test.mp3");
const placeSound2 = new Audio("./assets/sounds/test.mp3");
const placeSound3 = new Audio("./assets/sounds/test.mp3");

window.gameLoopShouldRun = false;
window.requestAnimationFrame(gameLoop);
let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 50;

const allCollidables = [];
const losingPlayers = [];
const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;
const ctx = canvas.getContext("2d");
ctx.lineWidth = 1;

const people = [
  { name: "Pål", type: "person", monster: 3 },
  { name: "Carl", type: "person", monster: 3 },
  { name: "Bendik", type: "person", monster: 3 },
  { name: "Rolf", type: "person", monster: 3 },
  { name: "Hege", type: "person", monster: 3 },
  { name: "Ingvild", type: "person", monster: 3 },
  { name: "Espen", type: "person", monster: 3 },
  { name: "Håvard", type: "person", monster: 3 },
  { name: "Helle", type: "person", monster: 1 }
  /*  { name: "Elisabeth", type: "person", monster: 1 },
  { name: "Lucas", type: "person", monster: 1 },
  { name: "Kim", type: "person", monster: 2 },
  { name: "Hanne", type: "person", monster: 2 },
  { name: "Maren", type: "person", monster: 1 },
  { name: "Hanne L", type: "person", monster: 1 },
  { name: "Martin", type: "person", monster: 1 },
  { name: "C.G", type: "person", monster: 1 },
  { name: "Peter", type: "person", monster: 1 },
  { name: "Mads", type: "person", monster: 4 },
  { name: "Kevin", type: "person", monster: 4 },
  { name: "Cathrine", type: "person", monster: 4 },
  { name: "Sunneva", type: "person", monster: 4 },
  { name: "Demah", type: "person", monster: 2 },
  { name: "Valeria", type: "person", monster: 2 },
  { name: "Sanja", type: "person", monster: 2 },
  { name: "Kristin", type: "person", monster: 2 } */
];

for (let n of people) {
  let movable = generateMovable({
    name: n.name,
    monster: n.monster,
    isInfected: false,
    isMovable: true,
    width: canvasWidth,
    height: canvasHeight,
    ctx,
    allCollidables,
    type: n.type
  });
  allCollidables.push(movable);
}

/* ANIMATE */
async function placePlayerOnBoard(p) {
  return new Promise((res) => {
    setTimeout(() => {
      if (placeSound.paused) {
        placeSound.play();
      } else if (placeSound2.paused) {
        placeSound2.play();
      } else if (placeSound3.paused) {
        placeSound3.play();
      }
      p.draw();
      res();
    }, 250);
  });
}

async function placePlayersOnBoard() {
  for (let p of allCollidables) {
    await placePlayerOnBoard(p);
  }
}
window.placePlayersOnBoard = placePlayersOnBoard;
window.toggleGameLoop = function () {
  gameLoopShouldRun = !gameLoopShouldRun;
};

function gameLoop(timeStamp) {
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  if (gameLoopShouldRun) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    /* Check if game has ended */
    if (allCollidables.length === 1) {
      gameEnded(allCollidables, losingPlayers);
    }

    /* Remove players with no lives left */
    /* for (let p = 0; p < allCollidables.length; p++) {
      if (allCollidables[p].lives === 0) {
        let losingPlayer = allCollidables.splice(p, 1);
        losingPlayers.push(losingPlayer);
      }
    } */

    for (let i = 0; i < allCollidables.length; i++) {
      if (allCollidables[i].isMovable) {
        allCollidables[i].checkCollisions();
        allCollidables[i].update(secondsPassed);
      }
      allCollidables[i].draw(timeStamp);
    }
  }
  window.requestAnimationFrame(gameLoop);
}

const gameEnded = (allCollidables, losingPlayers) => {
  toggleGameLoop();
  console.log("The winner is: ", allCollidables[0].name);

  let all = [...allCollidables, ...losingPlayers];
  let maxPoints = all.reduce(
    (a, b) => {
      if (a.points > b.points) {
        return a;
      } else return b;
    },
    { points: 0 }
  );

  console.log("the one with most points: ", maxPoints[0].name);
};

function generateMovable({ name, monster, isInfected, isMovable = true, width, height, ctx, allCollidables, type }) {
  let { x, y } = getAvailablePosition(width, height, allCollidables);
  let startPosition = {
    x: x,
    y: y
  };
  let boardMargin = 50;
  if (startPosition.x < boardMargin) startPosition.x = boardMargin;
  if (startPosition.x > width - boardMargin) startPosition.x = width - boardMargin;
  if (startPosition.y > height - boardMargin) startPosition.y = height - boardMargin;
  if (startPosition.y < boardMargin) startPosition.y = boardMargin;
  let direction = {
    goingUp: Math.random() < 0.5 ? true : false,
    goingLeft: Math.random() < 0.5 ? true : false
  };

  return new Person({
    name,
    monster,
    losingPlayers,
    isInfected,
    ctx,
    boardSize: { width, height },
    startPosition,
    direction,
    isMovable,
    collidables: allCollidables,
    type
  });
}

function getAvailablePosition(width, height, allCollidables) {
  let x = Math.random() * width;
  let y = Math.random() * height + 50;
  let unique = true;
  for (let i = 0; i < allCollidables.length; i++) {
    /* let col = allCollidables[i];
    let squareDistance = (x - col.currentPosition.x) * (x - col.currentPosition.x) + (y - col.currentPosition.y) * (y - col.currentPosition.y);
    if (squareDistance <= (1000 + col.radius) * (1000 + col.radius)) {
      unique = false;
    } */
    let col = allCollidables[i];
    if (col.currentPosition.x >= x - 50 && col.currentPosition.x <= x + 50) {
      if (col.currentPosition.y >= y - 50 && col.currentPosition.y <= y + 50) {
        unique = false;
        console.log("overlapping: ", x, col.currentPosition.x, y, col.currentPosition.y);
        break;
      }
    }
  }
  if (unique) {
    return { x, y };
  } else {
    console.log("not unique, doing it again");
    return getAvailablePosition(width, height, allCollidables);
  }
}

/* INIT */

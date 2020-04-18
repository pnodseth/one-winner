import Movable from "./movable.js";
import Infectable from "./InfectableMovable.js";
import Person from "./Person.js";
const canvas = document.getElementById("canvas");
const placeSound = new Audio("./assets/sounds/test.mp3");
const placeSound2 = new Audio("./assets/sounds/test.mp3");
const placeSound3 = new Audio("./assets/sounds/test.mp3");
let gameLoopInterval = null;
start(canvas);

function start(canvas) {
  const allCollidables = [];
  const losingPlayers = [];
  const canvasWidth = canvas.clientWidth;
  const canvasHeight = canvas.clientHeight;
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 1;

  const people = [
    { name: "Pål", type: "person" },
    { name: "Carl", type: "person" },
    { name: "Bendik", type: "person" },
    { name: "Rolf", type: "person" },
    { name: "Hege", type: "person" },
    { name: "Ingvild", type: "person" },
    { name: "Espen", type: "person" },
    { name: "Håvard", type: "person" },
    { name: "Helle", type: "person" },
    { name: "Elisabeth", type: "person" },
    { name: "Lucas", type: "person" },
    { name: "Kim", type: "person" },
    { name: "Hanne", type: "person" },
    { name: "Maren", type: "person" },
    { name: "Hanne L", type: "person" },
    { name: "Martin", type: "person" },
    { name: "C.G", type: "person" },
    { name: "Peter", type: "person" },
    { name: "Mads", type: "person" },
    { name: "Kevin", type: "person" },
    { name: "Cathrine", type: "person" },
    { name: "Sunneva", type: "person" },
    { name: "Demah", type: "person" },
    { name: "Valeria", type: "person" },
    { name: "Sanja", type: "person" },
    { name: "Kristin", type: "person" }
  ];

  for (let n of people) {
    let movable = generateMovable({
      name: n.name,
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

  window.startGame = function () {
    gameLoopInterval = setInterval(() => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      /* Check if game has ended */
      if (allCollidables.length === 1) {
        gameEnded(allCollidables, losingPlayers);
      }

      /* Remove players with no lives left */
      for (let p = 0; p < allCollidables.length; p++) {
        if (allCollidables[p].lives === 0) {
          let losingPlayer = allCollidables.splice(p, 1);
          losingPlayers.push(losingPlayer);
        }
      }

      for (let i = 0; i < allCollidables.length; i++) {
        if (allCollidables[i].isMovable) {
          allCollidables[i].update();
        }
        allCollidables[i].checkCollisions();
        allCollidables[i].draw();
      }
    }, 1);
  };
}

const gameEnded = (allCollidables, losingPlayers) => {
  clearInterval(gameLoopInterval);
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

function generateMovable({ name, isInfected, isMovable = true, width, height, ctx, allCollidables, type }) {
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

  return new Person({ name, isInfected, ctx, boardSize: { width, height }, startPosition, direction, isMovable, collidables: allCollidables, type });
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

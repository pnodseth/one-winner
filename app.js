import Movable from "./movable.js";
const canvas = document.getElementById("canvas");

start(canvas);

function start(canvas) {
  const allCollidables = [];
  const canvasWidth = canvas.clientWidth;
  const canvasHeight = canvas.clientHeight;
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 1;

  for (let n of new Array(10)) {
    let movable = generateMovable({ isMovable: true, width: canvasWidth, height: canvasHeight, ctx, allCollidables });
    allCollidables.push(movable);
    movable.init();
  }

  for (let n of new Array(2)) {
    let movable = generateMovable({ isMovable: false, width: canvasWidth, height: canvasHeight, ctx, allCollidables, isInfected: true });
    allCollidables.push(movable);
    movable.init();
  }

  /*   for (let n of new Array(20)) {
    let movable = generateMovable({ isMovable: false, width: canvasWidth, height: canvasHeight, ctx });
    allCollidables.push(movable);
    movable.init();
  } */

  /* Infected one */
  /*   let movable = generateMovable({ isMovable: false, width: canvasWidth, height: canvasHeight, ctx, isInfected: true });
  allCollidables.push(movable);
  movable.init(); */

  /* ANIMATE */
  setInterval(() => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let i = 0; i < allCollidables.length; i++) {
      let movable = allCollidables[i];
      movable.animate();
    }
  }, 1);
}

function generateMovable({ isMovable, width, height, ctx, isInfected, allCollidables, type }) {
  let startPosition = {
    x: Math.random() * width,
    y: Math.random() * height + 50
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

  return new Movable({ ctx, boardSize: { width, height }, startPosition, direction, isMovable, isInfected, collidables: allCollidables, type });
}

/* INIT */

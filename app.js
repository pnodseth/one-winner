import Movable from "./movable.js";
const canvas = document.getElementById("canvas");
start(canvas);
function start(canvas) {
  const allCollidables = [];
  const canvasWidth = canvas.clientWidth;
  const canvasHeight = canvas.clientHeight;
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 1;

  for (let n of new Array(3)) {
    let movable = generateMovable({ isMovable: true, width: canvasWidth, height: canvasHeight, ctx, allCollidables });
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
    //ctx.beginPath();
    for (let i = 0; i < allCollidables.length; i++) {
      let movable = allCollidables[i];
      movable.animate();
    }
    //ctx.fill();
  }, 1);
}

function generateMovable({ isMovable, width, height, ctx, isInfected, allCollidables }) {
  let startPosition = {
    x: Math.random() * width,
    y: Math.random() * height + 50
  };
  let direction = {
    goingUp: Math.random() < 0.5 ? true : false,
    goingLeft: Math.random() < 0.5 ? true : false
  };

  return new Movable(ctx, { width, height }, startPosition, direction, isMovable, isInfected, allCollidables);
}

/* INIT */

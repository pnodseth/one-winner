const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
c.lineWidth = 1;

/* setInterval(() => {
  this.animate(c);
}, 1); */

class Movable {
  constructor(ctx, boardSize, startPosition, direction) {
    this.goingUp = direction.goingUp;
    this.goingLeft = direction.goingLeft;
    this.angle = {
      x: 1,
      y: 0.5
    };
    this.currentPosition = startPosition;
    this.speed = 2;
    this.board = ctx;
    this.boardSize = boardSize;
    this.radius = 10;
  }

  init() {
    console.log(this.boardBounds);
    this.board.beginPath();
    this.board.arc(this.currentPosition.x, this.currentPosition.y, this.radius, 0, 2 * Math.PI);
    this.board.fill();
  }

  get boardBounds() {
    return {
      width: this.boardSize.width - this.radius, // Add 2px security padding
      height: this.boardSize.height - this.radius // Add 2px security padding
    };
  }

  animate() {
    if (this.currentPosition.x <= this.boardBounds.width + 3 && this.currentPosition.y <= this.boardBounds.height + 3) {
      this.board.arc(this.currentPosition.x, this.currentPosition.y, this.radius, 0, 2 * Math.PI);

      if (this.currentPosition.y >= this.boardBounds.height) {
        this.board.fillStyle = "#c82124"; //red
        this.goingUp = true;
        this.angle.y = 1 - this.angle.y - (Math.random() * (0.3 - 0.1) + 0.1);
      } else if (this.currentPosition.y <= this.radius) {
        this.board.fillStyle = "blue"; //red
        this.goingUp = false;
        this.angle.y = 1 - this.angle.y;
      }

      if (this.currentPosition.x >= this.boardBounds.width) {
        this.board.fillStyle = "cyan"; //red
        this.goingLeft = true;
        this.angle.x = 1 - this.angle.x - (Math.random() * (0.15 - 0.1) + 0.1);
      } else if (this.currentPosition.x <= this.radius) {
        this.board.fillStyle = "orange"; //red
        this.goingLeft = false;
        this.angle.x = 1 - this.angle.x;
      }

      if (!this.goingUp) {
        this.currentPosition.y += this.angle.y * this.speed;
      } else {
        this.currentPosition.y -= this.angle.y * this.speed;
      }

      if (!this.goingLeft) {
        this.currentPosition.x += this.angle.x * this.speed;
      } else {
        this.currentPosition.x -= this.angle.x * this.speed;
      }
    }
  }

  test() {
    console.log("my god!");
  }
}

const width = canvas.clientWidth;
const height = canvas.clientHeight;

function generateMovable() {
  let startPosition = {
    x: Math.random() * 600 + 1,
    y: Math.random() * 600 + 1
  };
  let direction = {
    goingUp: Math.random() < 0.5 ? true : false,
    goingLeft: Math.random() < 0.5 ? true : false
  };

  return new Movable(c, { width, height }, startPosition, direction);
}

const numberOfMovable = 100;
const movables = [];

for (let n of new Array(100)) {
  let movable = generateMovable();
  movables.push(movable);
  movable.init();
}

setInterval(() => {
  c.clearRect(0, 0, width, height);
  c.beginPath();
  for (let i = 0; i < movables.length; i++) {
    let movable = movables[i];
    movable.animate();
  }

  c.fill();
}, 1);

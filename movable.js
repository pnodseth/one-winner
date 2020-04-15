const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
c.lineWidth = 1;

/* setInterval(() => {
  this.animate(c);
}, 1); */

class Movable {
  constructor(ctx, boardSize, startPosition, direction, isMovable) {
    this.id = generateRandomId();
    this.goingUp = this.goingUp = direction.goingUp;
    this.goingLeft = direction.goingLeft;
    this.angle = {
      x: 1,
      y: 0.5
    };
    this.currentPosition = startPosition;
    this.speed = 2;
    this.board = ctx;
    this.boardSize = boardSize;
    this.radius = 50;
    this.isMovable = isMovable;
  }

  init() {
    console.log(this.boardBounds);
    this.board.moveTo(this.currentPosition.x, this.currentPosition.y);
    this.board.arc(this.currentPosition.x, this.currentPosition.y, this.radius, 0, 2 * Math.PI);
  }

  get boardBounds() {
    return {
      width: this.boardSize.width - this.radius, // Add 2px security padding
      height: this.boardSize.height - this.radius // Add 2px security padding
    };
  }

  animate() {
    if (this.isMovable) {
      if (this.currentPosition.x <= this.boardBounds.width + 3 && this.currentPosition.y <= this.boardBounds.height + 3) {
        this.board.moveTo(this.currentPosition.x, this.currentPosition.y);
        this.board.arc(this.currentPosition.x, this.currentPosition.y, this.radius, 0, 2 * Math.PI);

        if (this.currentPosition.y >= this.boardBounds.height) {
          this.goingUp = true;
          this.angle.y = 1 - this.angle.y - (Math.random() * (0.3 - 0.1) + 0.1);
        } else if (this.currentPosition.y <= this.radius) {
          this.goingUp = false;
          this.angle.y = 1 - this.angle.y;
        }

        if (this.currentPosition.x >= this.boardBounds.width) {
          this.goingLeft = true;
          this.angle.x = 1 - this.angle.x - (Math.random() * (0.15 - 0.1) + 0.1);
        } else if (this.currentPosition.x <= this.radius) {
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

      /* PAINT NOW MOVABLES */
    } else {
      this.board.moveTo(this.currentPosition.x, this.currentPosition.y);
      this.board.arc(this.currentPosition.x, this.currentPosition.y, this.radius, 0, 2 * Math.PI);
    }
  }

  checkIfReachedBoarders

  test() {
    console.log("my god!");
  }
}

const width = canvas.clientWidth;
const height = canvas.clientHeight;

function generateMovable({ isMovable }) {
  let startPosition = {
    x: Math.random() * 600 + 50,
    y: Math.random() * 600 + 50
  };
  let direction = {
    goingUp: Math.random() < 0.5 ? true : false,
    goingLeft: Math.random() < 0.5 ? true : false
  };

  return new Movable(c, { width, height }, startPosition, direction, isMovable);
}

const movables = [];

/* for (let n of new Array(2)) {
  let movable = generateMovable();
  movables.push(movable);
  movable.init();
} */

let movable1 = generateMovable({ isMovable: true });
let movable2 = generateMovable({ isMovable: false });

movables.push(movable1, movable2);

/* INIT */
c.beginPath();
for (let m of movables) {
  m.init();
}
c.fill();

/* ANIMATE */
setInterval(() => {
  c.clearRect(0, 0, width, height);
  c.beginPath();
  for (let i = 0; i < movables.length; i++) {
    let movable = movables[i];
    movable.animate();
  }

  c.fill();
}, 1);

window.movables = movables;

function generateRandomId() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

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
    this.speed = 1;
    this.board = ctx;
    this.boardSize = boardSize;
    this.radius = 5;
    this.isMovable = isMovable;
  }

  init() {
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
      if (this.currentPosition.x <= this.boardBounds.width + 10 && this.currentPosition.y <= this.boardBounds.height + 10) {
        this.board.moveTo(this.currentPosition.x, this.currentPosition.y);
        this.board.arc(this.currentPosition.x, this.currentPosition.y, this.radius, 0, 2 * Math.PI);

        this.checkIfReachedBounds();
        this.checkCollisions();
        this.updateXandYPosition();
      }

      /* PAINT NOW MOVABLES */
    } else {
      this.board.moveTo(this.currentPosition.x, this.currentPosition.y);
      this.board.arc(this.currentPosition.x, this.currentPosition.y, this.radius, 0, 2 * Math.PI);
    }
  }

  checkCollisions() {
    let collided = false;
    for (let m of movables) {
      if (m.id !== this.id) {
        let padding = (m.radius + this.radius) * 0.85;
        let collidedOnLeftSide = this.currentPosition.x < m.currentPosition.x + padding && this.currentPosition.x > m.currentPosition.x; //correct
        let collidedOnRightSide = this.currentPosition.x > m.currentPosition.x - padding && this.currentPosition.x < m.currentPosition.x; // corect

        let collidedOnTopSide = this.currentPosition.y < m.currentPosition.y + padding && this.currentPosition.y > m.currentPosition.y;
        let collidedOnBottomSide = this.currentPosition.y < m.currentPosition.y && this.currentPosition.y > m.currentPosition.y - padding;

        if (collidedOnLeftSide && collidedOnTopSide) {
          let xDiff = this.currentPosition.x - m.currentPosition.x;
          let yDiff = this.currentPosition.y - m.currentPosition.y;
          if (xDiff > yDiff) {
            this.goingLeft = false;
          } else {
            this.goingUp = false;
          }
        } else if (collidedOnLeftSide && collidedOnBottomSide) {
          let xDiff = this.currentPosition.x - m.currentPosition.x;
          let yDiff = m.currentPosition.y - this.currentPosition.y;
          if (xDiff > yDiff) {
            this.goingLeft = false;
          } else {
            this.goingUp = true;
          }
        } else if (collidedOnRightSide && collidedOnTopSide) {
          let xDiff = m.currentPosition.x - this.currentPosition.x;
          let yDiff = this.currentPosition.y - m.currentPosition.y;
          if (xDiff > yDiff) {
            this.goingLeft = true;
          } else {
            this.goingUp = false;
          }
        } else if (collidedOnRightSide && collidedOnBottomSide) {
          let xDiff = m.currentPosition.x - this.currentPosition.x;
          let yDiff = m.currentPosition.y - this.currentPosition.y;
          if (xDiff > yDiff) {
            this.goingLeft = true;
          } else {
            this.goingUp = true;
          }
        }
      }
    }
    return collided;
  }

  updateXandYPosition() {
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

  checkIfReachedBounds() {
    /* Check if we're reached the top */
    if (this.currentPosition.y <= this.radius) {
      this.goingUp = false;
      this.angle.y = 1 - this.angle.y;
    }

    /* Check if we've reached the bottom */
    if (this.currentPosition.y >= this.boardBounds.height) {
      this.goingUp = true;
      this.angle.y = 1 - this.angle.y - (Math.random() * (0.3 - 0.1) + 0.1);
    }

    /* Check if we've reached left or right bound */
    if (this.currentPosition.x >= this.boardBounds.width) {
      this.goingLeft = true;
      this.angle.x = 1 - this.angle.x - (Math.random() * (0.15 - 0.1) + 0.1);
    } else if (this.currentPosition.x <= this.radius) {
      this.goingLeft = false;
      this.angle.x = 1 - this.angle.x;
    }
  }
}

const canvas = document.getElementById("canvas");
const movables = [];
start(canvas);

function start(canvas) {
  const canvasWidth = canvas.clientWidth;
  const canvasHeight = canvas.clientHeight;
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 1;

  for (let n of new Array(505)) {
    let movable = generateMovable({ isMovable: true, width: canvasWidth, height: canvasHeight, ctx });
    movables.push(movable);
    movable.init();
  }

  /* ANIMATE */
  setInterval(() => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.beginPath();
    for (let i = 0; i < movables.length; i++) {
      let movable = movables[i];
      movable.animate();
    }
    ctx.fill();
  }, 1);
}

function generateMovable({ isMovable, width, height, ctx }) {
  let startPosition = {
    x: Math.random() * width,
    y: Math.random() * height + 50
  };
  let direction = {
    goingUp: Math.random() < 0.5 ? true : false,
    goingLeft: Math.random() < 0.5 ? true : false
  };

  return new Movable(ctx, { width, height }, startPosition, direction, isMovable);
}

/* INIT */

function generateRandomId() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

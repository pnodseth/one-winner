export default class Movable {
  constructor({ ctx, boardSize, startPosition, direction, isMovable, isInfected = false, collidables = [], type = "circle" }) {
    this.id = this.generateRandomId();
    this.goingUp = this.goingUp = direction.goingUp;
    this.goingLeft = direction.goingLeft;
    this.angle = {
      x: 1,
      y: 0.5
    };
    this.currentPosition = startPosition;
    this.speed = 1.5;
    this.board = ctx;
    this.boardSize = boardSize;
    this.radius = 50;
    this.isMovable = isMovable;
    this.collidables = collidables;
    this.type = type;
    this.fillColor = "#333";
    this.isColliding = false;
  }

  setPosition(x, y) {
    this.currentPosition.x = x;
    this.currentPosition.y = y;
  }

  get boardBounds() {
    return {
      width: this.boardSize.width - this.radius, // Add 2px security padding
      height: this.boardSize.height - this.radius // Add 2px security padding
    };
  }

  draw() {
    if (this.type === "circle") {
      this.board.fillStyle = this.fillColor;
      this.board.beginPath();
      this.board.arc(this.currentPosition.x, this.currentPosition.y, this.radius, 0, 2 * Math.PI);
      this.board.fill();
    }

    this.onDraw();
  }

  onInit() {}
  onAnimate() {}
  onDraw() {}
  onCollision() {}

  checkCollisions() {
    for (let m of this.collidables) {
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
          this.onCollision(m);
          return;
        } else if (collidedOnLeftSide && collidedOnBottomSide) {
          let xDiff = this.currentPosition.x - m.currentPosition.x;
          let yDiff = m.currentPosition.y - this.currentPosition.y;
          if (xDiff > yDiff) {
            this.goingLeft = false;
          } else {
            this.goingUp = true;
          }
          //this.onCollision(m);
          return;
        } else if (collidedOnRightSide && collidedOnTopSide) {
          let xDiff = m.currentPosition.x - this.currentPosition.x;
          let yDiff = this.currentPosition.y - m.currentPosition.y;
          if (xDiff > yDiff) {
            this.goingLeft = true;
          } else {
            this.goingUp = false;
          }
          //this.onCollision(m);
          return;
        } else if (collidedOnRightSide && collidedOnBottomSide) {
          let xDiff = m.currentPosition.x - this.currentPosition.x;
          let yDiff = m.currentPosition.y - this.currentPosition.y;
          if (xDiff > yDiff) {
            this.goingLeft = true;
          } else {
            this.goingUp = true;
          }
          //this.onCollision(m);
          return;
        }
      }
    }
    this.checkIfReachedBounds();
    return null;
  }

  update() {
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
    if (this.currentPosition.y <= 0 + this.radius) {
      this.goingUp = false;
      this.angle.y = 1 - this.angle.y;
    }

    /* Check if we've reached the bottom */
    if (this.currentPosition.y >= this.boardBounds.height - this.radius) {
      this.goingUp = true;
      this.angle.y = 1 - this.angle.y - (Math.random() * (0.3 - 0.1) + 0.1);
    }

    /* Check if we've reached left or right bound */
    if (this.currentPosition.x >= this.boardBounds.width - this.radius) {
      this.goingLeft = true;
      this.angle.x = 1 - this.angle.x - (Math.random() * (0.15 - 0.1) + 0.1);
    } else if (this.currentPosition.x <= 0 + this.radius) {
      this.goingLeft = false;
      this.angle.x = 1 - this.angle.x;
    }
  }

  generateRandomId() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}

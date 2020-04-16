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
    this.speed = 1;
    this.board = ctx;
    this.boardSize = boardSize;
    this.radius = 50;
    this.isMovable = isMovable;
    this.isInfected = isInfected;
    this.showInfection = isInfected ? true : false;
    this.collidables = collidables;
    this.type = type;
  }

  init() {
    this.render();
  }

  get boardBounds() {
    return {
      width: this.boardSize.width - this.radius, // Add 2px security padding
      height: this.boardSize.height - this.radius // Add 2px security padding
    };
  }

  render() {
    if (this.type === "circle") {
      this.board.fillStyle = this.getFillColor();
      this.board.beginPath();
      this.board.arc(this.currentPosition.x, this.currentPosition.y, this.radius, 0, 2 * Math.PI);
      this.board.fill();
    } else if (this.type === "rect") {
    }
  }

  animate() {
    if (this.currentPosition.x <= this.boardBounds.width + 10 && this.currentPosition.y <= this.boardBounds.height + 10) {
      this.render();

      if (this.isMovable) {
        this.checkIfReachedBounds();
        let collidedWith = this.checkCollisions();
        if (collidedWith) {
          if (this.isInfected && !collidedWith.isInfected) {
            collidedWith.isInfected = true;
            setTimeout(() => {
              collidedWith.showInfection = true;
            }, 10000);
          }
        }
        this.updateXandYPosition();
      }
    }
  }

  getFillColor() {
    if (this.isInfected && this.showInfection) return "tomato";
    else return "#333";
  }

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
          return m;
        } else if (collidedOnLeftSide && collidedOnBottomSide) {
          let xDiff = this.currentPosition.x - m.currentPosition.x;
          let yDiff = m.currentPosition.y - this.currentPosition.y;
          if (xDiff > yDiff) {
            this.goingLeft = false;
          } else {
            this.goingUp = true;
          }
          return m;
        } else if (collidedOnRightSide && collidedOnTopSide) {
          let xDiff = m.currentPosition.x - this.currentPosition.x;
          let yDiff = this.currentPosition.y - m.currentPosition.y;
          if (xDiff > yDiff) {
            this.goingLeft = true;
          } else {
            this.goingUp = false;
          }
          return m;
        } else if (collidedOnRightSide && collidedOnBottomSide) {
          let xDiff = m.currentPosition.x - this.currentPosition.x;
          let yDiff = m.currentPosition.y - this.currentPosition.y;
          if (xDiff > yDiff) {
            this.goingLeft = true;
          } else {
            this.goingUp = true;
          }
          return m;
        }
      }
    }
    return null;
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

  generateRandomId() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}

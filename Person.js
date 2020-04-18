import Infectable from "./InfectableMovable.js";

export default class Person extends Infectable {
  constructor({ name, ...opts }) {
    super(opts);
    this.name = name;
    this.image = new Image();
    this.lives = 5;
    this.points = 0;
  }

  onDraw() {
    if (this.lives > 2) {
      this.board.fillStyle = this.fillColor;
    } else if (this.lives === 2) {
      this.board.fillStyle = "pink";
    } else if (this.lives === 1) {
      this.board.fillStyle = "red";
    }

    this.board.beginPath();
    this.board.arc(this.currentPosition.x, this.currentPosition.y, this.radius, 0, 2 * Math.PI);
    this.board.fill();

    this.board.beginPath();
    if (this.isColliding) {
      this.board.fillStyle = "red";
    } else {
      this.board.fillStyle = "yellow";
    }
    this.board.font = "bold 32px Verdana";
    this.board.textAlign = "center";
    this.board.fillText(this.name, this.currentPosition.x, this.currentPosition.y);
    this.board.fillText(this.lives, this.currentPosition.x, this.currentPosition.y + 30);
    this.board.fill();
  }

  onCollision(collidedWith) {
    if (collidedWith) {
      if (!this.isColliding) {
        this.lives -= 1;
        collidedWith.points += 1;
      }
      this.isColliding = true;
      setTimeout(() => {
        this.isColliding = false;
      }, 300);
    }
  }
}

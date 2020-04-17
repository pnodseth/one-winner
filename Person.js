import Infectable from "./InfectableMovable.js";

export default class Person extends Infectable {
  constructor({ name, ...opts }) {
    super(opts);
    this.name = name;
  }

  onRender() {
    this.board.beginPath();
    this.board.fillStyle = "red";
    this.board.font = "bold 32px Verdana";
    this.board.textAlign = "center";
    this.board.fillText(this.name, this.currentPosition.x, this.currentPosition.y);
    this.board.fill();
  }

  onAnimate({ collidedWith }) {
    if (collidedWith) {
      if (this.isInfected && !collidedWith.isInfected) {
        collidedWith.setInfected(true);
      }
    }
  }

  onAnimate({ collidedWith }) {
    if (collidedWith) {
      if (this.isInfected && !collidedWith.isInfected) {
        collidedWith.setInfected(true);
      }
    }
  }
}

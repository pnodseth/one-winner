import Movable from "./movable.js";

export default class Infectable extends Movable {
  constructor({ isInfected, ...movableOpts }) {
    super(movableOpts);
    this.isInfected = isInfected;
    this.showInfection = isInfected ? true : false;

    if (isInfected) {
      this.fillColor = "tomato";
    }
  }

  onCollision(collidedWith) {
    if (collidedWith) {
      if (this.isInfected && !collidedWith.isInfected) {
        collidedWith.setInfected(true);
      }
    }
  }

  setInfected(isInfected) {
    if (isInfected) this.isInfected = true;
    this.showInfection = true;
    this.fillColor = "tomato";
  }
}

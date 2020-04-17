import Movable from "./movable.js";

export default class Infectable extends Movable {
  constructor({ isInfected, ...movableOpts }) {
    super(movableOpts);
    this.isInfected = isInfected;
    this.showInfection = isInfected ? true : false;
  }

  onInit() {
    if (this.isInfected) {
      this.fillColor = "tomato";
    }
  }

  onAnimate({ collidedWith }) {
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

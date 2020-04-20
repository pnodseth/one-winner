import Infectable from "./InfectableMovable.js";

export default class Person extends Infectable {
  constructor({ name, monster = 1, ...opts }) {
    super(opts);
    this.name = name;
    this.image = new Image();
    this.lives = 2;
    this.points = 0;
    this.isAttacking = false;
    this.spritesRunning = [];
    this.spritesHurt = [];
    this.spritesAttacking = [];
    this.spritesDying = [];
    this.monster = monster;
    /* Walking */
    for (let i = 0; i < 16; i++) {
      let sprite = new Image();
      //let url = `./assets/prites/boy/Run (${i}).png`;
      let url = `./assets/prites/Land Monster - ${this.monster}/PNG Sequences/Walking/Walking_${i}.png`;
      sprite.src = url;
      this.spritesRunning.push(sprite);
    }
    /* Hurt */
    for (let i = 0; i < 11; i++) {
      let sprite = new Image();
      //let url = `./assets/prites/boy/Dead (${i}).png`;
      let url = `./assets/prites/Land Monster - ${this.monster}/PNG Sequences/Hurt/Hurt_${i}.png`;
      sprite.src = url;
      this.spritesHurt.push(sprite);
    }
    /* Attacking */
    for (let i = 0; i < 11; i++) {
      let sprite = new Image();
      //let url = `./assets/prites/boy/Dead (${i}).png`;
      let url = `./assets/prites/Land Monster - ${this.monster}/PNG Sequences/Attacking/Attacking_${i}.png`;
      sprite.src = url;
      this.spritesAttacking.push(sprite);
    }
    /* DYING */
    for (let i = 0; i < 14; i++) {
      let sprite = new Image();
      //let url = `./assets/prites/boy/Dead (${i}).png`;
      let url = `./assets/prites/Land Monster - ${this.monster}/PNG Sequences/Dying/Dying_${i}.png`;
      sprite.src = url;
      this.spritesDying.push(sprite);
    }

    this.runningCount = 1;
    this.collidingCount = 1;
    this.spriteNumber = 1;
  }

  onDraw(timeStamp) {
    /* Sprite */
    this.runningCount++;
    if (this.runningCount > 16) {
      this.runningCount = 1;
    }

    if (this.runningCount > 2) {
      this.spriteNumber++;
      if (this.spriteNumber > 13) {
        this.spriteNumber = 1;
      }
    }

    if (this.isColliding) {
      if (this.collidingCount < 10) {
        this.collidingCount++;
      }

      if (this.isColliding) {
        if (this.lives === 1) {
          this.board.drawImage(this.spritesHurt[this.collidingCount], this.currentPosition.x, this.currentPosition.y, 150, 138);
        } else {
          this.board.drawImage(this.spritesDying[this.collidingCount], this.currentPosition.x, this.currentPosition.y, 150, 138);
        }
      }
    } else if (this.isAttacking) {
      this.board.drawImage(this.spritesAttacking[this.collidingCount], this.currentPosition.x, this.currentPosition.y, 150, 138);
    } else {
      this.board.drawImage(this.spritesRunning[this.spriteNumber], this.currentPosition.x, this.currentPosition.y, 150, 138);
    }

    /* Text */
    this.board.beginPath();
    if (this.isColliding) {
      this.board.fillStyle = "red";
    } else {
      this.board.fillStyle = "#333";
    }
    this.board.font = "bold 32px Verdana";
    this.board.textAlign = "center";
    this.board.fillText(this.name, this.currentPosition.x, this.currentPosition.y);
    this.board.fillText(this.lives, this.currentPosition.x, this.currentPosition.y + 30);
    this.board.fill();
  }

  onUpdate(secondsPassed) {
    if (!this.isColliding && !this.isAttacking) {
      if (!this.goingUp) {
        this.currentPosition.y += this.angle.y * (this.speed * secondsPassed);
      } else {
        this.currentPosition.y -= this.angle.y * (this.speed * secondsPassed);
      }

      if (!this.goingLeft) {
        this.currentPosition.x += this.angle.x * (this.speed * secondsPassed);
      } else {
        this.currentPosition.x -= this.angle.x * (this.speed * secondsPassed);
      }
    }
  }

  onCollision(collidedWith) {
    if (collidedWith) {
      if (!this.isColliding) {
        this.lives -= 1;
        collidedWith.points += 1;
        collidedWith.isAttacking = true;
      }
      this.isColliding = true;
      setTimeout(() => {
        this.isColliding = false;
        collidedWith.isAttacking = false;
      }, 500);
    }
  }
}

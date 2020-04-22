import Infectable from "./InfectableMovable.js";

const playerStates = {
  idle: "idle",
  walking: "walking",
  attacking: "attacking",
  beingAttacked: "beingAttacked",
  dying: "dying",
  dead: "dead"
};
export default class Person extends Infectable {
  constructor({ name, monster = 1, losingPlayers, ...opts }) {
    super(opts);
    this.name = name;
    this.image = new Image();
    this.lives = 5;
    this.points = 0;
    this.isAttacking = false;
    this.currentPlayerState = playerStates.walking;

    this.spritesRunning = [];
    this.spritesHurt = [];
    this.spritesAttacking = [];
    this.spritesDying = [];
    this.spritesDead = [];
    this.monsterType = monster;
    this.losingPlayers = losingPlayers;
    this.isSpriteFlipped = true;

    /* Walking */
    for (let i = 0; i < 16; i++) {
      let sprite = new Image();
      //let url = `./assets/prites/boy/Run (${i}).png`;
      let url = `./assets/prites/Land Monster - ${this.monsterType}/PNG Sequences/Walking/Walking_${i}.png`;
      sprite.src = url;
      this.spritesRunning.push(sprite);
    }
    /* Hurt */
    for (let i = 0; i < 11; i++) {
      let sprite = new Image();
      //let url = `./assets/prites/boy/Dead (${i}).png`;
      let url = `./assets/prites/Land Monster - ${this.monsterType}/PNG Sequences/Hurt/Hurt_${i}.png`;
      sprite.src = url;
      this.spritesHurt.push(sprite);
    }
    /* Attacking */
    for (let i = 0; i < 11; i++) {
      let sprite = new Image();
      //let url = `./assets/prites/boy/Dead (${i}).png`;
      let url = `./assets/prites/Land Monster - ${this.monsterType}/PNG Sequences/Attacking/Attacking_${i}.png`;
      sprite.src = url;
      this.spritesAttacking.push(sprite);
    }
    /* DYING */
    for (let i = 0; i < 14; i++) {
      let sprite = new Image();
      //let url = `./assets/prites/boy/Dead (${i}).png`;
      let url = `./assets/prites/Land Monster - ${this.monsterType}/PNG Sequences/Dying/Dying_${i}.png`;
      sprite.src = url;
      this.spritesDying.push(sprite);
    }

    /* DEAD */
    for (let i = 0; i < 9; i++) {
      let sprite = new Image();
      //let url = `./assets/prites/boy/Dead (${i}).png`;
      let url = `./assets/prites/Land Monster - ${this.monsterType}/PNG Sequences/Smoke/Smoke_${i}.png`;
      sprite.src = url;
      this.spritesDead.push(sprite);
    }

    this.runningCount = 1;
    this.spriteCount = 1;
  }

  onDraw(timeStamp) {
    /* Sprite */
    this.board.save();
    //this.board.rotate((20 * Math.PI) / 180);
    this.board.this.spriteCount = Math.floor(this.runningCount / 2);
    /* Walking around */
    if (this.currentPlayerState === playerStates.walking) {
      if (this.spriteCount >= this.spritesRunning.length - 1) {
        this.runningCount = 0;
      }
      this.board.drawImage(this.spritesRunning[this.spriteCount], this.currentPosition.x, this.currentPosition.y, 150, 138);
    }

    /* Is attacking */
    if (this.currentPlayerState === playerStates.attacking) {
      this.board.drawImage(this.spritesAttacking[this.spriteCount], this.currentPosition.x, this.currentPosition.y, 150, 138);

      if (this.spriteCount === this.spritesAttacking.length - 1) {
        this.doNotUpdateCounter = true; // If we reached end of animation sprites, keep showing last frame
      }

      /* Being attacked */
    } else if (this.currentPlayerState === playerStates.beingAttacked) {
      if (this.spriteCount === this.spritesHurt.length - 1) {
        this.doNotUpdateCounter = true; // If we reached end of animation sprites, keep showing last frame
      }

      this.board.drawImage(this.spritesHurt[this.spriteCount], this.currentPosition.x, this.currentPosition.y, 150, 138);

      /* Dying */
    } else if (this.currentPlayerState === playerStates.dying) {
      if (this.spriteCount === this.spritesDying.length - 1) {
        this.doNotUpdateCounter = true; // If we reached end of animation sprites, keep showing last frame
      }

      this.board.drawImage(this.spritesDying[this.spriteCount], this.currentPosition.x, this.currentPosition.y, 150, 138);

      /* Dead */
    } else if (this.currentPlayerState === playerStates.dead) {
      if (this.spriteCount === this.spritesDead.length - 1) {
        this.doNotUpdateCounter = true; // If we reached end of animation sprites, keep showing last frame
      }

      this.board.drawImage(this.spritesDead[this.spriteCount], this.currentPosition.x, this.currentPosition.y, 150, 138);
    }

    /* Text */
    this.board.beginPath();
    if (this.currentPlayerState === playerStates.beingAttacked) {
      this.board.fillStyle = "red";
    } else {
      this.board.fillStyle = "#333";
    }
    this.board.font = "bold 32px Verdana";
    this.board.textAlign = "center";
    this.board.fillText(this.name, this.currentPosition.x, this.currentPosition.y);
    this.board.fillText(this.lives, this.currentPosition.x, this.currentPosition.y + 30);
    this.board.fill();

    this.board.restore();
  }

  onUpdate(secondsPassed) {
    if (this.currentPlayerState === playerStates.walking || this.currentPlayerState === playerStates.attacking) {
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
    if (!this.doNotUpdateCounter) {
      this.runningCount++;
    } else {
      this.doNotUpdateCounter = false;
    }
  }

  onCollision(collidedWith) {
    if (collidedWith) {
      /* Player is walking,  */
      if (this.currentPlayerState === playerStates.walking) {
        this.lives -= 1;
        if (this.lives > 1) {
          this.currentPlayerState = playerStates.beingAttacked;
        } else {
          this.currentPlayerState = playerStates.dying;

          /* Show dead animation */
          setTimeout(() => {
            this.currentPlayerState = playerStates.dead;
            this.runningCount = 1;
          }, 300);

          setTimeout(() => {
            let losingPlayer = this.collidables.splice(
              this.collidables.findIndex((e) => e.id === this.id),
              1
            );
            this.losingPlayers.push(losingPlayer);
          }, 500);
        }

        this.runningCount = 1; // Set running count at 1 so new animation can start at beginning

        collidedWith.points += 1;
        collidedWith.currentPlayerState = playerStates.attacking;
        collidedWith.runningCount = 1;

        setTimeout(() => {
          this.currentPlayerState = playerStates.walking;
          collidedWith.currentPlayerState = playerStates.walking;
        }, 500);
      }
    }

    /* if (collidedWith) {
      if (this.lives >= 1) {
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
    } */
  }
}

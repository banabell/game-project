// CANVAS
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// GLOBAL VARIABLES
let frames = 0;

// GAME STATE
const state = {
  current: 0,
  start: 0,
  gameLevelOne: 1,
  startLevelTwo: 2,
  gameLevelTwo: 3,
  startLevelThree: 4,
  gameLevelThree: 5,
  win: 6,
  over: 7,
};

// ONCLICK EVENT ON CANVAS
canvas.onclick = function (e) {
  switch (state.current) {
    case state.start: state.current = state.gameLevelOne; frames = 0; backgroundSound.play();
      document.getElementById('message').innerHTML = "";
      break;
    case state.over:
      score.reset();
      mainCharacter.reset();
      obstacle.reset();
      state.current = state.start;
      backgroundSound.currentTime = 0;
      // frames = 0;
      break;
    case state.startLevelTwo:
      backgroundSound.play();
      score.current = score.beginLevelTwo;
      scoreCounterSound.play();
      state.current = state.gameLevelTwo;
      score.best = Math.max(score.current, score.best);
      localStorage.setItem('best', score.best);
      mainCharacter.reset();
      obstacle.reset();
      break;
    case state.startLevelThree:
      backgroundSound.play();
      score.current = score.beginLevelThree;
      state.current = state.gameLevelThree;
      score.best = Math.max(score.current, score.best);
      localStorage.setItem('best', score.best);
      mainCharacter.reset();
      obstacle.reset();
      break;
    case state.win:
      score.reset();
      mainCharacter.reset();
      obstacle.reset();
      state.current = state.start;
      backgroundSound.pause();
      backgroundSound.currentTime = 0;
      break;
  }
};


// LOAD BACKGROUND IMAGE
const backgroundImg = new Image();
backgroundImg.src = "./img/testbackground.png";

// LOAD A PLAY BUTTON
const playButtonImg = new Image();
playButtonImg.src = "./img/playbutton.png"

// LOAD A RESTART BUTTON
const retartButtonImg = new Image();
retartButtonImg.src = "./img/restart.png"

// LOAD CHARACTER SPRITE SHEET
const mainCharacterImg = new Image();
mainCharacterImg.src = "./img/ApeanautSprite.png"

// LOAD OBSTACLE
const obstacleImg = new Image();
obstacleImg.src = "./img/satellite3.png";

// LOAD IMAGE FOR LEVEL SCREENS
const levelUpImg = new Image();
levelUpImg.src = "./img/levelUp.png";

// LOAD OBSTACLE BUMP MUSIC
const bump = new Audio();
bump.src = "./audio/bump.wav";
bump.volume = 1;

// LOAD LEVEL UP MUSIC
const levelUpSound = new Audio();
levelUpSound.src = "./audio/levelUp.wav";
levelUpSound.loop = false;

// LOAD GAME OVER MUSIC
const gameOverSound = new Audio();
gameOverSound.src = "./audio/gameover.wav";

// LOAD SCORE COUNTER MUSIC
const scoreCounterSound = new Audio();
scoreCounterSound.src = "./audio/scoreCounter.wav";

// LOAD BACKGROUND MUSIC
const backgroundSound = new Audio();
backgroundSound.src = "./audio/backgroundSoundLong.wav";
backgroundSound.loop = true;
backgroundSound.volume = 0.5;

// LOAD WINNING SOUND
const winningSound = new Audio();
winningSound.src = "./audio/winning.mp3";


// SCORE (DOM)
const score = {
  current: 0,
  best: parseInt(localStorage.getItem('best')) || 0,
  endLevelOne: 3,
  beginLevelTwo: 20,
  endLevelTwo: 21,
  beginLevelThree: 40,
  endLevelThree: 41,

  update() {
    // UPDATE SCOREBOARD IN DOM
    let currentScore = document.getElementById('currentScore');
    currentScore.innerHTML = this.current;

    let bestScore = document.getElementById('bestScore');
    bestScore.innerHTML = this.best;

    // CHANGE TO LEVEL 2 STATE
    if (obstacle.position.length === 0 && this.current >= this.endLevelOne && this.current < this.beginLevelTwo) {
      if (state.current != state.startLevelTwo) {
        levelUpSound.play()
      }
      state.current = state.startLevelTwo;
      backgroundSound.pause();

    }

    // CHANGE TO LEVEL 3 STATE
    if (obstacle.position.length === 0 && this.current >= this.endLevelTwo && this.current < this.beginLevelThree) {
      if (state.current != state.startLevelThree) {
        levelUpSound.play()
      }
      state.current = state.startLevelThree;
      backgroundSound.pause();
    }

    // CHANGE TO WIN STATE
    if (obstacle.position.length === 0 && this.current >= this.endLevelThree) {
      if (state.current != state.win) {
        winningSound.play();
        state.current = state.win;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: {
            y: 0.6
          }
        });
      }

    }
  },

  reset() {
    score.current = 0;
  }
};



// MESSAGES(DOM) 
const messageTxt = {
  messages: ["Welcome to SPACE APE. Enoy the game!"],
  randomMessage: '',
  j: 0,


  createRandomMessage() {
    let randonIndex = Math.floor(Math.random() * messageTxt.messages.length);
    messageTxt.randomMessage = messageTxt.messages[randonIndex]
  },


  typing() {
    if (state.current === state.start) {
      if (messageTxt.j < messageTxt.randomMessage.length) {
        document.getElementById('message').innerHTML += messageTxt.randomMessage.charAt(messageTxt.j);
        messageTxt.j++
        setTimeout(messageTxt.typing, 200)
      }
    }
  }
};
messageTxt.createRandomMessage()
messageTxt.typing()

// BACKGROUND
const background = {
  w: canvas.width,
  h: canvas.height,
  x1: 0,
  x2: 800,
  y: 0,
  dx: 2,


  draw() {
    if (state.current === state.start) {
      ctx.drawImage(backgroundImg, 0, 0, this.w, this.h);
      ctx.drawImage(backgroundImg, this.w, 0, this.w, this.h);
    }
  },

  // LOOPING BACKGROUND IMAGE
  update() {
    if (state.current === state.gameLevelOne || state.current === state.gameLevelTwo || state.current === state.gameLevelThree) {

      ctx.drawImage(backgroundImg, this.x1--, 0, this.w, this.h);
      ctx.drawImage(backgroundImg, this.x2--, 0, this.w, this.h);
      if (this.x1 <= 1 - this.w) {
        this.x1 = this.w;
      }
      if (this.x2 <= 1 - this.w) {
        this.x2 = this.w;
      }
    }
  }
};


// MAIN CHARACTER
const mainCharacter = {
  animation: [
    { sX: 0, sY: 0 },
    { sX: 70, sY: 0 },
    { sX: 140, sY: 0 },
    { sX: 210, sY: 0 },
    { sX: 280, sY: 0 },
    { sX: 350, sY: 0 },
  ],

  x: 50,
  y: 150,
  w: 50,
  h: 70,

  speed: 0,
  gravity: 0.0005,

  dx: 15,
  dy: 15,

  frame: 0,


  draw() {
    let mainCharacter = this.animation[this.frame]
    ctx.drawImage(mainCharacterImg, mainCharacter.sX, mainCharacter.sY, this.w, this.h, this.x, this.y, this.w, this.h)

    if (state.current === state.startLevelTwo || state.current === state.startLevelThree) {
      ctx.drawImage(mainCharacterImg, mainCharacter.sX, mainCharacter.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    }
  },

  update() {
    // ANIMATE THE MAIN CHARACTER 
    if (state.current === state.start || state.current === state.gameLevelOne || state.current === state.gameLevelTwo || state.current === state.gameLevelThree) {
      if (frames % 5 === 0) {
        this.frame += 1;
      }
      if (this.frame === this.animation.length) {
        this.frame = 0;
      }
    }

    // RESET Y POSITION WHEN IN START STATE
    if (state.current === state.start) {
      this.y = 150;
    }

    // GRAVITY ON CHARACTER
    if (state.current === state.gameLevelOne || state.current === state.gameLevelTwo || state.current === state.gameLevelThree) {
      this.speed += this.gravity;
      this.y += this.speed;
      if (this.y + this.h + 20 >= canvas.height) {

        if (state.current !== state.over) {
          gameOverSound.play();
        }
        state.current = state.over;
        backgroundSound.pause();
      }

      // GAME OVER IF OFF THE LEFT SIDE OF THE CANVAS / COMMENT OUT FOR DEMO
      // if (this.x < 0) {

      //   if (state.current !== state.over) {
      //     gameOverSound.play();
      //   }
      //   state.current = state.over;
      //   backgroundSound.pause();
      // }

      // GAME OVER IF OFF THE TOP OF THE CANVAS / COMMENT OUT FOR DEMO

      // if (this.y < 0) {

      //   if (state.current !== state.over) {
      //     gameOverSound.play();
      //   }
      //   state.current = state.over;
      // backgroundSound.pause();
      
      // }


    }
  },

  moveUp() {
    this.y -= this.dy;
  },

  moveDown() {
    this.y += this.dy;
  },

  moveRight() {
    this.x += this.dx;
  },

  moveLeft() {
    this.x -= this.dx;
  },

  reset() {
    this.speed = 0;
    this.x = 50;
    this.y = 160;
  },
};

// OBSTACLES
const obstacle = {
  position: [],
  w: 10,
  h: 400,
  gap: 150,
  maxYPos: -80,
  dx: 2,
  dx2: 3,
  dx3: 3.5,

  draw() {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYPos = p.y;
      let bottomYP = p.y + this.h + this.gap;

      // DRAW TOP OBSTACLE
      ctx.drawImage(obstacleImg, p.x, topYPos, this.w, this.h)
      // DRAW BOTTOM OBSTACLE
      ctx.drawImage(obstacleImg, p.x, bottomYP, this.w, this.h)
    }
  },

  update() {
    // CREATE NEW OBSTACLES IN AN ARRAY - LEVEL 1
    if (state.current === state.gameLevelOne) {
      if (frames % 100 == 0 && score.current < score.endLevelOne) {
        this.position.push({
          x: canvas.width,
          y: this.maxYPos * (Math.random() + 1.5)
        });
      };
    };


    // CREATE NEW OBSTACLES IN AN ARRAY - LEVEL 2
    if (state.current === state.gameLevelTwo) {
      if (frames % 60 == 0 && score.current >= score.beginLevelTwo && score.current < score.endLevelTwo) {
        this.position.push({
          x: canvas.width,
          y: this.maxYPos * (Math.random() + 1.5)
        });

      };
    };

    // CREATE NEW OBSTACLES IN AN ARRAY - LEVEL 3
    if (state.current === state.gameLevelThree) {
      if (frames % 30 == 0 && score.current >= score.beginLevelThree && score.current < score.endLevelThree) {
        this.position.push({
          x: canvas.width,
          y: this.maxYPos * (Math.random() + 1.5)
        });

      };
    };

    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];

      // MOVE OBSTACLES TO THE LEFT & ANIMATE OBSTACLES - LEVEL 1
      if (state.current === state.gameLevelOne) {
        p.x -= this.dx;
        if (frames % 240 === 0) {
          p.y += 150
          this.gap = 0;
          bump.play()

        }
        if (frames % 245 === 0) {
          p.y -= 150;
          this.gap = 150
        }
      }


      // MOVE OBSTACLES TO THE LEFT & ANIMATE OBSTACLES - LEVEL 2
      if (state.current === state.gameLevelTwo) {
        p.x -= this.dx2;
        if (frames % 242 === 0) {
          p.y += 150;
          this.gap = 0;
          bump.play();


        }
        if (frames % 246 === 0) {
          p.y -= 150;
          this.gap = 150
        }
      }

      // MOVE OBSTACLES TO THE LEFT AND ANIMATE OBTACLES - LEVEL 3
      if (state.current === state.gameLevelThree) {
        p.x -= this.dx3;
        if (frames % 235 === 0) {
          p.y += 150;
          this.gap = 0;
          bump.play();

        }
        if (frames % 236 === 0) {
          p.y -= 150;
          this.gap = 150;

        }
      }


      // COLLISION DETECTION
      let bottomYP = p.y + this.h + this.gap;
      //main character
      let characterLeft = mainCharacter.x;
      let characterTop = mainCharacter.y;
      let characterRight = mainCharacter.x + mainCharacter.w;
      let characterBottom = mainCharacter.y + mainCharacter.h;

      //top obstacle
      let tObstacleLeft = p.x;
      let tObstacleTop = p.y;
      let tObstacleRight = p.x + this.w;
      let tObstacleBottom = p.y + this.h;

      //bottom obstacle
      let bObstacleLeft = p.x;
      let bObstacleTop = bottomYP;
      let bObstacleRight = p.x + this.w;
      let bObstacleBottom = bottomYP + this.h;

      // DETECT COLLISION WITH TOP OBSTACLE
      if (characterRight > tObstacleLeft && characterLeft < tObstacleRight && characterBottom > tObstacleTop && characterTop < tObstacleBottom) {
        if (state.current !== state.over) {
          gameOverSound.play();
        }
        state.current = state.over;
        backgroundSound.pause();
      }

      // DETECT COLLISION WITH BOTTOM OBSTACLE
      if (characterRight > bObstacleLeft && characterLeft < bObstacleRight && characterBottom > bObstacleTop && characterTop < bObstacleBottom) {
        if (state.current !== state.over) {
          gameOverSound.play();
        }
        state.current = state.over;
        backgroundSound.pause();


      }

      // DELETE OBSTACLE FROM POSITION ARRAY WHEN OFF CANVAS
      // INCREASE SCORE WHEN OBSTACLE OFF CANVAS
      if (p.x + this.w <= 0) {
        this.position.shift();

        score.current += 1;
        scoreCounterSound.play();
        score.best = Math.max(score.current, score.best);
        localStorage.setItem('best', score.best);
      };
    };
  },

  reset() {
    this.position = [];
  },

};

const startScreen = {
  w: 100,
  h: 100,
  x: 350,
  y: 150,

  draw() {
    if (state.current === state.start) {
      // ctx.font = '20px "Press Start 2P"';
      // ctx.fillStyle = 'white';
      // ctx.fillText('START THE GAME', this.x, this.y);
      ctx.drawImage(playButtonImg, this.x, this.y, this.w, this.h);
      // ctx.drawImage(speechBubbleImg, 100, 100, 100, 100);
    }
  }
};

const gameOverScreen = {
  w: 70,
  h: 70,
  x: 200,
  y: 250,


  draw() {
    if (state.current == state.over) {
      ctx.font = '35px "Press Start 2P"';
      ctx.fillStyle = 'white'
      ctx.fillText('GAME OVER', this.x, this.y)
      ctx.drawImage(retartButtonImg, 330, 260, this.w, this.h)
    }
  },
};

const levelUpStartScreen = {
  w: 250,
  h: 150,
  x: 250,
  y: 150,


  draw() {
    if (state.current === state.startLevelTwo || state.current === state.startLevelThree) {
      ctx.drawImage(levelUpImg, this.x, this.y, this.w, this.h)
    }
  },
};

const levelLabel = {
  w: 100,
  h: 100,
  x: 0,
  y: 490,

  draw() {
    if (state.current === state.gameLevelOne) {
      ctx.font = '20px "Press Start 2P"';
      ctx.fillStyle = 'white'
      ctx.fillText('Level 1', this.x, this.y)
    };

    if (state.current === state.gameLevelTwo) {
      ctx.font = '20px "Press Start 2P"';
      ctx.fillStyle = 'white'
      ctx.fillText('Level 2', this.x, this.y)
    };

    if (state.current === state.gameLevelThree) {
      ctx.font = '20px "Press Start 2P"';
      ctx.fillStyle = 'white'
      ctx.fillText('Level 3', this.x, this.y)
    };
  },
};



const winScreen = {
  w: 250,
  h: 150,
  x1: 100,
  y1: 250,
  x2: 390,
  y2: 300,

  draw() {
    if (state.current === state.win) {
      // ctx.drawImage(winnerImg, this.x1, this.y1, this.w, this.h)

      ctx.font = '30px "Press Start 2P"';
      ctx.fillStyle = 'white'
      ctx.fillText('INCREDIBLE! YOU WON!', this.x1, this.y1)

      ctx.drawImage(playButtonImg, this.x2, this.y2, 50, 50);
      // ctx.font = '20px "Press Start 2P"';
      // ctx.fillStyle = 'white'
      // ctx.fillText('CLICK TO PLAY AGAIN', this.x2, this.y2)


    }
  }
};


// Draw
function draw() {
  background.draw();
  mainCharacter.draw();
  startScreen.draw();
  gameOverScreen.draw();
  obstacle.draw();
  levelUpStartScreen.draw();
  winScreen.draw();
  levelLabel.draw();
};


// Update
function update() {
  mainCharacter.update();
  background.update();
  obstacle.update();
  score.update();
};


// Loop
function loop() {
  update();
  draw();
  frames++;

  requestAnimationFrame(loop)
};

window.onload = function () {
  loop();
  messageTxt.createRandomMessage();
  messageTxt.typing();


  document.onkeydown = function (e) {
    if (e.keyCode === 38) {
      if (state.current == state.gameLevelOne || state.current == state.gameLevelTwo || state.current === state.gameLevelThree) {
        mainCharacter.moveUp();
      }
    };

    if (e.keyCode === 40) {
      if (state.current == state.gameLevelOne || state.current == state.gameLevelTwo || state.current === state.gameLevelThree) {
        mainCharacter.moveDown();
      }
    };

    if (e.keyCode === 39) {
      if (state.current == state.gameLevelOne || state.current == state.gameLevelTwo || state.current === state.gameLevelThree) {
        mainCharacter.moveRight();
      }
    };

    if (e.keyCode === 37) {
      if (state.current == state.gameLevelOne || state.current == state.gameLevelTwo || state.current === state.gameLevelThree) {
        mainCharacter.moveLeft();
      }
    };


    // secret key to jump to level 2 (just for Demo purposes)
    if (e.keyCode === 50) {
      state.current = state.gameLevelTwo;
      score.current = score.beginLevelTwo
    };
    // secret key to jump to level 3 (just for demo purposes)
    if (e.keyCode === 51) {
      state.current = state.gameLevelThree;
      score.current = score.beginLevelThree;
    };

  }
}


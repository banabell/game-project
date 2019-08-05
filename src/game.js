
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
    case state.start: state.current = state.gameLevelOne;
    document.getElementById('message').innerHTML = "";
      break;
    case state.over:
      score.reset();
      mainCharacter.reset();
      obstacle.reset();
      state.current = state.start;
      frames = 0;
      document.getElementById('message').innerHTML = "";
      break;
    case state.startLevelTwo:
      score.current = score.beginLevelTwo;
      state.current = state.gameLevelTwo;
      score.best = Math.max(score.current, score.best);
      localStorage.setItem('best', score.best); 
      mainCharacter.reset();
      obstacle.reset();
      break;
    case state.startLevelThree:
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

// LOAD GAME OVER IMAGE
const gameOverImg = new Image();
gameOverImg.src = "./img/gameover.png";

// LOAD OBSTACLE
const obstacleImg = new Image();
obstacleImg.src = "./img/satellite3.png";

// LOAD IMAGE FOR LEVEL SCREENS
const levelUpImg = new Image();
levelUpImg.src = "./img/levelUp.png";

// LOAD IMAGE FOR WIN SCREEN
const winnerImg = new Image();
winnerImg.src = "./img/winner.png";



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
    bestScore .innerHTML = this.best;

    // CHANGE TO LEVEL 2 STATE
    if (obstacle.position.length === 0 && this.current >= this.endLevelOne && this.current < this.beginLevelTwo) {
      state.current = state.startLevelTwo;
    }
    // CHANGE TO LEVEL 3 STATE
    if (obstacle.position.length === 0 && this.current >= this.endLevelTwo && this.current < this.beginLevelThree) {
      state.current = state.startLevelThree;
    }

    // CHANGE TO WIN STATE
    if (obstacle.position.length === 0 && this.current >= this.endLevelThree) {
      state.current = state.win;
    }

  },

  reset() {
    score.current = 0;
  }
};



// MESSAGES(DOM) TO DO: SHOW AT GAME OVER STATE ONLY
// const messageTxt = {
//   messages: ["Try again. You'll figure this out", "Give it another try. You got this"],
//   randomMessage: '',
//   j: 0,
 

//   createRandomMessage() {
//     let randonIndex = Math.floor(Math.random() * messageTxt.messages.length);
//     messageTxt.randomMessage = messageTxt.messages[randonIndex]
//   }, 


//   typing() {
//       if (messageTxt.j < messageTxt.randomMessage.length) {
//         document.getElementById('message').innerHTML += messageTxt.randomMessage.charAt(messageTxt.j);
//         messageTxt.j++
//         setTimeout(messageTxt.typing, 200)
//       }
      
//     }
  

// };

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
  y: 160,
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
      if (this.y + 50 >= canvas.height) {
        this.y === canvas.height;
        state.current = state.over
      }
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
  dy: 100,



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
        state.current = state.over;
      }

      // DETECT COLLISION WITH BOTTOM OBSTACLE
      if (characterRight > bObstacleLeft && characterLeft < bObstacleRight && characterBottom > bObstacleTop && characterTop < bObstacleBottom) {
        state.current = state.over;
      }

      // DELETE OBSTACLE FROM POSITION ARRAY WHEN OFF CANVAS
      // INCREASE SCORE WHEN OBSTACLE OFF CANVAS
      if (p.x + this.w <= 0) {
        this.position.shift();
        
        score.current += 1;
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
  w: 50,
  h: 50,
  x: 150,
  y: canvas.height / 2,

  draw() {
    if (state.current === state.start) {
      ctx.font = '20px "Press Start 2P"';
      ctx.fillStyle = 'white'
      ctx.fillText('START THE GAME', this.x, this.y)

      ctx.drawImage(playButtonImg, 260, 150, this.w, this.h)

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
  }
};


// dancingCharacter = {
//   animation: [
//   { sX: 0, sY: 337},
//   { sX: 23, sY: 337},
//   { sX: 46, sY: 337},
//   { sX: 69, sY: 337},
//   { sX: 92, sY: 337},
//   { sX: 115, sY: 337},
// ],

// x: 50,
// y: 160,
// w: 17,
// h: 50,

// frame: 0,


// draw() {
//   if(state.current === state.startLevelTwo){
//   let dancingCharacter = this.animation[this.frame]
//   ctx.drawImage(moonWalkImg, dancingCharacter.sX, dancingCharacter.sY, this.w, this.h, this.x, this.y, this.w, this.h)
// }
// },

// update() {
//     if (frames % 15 === 0) {
//       this.frame += 1;
//     }
//     if (this.frame === this.animation.length) {
//       this.frame = 0;
//     }

// }
// };


const levelLabel = {
  w: 100,
  h: 100,
  x: 0,
  y: 20,

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
  x2: 210,
  y2: 300,

  draw() {
    if (state.current === state.win) {
      // ctx.drawImage(winnerImg, this.x, this.y, this.w, this.h)
      ctx.font = '30px "Press Start 2P"';
      ctx.fillStyle = 'white'
      ctx.fillText('INCREDIBLE! YOU WON!', this.x1, this.y1)

      ctx.font = '20px "Press Start 2P"';
      ctx.fillStyle = 'white'
      ctx.fillText('CLICK TO PLAY AGAIN', this.x2, this.y2)

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
  // dancingCharacter.draw();
};


// Update
function update() {
  mainCharacter.update();
  background.update();
  obstacle.update();
  score.update();
  



  // dancingCharacter.update();


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

    // secret key to jump to level 2 (to do: randomize it)
    if (e.keyCode === 50) {
      state.current = state.gameLevelTwo;
      score.current = score.beginLevelTwo
    };
    // secret key to jump to level 3 (to do: randomize it)
    if (e.keyCode === 51) {
      state.current = state.gameLevelThree;
      score.current = score.beginLevelThree;
    };

  }
}


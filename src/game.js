
// CANVAS
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// VARIABLES
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
      break;
    case state.over:
      score.reset();
      mainCharacter.reset();
      obstacle.reset();
      state.current = state.start;
      break;
    case state.startLevelTwo:
      score.current = score.beginLevelTwo;
      state.current = state.gameLevelTwo;
      mainCharacter.reset();
      obstacle.reset();
      break;
    case state.startLevelThree:
      score.current = score.beginLevelThree;
      state.current = state.gameLevelThree;
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

// LOAD MAIN CHARACTER
const mainCharacterImg = new Image();
mainCharacterImg.src = "./img/ghost.png";

// LOAD START BUTTON
const startButtonImg = new Image();
startButtonImg.src = "./img/play.png";

// LOAD GAME OVER IMAGE
const gameOverImg = new Image();
gameOverImg.src = "./img/gameover.png";

// LOAD OBSTACLE
const obstacleImg = new Image();
obstacleImg.src = "./img/satellite3.png";

// Load IMAGE FOR LEVEL SCREENS
const levelUpImg = new Image();
levelUpImg.src = "./img/levelUp.png";

// LOAD IMAGE FOR WIN SCREEN
const winnerImg = new Image();
winnerImg.src = "./img/winner.png";

// SCORE
const score = {
  current: 0,
  endLevelOne: 3,
  beginLevelTwo: 20,
  endLevelTwo: 21,
  beginLevelThree: 40,
  endLevelThree: 41,

  update() {
    // UPDATE SCOREBOARD IN DOM
    let scoreboard = document.getElementById('userScore');
    scoreboard.innerHTML = this.current;

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

  reset(){
    score.current = 0;
  }
};

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
  x: 50,
  y: 150,
  w: 50,
  h: 50,
  speed: 0,
  gravity: 0.0005,
  dx: 15,
  dy: 15,

  draw() {
    ctx.drawImage(mainCharacterImg, this.x, this.y, this.w, this.h)
  },

  update() {
    if (state.current === state.start) {
      this.y = 150;
    }

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

  moveRight(){
    this.x += this.dx;
  },

  moveLeft(){
    this.x -= this.dx;
  },

  reset() {
    this.speed = 0;
  },
};

// OBSTACLES
const obstacle = {
  position: [],
  w: 10,
  h: 400,
  gap: 100,
  maxYPos: -80,
  dx: 2,
  dy: 50,


  draw() {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYPos = p.y;
      let bottomYP = p.y + this.h + this.gap;

      // DRAWING TOP OBSTACLE
      ctx.drawImage(obstacleImg, p.x, topYPos, this.w, this.h)
      // DRAWING BOTTOM OBSTACLE
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
      if (frames % 100 == 0 && score.current >= score.beginLevelTwo && score.current < score.endLevelTwo) {
        this.position.push({
          x: canvas.width,
          y: this.maxYPos * (Math.random() + 1.5)
        });

      };
    };

     // CREATE NEW OBSTACLES IN AN ARRAY - LEVEL 3
    if (state.current === state.gameLevelThree) {
      if (frames % 100 == 0 && score.current >= score.beginLevelThree && score.current < score.endLevelThree) {
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
        // if(frames % 240 === 0){
        //   p.y -= this.dy;
        //   this.gap = 0;
        // }
        // if(frames % 245 === 0){
        //   p.y += this.dy;
        //   this.gap = 100;
        // }
      }

      // MOVE OBSTACLES TO THE LEFT - LEVEL 2
      if (state.current === state.gameLevelTwo) {
        p.x -= this.dx;
      }

      // MOVE OBSTACLES TO THE LEFT - LEVEL 3
      if (state.current === state.gameLevelThree) {
        p.x -= this.dx;
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

      // detect collision with top obstacle
      if (characterRight > tObstacleLeft && characterLeft < tObstacleRight && characterBottom > tObstacleTop && characterTop < tObstacleBottom) {
        state.current = state.over;
      }

      // detect collision with bottom obsctale
      if (characterRight > bObstacleLeft && characterLeft < bObstacleRight && characterBottom > bObstacleTop && characterTop < bObstacleBottom) {
        state.current = state.over;
      }

      // delete obstacle from postion array when off the canvas
      // increase the score
      if (p.x + this.w <= 0) {
        this.position.shift();
        score.current += 1;
      };

    };
  },

  reset() {
    this.position = [];
  },

};

const startScreen = {
  w: 130,
  h: 130,
  x: 330,
  y: 150,

  draw() {
    if (state.current == state.start) {
      ctx.drawImage(startButtonImg, this.x, this.y, this.w, this.h)
    }
  }
};

const gameOverScreen = {
  w: 250,
  h: 150,
  x: 270,
  y: 150,

  draw() {
    if (state.current == state.over) {
      ctx.drawImage(gameOverImg, this.x, this.y, this.w, this.h)
    }
  }
};

const levelUpStartScreen = {
  w: 250,
  h: 150,
  x: 270,
  y: 150,

  draw() {
    if (state.current === state.startLevelTwo || state.current === state.startLevelThree) {
      ctx.drawImage(levelUpImg, this.x, this.y, this.w, this.h)

    }
  }
};

const levelLabel = {
  w: 100,
  h: 100,
  x: 0,
  y: 0,

  draw(){
    if(state.current === state.gameLevelOne){
      ctx.font = '20px Helvetica';
      ctx.fillStyle = 'white'
      ctx.fillText('Level 1', 0, 20)
    };

    if(state.current === state.gameLevelTwo){
      ctx.font = '20px Helvetica';
      ctx.fillStyle = 'white'
      ctx.fillText('Level 2', 0, 20)
    };

    if(state.current === state.gameLevelThree){
      ctx.font = '20px Helvetica';
      ctx.fillStyle = 'white'
      ctx.fillText('Level 3', 0, 20)
    };
  },
};

const winScreen = {
  w: 250,
  h: 150,
  x: 270,
  y: 150,

  draw() {
    if (state.current === state.win) {
      ctx.drawImage(winnerImg, this.x, this.y, this.w, this.h)

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
  document.onkeydown = function (e) {
    if (e.keyCode === 38) {
      if (state.current == state.gameLevelOne || state.current == state.gameLevelTwo || state.current === state.gameLevelThree) {
        mainCharacter.moveUp();
      }
    }
    if (e.keyCode === 40) {
      if (state.current == state.gameLevelOne || state.current == state.gameLevelTwo || state.current === state.gameLevelThree) {
        mainCharacter.moveDown();
      }
    }

    if (e.keyCode === 39) {
      if (state.current == state.gameLevelOne || state.current == state.gameLevelTwo || state.current === state.gameLevelThree) {
        mainCharacter.moveRight();
      }
    }

    if (e.keyCode === 37) {
      if (state.current == state.gameLevelOne || state.current == state.gameLevelTwo || state.current === state.gameLevelThree) {
        mainCharacter.moveLeft();
      }
    }
  }
}

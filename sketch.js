// global variables
let board;
let cellSize;
let tetris; 
let buffer; 
let startTime = 0;
let waitTime = 750;
let score;
let over = false;
let backgroundMusic, rowClearedSound;
let gameStarted = false;
let gamePaused = false;
let pauseIcon;
let colors = ["lightblue", "blue", "orange", "yellow", "lightgreen", "purple", "red"]; // official colors in order of tetris blocks

let block1 = [ // i block
  [1, 1, 1, 1]
];
let block2 = [ // j block
  [2, 0, 0],
  [2, 2, 2],
];
let block3 = [ // l block
  [0, 0, 3],
  [3, 3, 3]
];
let block4 = [ // o block
  [4, 4],
  [4, 4]
];    
let block5 = [ // s block
  [0, 5, 5],
  [5, 5, 0]
];    
let block6 = [ // t block
  [0, 6, 0],
  [6, 6, 6] 
];    
let block7 = [ // z block
  [7, 7, 0],
  [0, 7, 7]
];

function preload() {
  backgroundMusic = loadSound("assets/tetris-theme.mp3");
  backgroundMusic.setVolume(0.4);
  rowClearedSound = loadSound("assets/row-clear.mp3");
  pauseIcon = loadImage("assets/pause.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellSize = height/20;
  buffer = width/2 - 10*cellSize/2; 
  
  // create empty grid to display and a new tetris game
  tetris = new Tetris();
  board = createEmptyGrid();
  score = 0;
}

function draw() {
  background(50); 
  
  // main loop to execute when game is in progress
  if (gameStarted && !gamePaused) {
    image(pauseIcon, width/5, height/25, width/25, width/25);

    // play background music if it hasn't started or has ended
    if (!backgroundMusic.isPlaying()) {
      backgroundMusic.play();
    }

    // call functions
    drawGrid();
    writeScore();
    tetris.checkGameOver();
    tetris.fillBoard();
    tetris.newBlock.fillGrid();
    tetris.drawNextBlock();
    tetris.drawHoldQueue();
    
    // spawn new block if no more moves
    if (tetris.newBlock.checkBlockPlaced() || tetris.newBlock.checkVerticalCollision()) {
      tetris.newBlock.addToMaster();
      tetris.clearRowIfDone();
      tetris.spawnNewBlock();
    }
  
    else {
      // move block down and update the ghost block
      tetris.autoMoveBlock();
      tetris.ghostBlock.updateGhostBlock();
      tetris.ghostBlock.showGhostBlock();
    }
    
    // for soft drop - if down arrow is being pressed, reduce the time it takes for block to move down
    if (keyIsDown(40)) { 
      waitTime = 75;
    }
    else {
      waitTime = 750;
    }
  }

  else if (gamePaused) {
    pauseScreen();
  }

  else {
    writeIntro();
  }
}

function mouseClicked() {
  // switch state variables to display relevant screen (intro, pause, or game)
  if (!gameStarted) {
    gameStarted = true;
    backgroundMusic.play();
  }
  else if (!gamePaused) {
    gamePaused = true;
    backgroundMusic.pause();
  }
  else if (gamePaused) {
    gamePaused = false;
    backgroundMusic.play();
  }
}

function keyPressed() {
  // perform action depending on which key is pressed, pretty self explanatory based on function names
  if (keyCode === RIGHT_ARROW) {
    tetris.newBlock.moveRight();
  }
  else if (keyCode === LEFT_ARROW) {
    tetris.newBlock.moveLeft();
  }
  else if (keyCode === 32) { // space bar
    tetris.newBlock.hardDrop();
  }
  else if (keyCode === UP_ARROW) {
    tetris.newBlock.rotateBlock();
  }
  else if (keyCode === 67) { // c
    tetris.holdQueue();
  }
}

function createEmptyGrid() {
  // function to return a 10x20 array filled with 0s
  let board = [];
  for (let i = 0; i < 20; i++) {
    board.push([]);
    for (let j = 0; j < 10; j++) {
      board[i].push(0);
    }
  }
  return board;
}

function drawGrid() {
  // draw the game board
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      noFill();
      rect(x*cellSize+buffer, y*cellSize, cellSize, cellSize);
    }
  }
  stroke("white");
  
  // draw borders around the grid
  line(buffer, 0, buffer, height);
  line(width - buffer, 0, width - buffer, height);
  line(buffer, 0, width-buffer, 0);
  line(buffer, height, width-buffer, height);

}

function writeScore() {
  // write the current score as well as the number of rows cleared and the level to the screen
  fill("white");
  strokeWeight(0.1);
  textSize(width/45);

  text("Score: " + score, width-buffer + width/25, height/10);
  text("Rows Cleared: " + tetris.totalRowsCleared, width-buffer + width/25, height/6);
  text("Multiplier Level: " + tetris.calculateLevel(), width-buffer + width/25, height/4.5);
  text("Next Block:", width-buffer + width/25, height/3);
}

function writeIntro() {
  // display welcome screen with unstruction
  fill("white");
  textSize(width/25);
  textAlign(CENTER, CENTER);
  text("Welcome to Tetris", width/2, height/3);
  textSize(width/50);
  text("Click anywhere to play", width/2, height/3*1.3);
  text("Instructions:\n UP - Rotate block \n LEFT/RIGHT - Move block left and right \n DOWN - Soft drop block \n SPACE - Hard drop block \n C - Hold current block",  width/2, height/3*2);

  textAlign(LEFT);
}

function pauseScreen() {
  // display pause screen
  fill("white");
  textSize(width/25);
  textAlign(CENTER, CENTER);
  text("Game Paused", width/2, height/3);
  textSize(width/50);
  text("Click anywhere to resume", width/2, height/3*1.3);
  text("Instructions:\n UP - Rotate block \n LEFT/RIGHT - Move block left and right \n DOWN - Soft drop block \n SPACE - Hard drop block \n C - Hold current block",  width/2, height/3*2);
  textAlign(LEFT);
}

class Tetris {
  // this tetris object contains the grid of the current state of the game
  // it also includes functions that are not specific to the current block, but rather the whole game
  // it also stores the current block
  constructor() {
    this.masterGrid = createEmptyGrid();
    this.spawnNewBlock();
    this.totalRowsCleared = 0;
    this.heldBlock = false;
  }
  
  // creates a new block and ghost block object
  spawnNewBlock() {
    this.whichBlock(); // decide what block shape to spawn
    this.newBlock = new Block(this.blockShape);
    this.ghostBlock = new Block(this.blockShape);
  }

  holdQueue() {
    // if there is a block held, swap it with the current block and reset position to top
    if (this.heldBlock) {
      this.heldBlock.x = 3;
      this.heldBlock.y = 0;
      this.tempBlock = this.newBlock;
      this.newBlock = this.heldBlock;
      this.heldBlock = this.tempBlock;
    
    }
    // if not then hold current block
    else {
      this.heldBlock = this.newBlock;
      this.heldBlock.x = 3;
      this.heldBlock.y = 0;
      this.spawnNewBlock();
    }
  }

  whichBlock() {
    // if next block is chosen, set it to current block
    if (this.nextBlock) {
      this.blockShape = this.nextBlock;
    }
    // if not then choose one at random
    else {
      this.blockShape = random([block1, block2, block3, block4, block5, block6, block7]);
    }

    // decide next block
    this.nextBlock = random([block1, block2, block3, block4, block5, block6, block7]);
  }

  fillBoard() {
    for (let y = 0; y < this.masterGrid.length; y++) {
      for (let x = 0; x < this.masterGrid[y].length; x++) {
        // if something in current grid or master grid, fill with the color the current block is supposed to be
        if (this.newBlock.currentBlockGrid[y][x] > 0) {
          fill(colors[this.newBlock.currentBlockGrid[y][x]-1]);
          rect(x*cellSize+buffer, y*cellSize, cellSize, cellSize);
        }
        else if (this.masterGrid[y][x] > 0) {
          fill(colors[this.masterGrid[y][x]-1]);
          rect(x*cellSize+buffer, y*cellSize, cellSize, cellSize);
        }
      }

    }
  }

  autoMoveBlock() {
    // move block down every time waitTime has elapsed
    if (millis() > startTime + waitTime) {
      startTime = millis();
      this.newBlock.moveDown();
    }
  }

  calculateLevel() {
    return Math.floor(this.totalRowsCleared/10);
  }

  clearRowIfDone() {
    this.rowsClearedThisRun = 0; // counter which will help with scoring multiplier

    for (let i = 0; i < this.masterGrid.length; i++) {
      // if row if full, remove it and add a blank row to the top
      if (!this.masterGrid[i].includes(0)) {
        this.newGrid = this.masterGrid;
        this.newGrid.splice(i, 1);
        this.newGrid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        this.masterGrid = this.newGrid;
        this.rowsClearedThisRun++;
        this.totalRowsCleared++;
        rowClearedSound.play();
      }
    }

    // award points thee same way as awarded in real tetris
    if (this.rowsClearedThisRun === 1) {
      score += 100 * (this.calculateLevel() + 1);
    }
    else if (this.rowsClearedThisRun === 2) {
      score += 300 * (this.calculateLevel() + 1);
    }
    else if (this.rowsClearedThisRun === 3) {
      score += 500 * (this.calculateLevel() + 1);
    }
    else if (this.rowsClearedThisRun === 4) {
      score += 800 * (this.calculateLevel() + 1);
    }
  }

  checkGameOver() {
    if (this.newBlock.y === 0 && this.newBlock.checkVerticalCollision()) {
      // show final block
      this.fillBoard();
      this.newBlock.fillGrid();

      // write game over on to screen
      textAlign(CENTER, CENTER);
      textSize(width/10);
      fill("white");
      this.masterGrid = createEmptyGrid();
      text("Game Over!", width/2, height/2);
      backgroundMusic.stop();
      noLoop();
    }
  }

  drawNextBlock() {
    for (let y = 0; y < this.nextBlock.length; y++) {
      for (let x = 0; x < this.nextBlock[y].length; x++) {
        if (this.nextBlock[y][x] > 0) {
          fill(colors[this.nextBlock[y][x]-1]);
          rect(x*cellSize+width-buffer + width/22, y*cellSize+height/2.7, cellSize, cellSize);
        }
      }
    }
  }

  drawHoldQueue() {
    fill("white");
    textSize(width/45);
    text("Held (c):", width/5, height/6);

    // if block is held then display
    if (this.heldBlock) {
      for (let y = 0; y < this.heldBlock.currentBlock.length; y++) {
        for (let x = 0; x < this.heldBlock.currentBlock[y].length; x++) {
          if (this.heldBlock.currentBlock[y][x] > 0) {
            fill(colors[this.heldBlock.currentBlock[y][x]-1]);
            rect(x*cellSize + width/5, y*cellSize+height/4.5, cellSize, cellSize);
          }
        }
      }
    }
  }
}

class Block {
  // this block object is the object which contains the current block shape 
  // also has all the functions required to perform operations to a block
  constructor(blockShape) {
    this.x = 3;
    this.y = 0;

    this.currentBlock = blockShape;
    this.currentBlockGrid = createEmptyGrid();
  }

  rotateBlock() {

    // 2x3 block grid
    if (this.currentBlock.length === 2 && this.currentBlock[0].length === 3) {
      this.currentBlock = [
        [this.currentBlock[1][0], this.currentBlock[0][0]],
        [this.currentBlock[1][1], this.currentBlock[0][1]],
        [this.currentBlock[1][2], this.currentBlock[0][2]],
      ];
    }

    // 1x4 block grid
    else if (this.currentBlock.length === 1) {
      this.currentBlock = [[1], [1], [1], [1]];
      if (this.x < this.currentBlockGrid[0].length) {
        this.x++;
      }
    }

    // 3x2 block grid
    else if (this.currentBlock.length === 3 && this.currentBlock[0].length === 2) {
      this.currentBlock = [
        [this.currentBlock[2][0], this.currentBlock[1][0], this.currentBlock[0][0]],
        [this.currentBlock[2][1], this.currentBlock[1][1], this.currentBlock[0][1]]
      ];
    }

    // 4x1 block grid
    else if (this.currentBlock.length === 4) {
      this.currentBlock = block1;
      this.x--;
      if (this.x < 0) {
        this.x++;
      }
    }

    // make sure shape is not going outside of grid
    while (this.x + this.currentBlock[0].length > this.currentBlockGrid[0].length) {
      this.x--;
    }

    this.currentBlockGrid = createEmptyGrid(); // remove old values from the grid
  }


  fillGrid() {
    // fill currentBlockGrid based on currentBlock
    this.currentBlockGrid = createEmptyGrid();

    for (let j = 0; j < this.currentBlock.length; j++) {
      for (let i = 0; i < this.currentBlock[j].length; i++) {
        this.currentBlockGrid[this.y+j][this.x+i] = this.currentBlock[j][i];
      }
    } 
  }

  moveDown() {
    // increase y value by 1 if legal
    if (!this.checkBlockPlaced()) {
      for (let i = 0; i < this.currentBlock[0].length; i++) {
        this.currentBlockGrid[this.y][this.x+i] = 0;
      }
      this.y++;
    }
  }

  moveRight() {
    // move x to the right if legal
    if (!this.checkRightCollision()) {
      for (let i = 0; i < this.currentBlock.length; i++) {
        this.currentBlockGrid[this.y+i][this.x] = 0;
      }
      this.x++;
    }
  }

  moveLeft() {
    // move x to the left if legal
    if (!this.checkLeftCollision()) {
      for (let i = 0; i < this.currentBlock.length; i++) {
        this.currentBlockGrid[this.y+i][this.x+this.currentBlock[i].length-1] = 0;
      }
      this.x--;
    }
  }

  checkRightCollision() {
    // check for collison on the right side
    if (this.x + this.currentBlock[0].length >= 10) {
      return true;
    }

    for (let i = 0; i < this.currentBlock.length; i++) {
      for (let j = this.currentBlock[i].length; j > 0; j--) {
        if (this.currentBlock[i][j] > 0 && tetris.masterGrid[this.y + i][this.x+j+1] > 0) {
          return true;
        }
      }
    }
    return false;
  }

  checkLeftCollision() {
    // check for collision on the rigth side
    if (this.x <= 0) {
      return true;
    }

    for (let i = 0; i < this.currentBlock.length; i++) {
      for (let j = 0; j < this.currentBlock[i].length; j++) {
        if (this.currentBlock[i][j] > 0 && tetris.masterGrid[this.y+i][this.x+j-1] > 0) {
          return true;
        }
      }
    }
    return false; 
  }

  addToMaster() {
    // every value in the current grid that is not 0, add it to the master gris
    for (let i = 0; i < this.currentBlockGrid.length; i++) {
      for (let j = 0; j < this.currentBlockGrid[i].length; j++) {
        if (this.currentBlockGrid[i][j] > 0) {
          tetris.masterGrid[i][j] = this.currentBlockGrid[i][j];
        }
      }
    }
  }
  
  checkBlockPlaced() {
    // checks if block is at bottom of the grid
    for (let i=0; i < this.currentBlockGrid[19].length; i++) {
      if (this.currentBlockGrid[19][i] > 0) {
        // if (millis() > waitTime + 500) {
        return true;
        // }
      }
    }
  }

  checkVerticalCollision() {
    // check if something is colliding if y value were to increase by 1
    for (let i = 0; i < this.currentBlock.length; i++) {
      for (let j = 0; j < this.currentBlock[i].length; j++) {
        if (tetris.masterGrid[this.y+i+1][this.x+j] > 0 && this.currentBlock[i][j] > 0) {
          return true;
        }
      }      
    }
    return false;
  }

  hardDrop() {
    // move as far down as a block can go
    while (this.y + this.currentBlock.length <= 19 && !this.checkBlockPlaced() && !this.checkVerticalCollision()) {
      this.moveDown();
    }
  } 

  updateGhostBlock() {
    // set to current block shape and coordinates, then hard drop
    this.currentBlock = tetris.newBlock.currentBlock;
    this.x = tetris.newBlock.x;
    this.y = tetris.newBlock.y;
    this.hardDrop();
  }

  showGhostBlock() {
    // display in gray
    for (let y = 0; y < this.currentBlock.length; y++) {
      for (let x = 0; x < this.currentBlock[y].length; x++) {
        if (this.currentBlock[y][x] > 0) {
          fill(color(200, 100));
          rect(x*cellSize+this.x*cellSize+buffer, y*cellSize+this.y*cellSize, cellSize, cellSize);
        }
      }
    }
  }
}
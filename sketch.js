let board;
let cellSize;
let tetris; 
let buffer; 
let startTime = 0;
let waitTime = 750;
let score;
let over = false;

let block1 = [
  [1, 1, 1, 1]
];
let block2 = [
  [2, 0, 0],
  [2, 2, 2],
];
let block3 = [
  [0, 0, 3],
  [3, 3, 3]
];
let block4 = [
  [4, 4],
  [4, 4]
];    
let block5 = [
  [0, 5, 5],
  [5, 5, 0]
];    
let block6 = [
  [0, 6, 0],
  [6, 6, 6] 
];    
let block7 = [
  [7, 7, 0],
  [0, 7, 7]
];
let colors = ["lightblue", "blue", "orange", "yellow", "lightgreen", "purple", "red"];

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
  drawGrid();
  writeScore();

  tetris.checkGameOver();
  tetris.fillBoard();
  tetris.newBlock.fillGrid();
  tetris.drawNextBlock();

  if (tetris.newBlock.checkBlockPlaced() || tetris.newBlock.checkVerticalCollision()) {
    tetris.newBlock.addToMaster();
    tetris.clearRowIfDone();
  }

  else {
    tetris.autoMoveBlock();
    tetris.ghostBlock.updateGhostBlock();
    tetris.ghostBlock.showGhostBlock();
  }

  if (keyIsDown(40)) {
    waitTime = 75;
  }
  else {
    waitTime = 750;
  }
}

function keyPressed() {
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
}

function createEmptyGrid() {
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
  
  line(buffer, 0, buffer, height);
  line(width - buffer, 0, width - buffer, height);
  line(buffer, 0, width-buffer, 0);
  line(buffer, height, width-buffer, height);

}

function writeScore() {
  fill("white");
  strokeWeight(0.1)
  textSize(width/45);

  text("Score: " + score, width-buffer + width/25, height/10);
  text("Rows Cleared: " + tetris.totalRowsCleared, width-buffer + width/25, height/6);
  text("Multiplier Level: " + tetris.calculateLevel(), width-buffer + width/25, height/4.5);
  text("Next Block:", width-buffer + width/25, height/3);
}

class Tetris {
  constructor() {
    this.masterGrid = createEmptyGrid();
    this.spawnNewBlock();
    this.totalRowsCleared = 0;
  }
  
  spawnNewBlock() {
    this.whichBlock();
    this.newBlock = new Block(this.blockShape);
    this.ghostBlock = new Block(this.blockShape);
  }

  whichBlock() {
    if (this.nextBlock) {
      this.blockShape = this.nextBlock;
    }
    else {
      this.blockShape = random([block1, block2, block3, block4, block5, block6, block7]);
    }
    this.nextBlock = random([block1, block2, block3, block4, block5, block6, block7]);
  }

  fillBoard() {
    for (let y = 0; y < this.masterGrid.length; y++) {
      for (let x = 0; x < this.masterGrid[y].length; x++) {
        if (this.newBlock.currentBlockGrid[y][x] > 0) {
          // fill with the color the current block is supposed to be
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
    if (millis() > startTime + waitTime) {
      startTime = millis();
      this.newBlock.moveDown();
    }
  }

  calculateLevel() {
    return Math.floor(this.totalRowsCleared/10);
  }

  clearRowIfDone() {
    this.rowsClearedThisRun = 0;
    for (let i = 0; i < this.masterGrid.length; i++) {
      if (!this.masterGrid[i].includes(0)) {
        this.newGrid = this.masterGrid;
        this.newGrid.splice(i, 1);
        this.newGrid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        this.masterGrid = this.newGrid;
        this.rowsClearedThisRun++;
        this.totalRowsCleared++;
      }
    }

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

      textAlign(CENTER, CENTER);
      textSize(width/10);
      fill("white");
      // clear();
      text("Game Over!", width/2, height/2);
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
}

class Block {
  constructor(blockShape) {
    this.x = 3;
    this.y = 0;

    this.currentBlock = blockShape;
    this.currentBlockGrid = createEmptyGrid();
  }

  rotateBlock() {
    if (this.currentBlock.length === 2 && this.currentBlock[0].length === 3) {
      this.currentBlock = [
        [this.currentBlock[1][0], this.currentBlock[0][0]],
        [this.currentBlock[1][1], this.currentBlock[0][1]],
        [this.currentBlock[1][2], this.currentBlock[0][2]],
      ];
    }

    else if (this.currentBlock.length === 1) {
      this.currentBlock = [[1], [1], [1], [1]];
      if (this.x < this.currentBlockGrid[0].length) {
        this.x++;
      }
    }

    else if (this.currentBlock.length === 3 && this.currentBlock[0].length === 2) {
      this.currentBlock = [
        [this.currentBlock[2][0], this.currentBlock[1][0], this.currentBlock[0][0]],
        [this.currentBlock[2][1], this.currentBlock[1][1], this.currentBlock[0][1]]
      ];
    }

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

    this.currentBlockGrid = createEmptyGrid();
  }


  fillGrid() {
    for (let j = 0; j < this.currentBlock.length; j++) {
      for (let i = 0; i < this.currentBlock[j].length; i++) {
        this.currentBlockGrid[this.y+j][this.x+i] = this.currentBlock[j][i];
        console.log();
      }
    }
  }

  moveDown() {
    if (!this.checkBlockPlaced()) {
      for (let i = 0; i < this.currentBlock[0].length; i++) {
        this.currentBlockGrid[this.y][this.x+i] = 0;
      }
      this.y++;
    }
  }

  moveRight() {
    if (!this.checkRightCollision()) {
      for (let i = 0; i < this.currentBlock.length; i++) {
        this.currentBlockGrid[this.y+i][this.x] = 0;
      }
      this.x++;
    }
  }

  moveLeft() {
    if (!this.checkLeftCollision()) {
      for (let i = 0; i < this.currentBlock.length; i++) {
        this.currentBlockGrid[this.y+i][this.x+this.currentBlock[i].length-1] = 0;
      }
      this.x--;
    }
  }

  checkRightCollision() {
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
    for (let i = 0; i < this.currentBlockGrid.length; i++) {
      for (let j = 0; j < this.currentBlockGrid[i].length; j++) {
        if (this.currentBlockGrid[i][j] > 0) {
          tetris.masterGrid[i][j] = this.currentBlockGrid[i][j];
        }
      }
    }
    tetris.spawnNewBlock();
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
    while (this.y + this.currentBlock.length <= 19 && !this.checkBlockPlaced() && !this.checkVerticalCollision()) {
      this.moveDown();
    }
  }

  updateGhostBlock() {
    this.currentBlock = tetris.newBlock.currentBlock;
    this.x = tetris.newBlock.x;
    this.y = tetris.newBlock.y;
    this.hardDrop();
  }

  showGhostBlock() {
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
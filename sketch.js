let board;
let cellSize;
let tetris; 
let buffer; 
let waitTime = 0;

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

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellSize = height/20;
  buffer = width/2 - 10*cellSize/2; 
  
  // create empty grid to display and a new tetris game
  board = createEmptyGrid();
  tetris = new Tetris();
}

function draw() {
  background(0);
  drawGrid();
  tetris.fillBoard();
  tetris.newBlock.fillGrid();
  tetris.autoMoveBlock();

  if (tetris.newBlock.checkBlockPlaced()) {
    tetris.newBlock.addToMaster();
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    tetris.newBlock.moveDown();
  }

  else if (keyCode === RIGHT_ARROW) {
    tetris.newBlock.moveRight();
  }

  else if (keyCode === LEFT_ARROW) {
    tetris.newBlock.moveLeft();
  }

  else if (keyCode === ENTER) {
    tetris.newBlock.addToMaster();
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
      stroke("white");
      rect(x*cellSize+buffer, y*cellSize, cellSize, cellSize);
    }
  }
}

class Tetris {
  constructor() {
    this.masterGrid = createEmptyGrid();
    this.spawnNewBlock();
  }

  spawnNewBlock() {
    this.newBlock = new Block();
  }

  fillBoard() {
    let colors = ["lightblue", "blue", "orange", "yellow", "lightgreen", "purple", "red"];
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
    if (millis() > waitTime + 750) {
      waitTime = millis();
      this.newBlock.moveDown();
    }
  }
}

class Block {
  constructor() {

    this.x = 3;
    this.y = 0;
    this.currentBlock = random([block1, block2, block3, block4, block5, block6, block7]);
    // this.currentBlock = this.block1;

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

  // NEED TO ADD INSANITY CHECKS FOR ALL OF THESE
  moveDown() {
    if (this.checkVerticalCollision()) {
      return;
    }
    for (let i = 0; i < this.currentBlock[0].length; i++) {
      this.currentBlockGrid[this.y][this.x+i] = 0;
    }
    this.y++;
  }

  moveRight() {
    if (this.checkRightCollision()) {
      return;
    }
    for (let i = 0; i < this.currentBlock.length; i++) {
      this.currentBlockGrid[this.y+i][this.x] = 0;
    }
    this.x++;
  }

  moveLeft() {
    if (this.checkLeftCollision()) {
      return;
    }
    for (let i = 0; i < this.currentBlock.length; i++) {
      this.currentBlockGrid[this.y+i][this.x+this.currentBlock[i].length-1] = 0;
    }
    this.x--;
  }

  checkVerticalCollision() {
    // check if out of bounds
    if (this.y + this.currentBlock.length >= 20) {
      return true;
    }

    for (let i = 0; i < this.currentBlock.length; i++) {
      for (let j = 0; j < this.currentBlock[i].length; j++) {
        this.currentBlockGrid[this.y+i][this.x+j] = 0;
      }
    }

    return false;
  }

  checkRightCollision() {
    if (this.x + this.currentBlock[0].length >= 10) {
      return true;
    }
    return false;
  }

  checkLeftCollision() {
    if (this.x <= 0) {
      return true;
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
    if (this.y + this.currentBlock.length >= 20) {
      return true;
    }
  }
}
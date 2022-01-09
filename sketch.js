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
  tetris.clearRowIfDone();

  if (tetris.newBlock.checkBlockPlaced() || tetris.newBlock.checkVerticalCollision()) {
    tetris.newBlock.addToMaster();
  }
  else {
    tetris.autoMoveBlock();
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

  else if (keyCode === 32) {
    tetris.newBlock.hardDrop();
    // tetris.newBlock.addToMaster();
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

  clearRowIfDone() {
    for (let i = this.masterGrid.length - 1; i > 0; i--) {
      // for (let j = 0; j < this.masterGrid[i].length; j++) {}
      if (!this.masterGrid[i].includes(0)) {
        console.log("true");
        this.masterGrid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); 
        this.masterGrid.pop();
      }
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
    }

    else if (this.currentBlock.length === 3 && this.currentBlock[0].length === 2) {
      this.currentBlock = [
        [this.currentBlock[2][0], this.currentBlock[1][0], this.currentBlock[0][0]],
        [this.currentBlock[2][1], this.currentBlock[1][1], this.currentBlock[0][1]]
      ];
    }

    else if (this.currentBlock.length === 4) {
      this.currentBlock = block1;
    }

    // else {
    //   this.currentBlock = this.currentBlock;
    // }

    this.currentBlockGrid = createEmptyGrid();
    // this.currentBlock = this.currentBlock;
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
      // return;
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
    // return;
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
}
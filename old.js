// Tetris 
// Kayaan "wjhere is the wifi" Tharani (with help of Johnson "monkeytype" Ji)
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let board;
let cellSize;
let tetris; 
// let newBlock;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellSize = height/20;
  
  board = createEmptyBoard();
  console.log(board);

  tetris = new Tetris(); 
  // tetris.spawnNewBlock();

  // newBlock = new Block();
}

function draw() { 
  background(0);
  drawGrid();
  tetris.fillBoard();
}

function createEmptyBoard() {
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
  let buffer = width/2 - 10*cellSize/2;
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      noFill();
      stroke("white");
      rect(x*cellSize+buffer, y*cellSize, cellSize, cellSize);
    }
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    tetris.newBlock.callMoveBlockDown();
  }
  if (keyCode === 32) {
    tetris.newBlock.addToRealGrid();
  }
  if (keyCode === RIGHT_ARROW) {
    tetris.newBlock.moveLeftAndRight();
  }
}

class Tetris {
  constructor() {
    this.masterGrid = createEmptyBoard();
    this.spawnNewBlock();
    // setInterval(this.newBlock.moveBlockDown, 1000);
  }

  spawnNewBlock() {
    this.newBlock = new Block();
  }

  fillBoard() {
    let buffer = width/2 - 10*cellSize/2;
    for (let y = 0; y < this.masterGrid.length; y++) {
      for (let x = 0; x < this.masterGrid[y].length; x++) {
        if (this.masterGrid[y][x] === 1 || this.newBlock.currentBlockGrid[y][x]) {
          fill("red");
          rect(x*cellSize+buffer, y*cellSize, cellSize, cellSize);
        }
      }
    }
  }
}

class Block {
  constructor() {
    this.whichBlock = random([1,2,3,4,5,6,7]);
    this.currentRow = 0;
    this.currentBlockGrid = createEmptyBoard();

    if (this.whichBlock === 1) { // i block
      this.currentBlockGrid[0][4] = 1;
      this.currentBlockGrid[1][4] = 1;
      this.currentBlockGrid[2][4] = 1; 
    }
    else if (this.whichBlock === 2) { // o block
      this.currentBlockGrid[0][4] = 1;
      this.currentBlockGrid[1][4] = 1;
      this.currentBlockGrid[1][5] = 1; 
      this.currentBlockGrid[0][5] = 1; 
      
    }
    else if (this.whichBlock === 3) { // j block
      this.currentBlockGrid[0][4] = 1;
      this.currentBlockGrid[1][4] = 1;
      this.currentBlockGrid[1][5] = 1;
      this.currentBlockGrid[1][6] = 1;
    }
    else if (this.whichBlock === 4) { // l block
      this.currentBlockGrid[0][6] = 1;
      this.currentBlockGrid[1][4] = 1;
      this.currentBlockGrid[1][5] = 1;
      this.currentBlockGrid[1][6] = 1;
    }
    else if (this.whichBlock === 5) { // z block
      this.currentBlockGrid[0][4] = 1;
      this.currentBlockGrid[0][5] = 1;
      this.currentBlockGrid[1][5] = 1;
      this.currentBlockGrid[1][6] = 1;
    }
    else if (this.whichBlock === 6) { // s block 
      this.currentBlockGrid[1][4] = 1;
      this.currentBlockGrid[0][5] = 1;
      this.currentBlockGrid[1][5] = 1;
      this.currentBlockGrid[0][6] = 1;
    }   
    else if (this.whichBlock === 7) { // t block
      this.currentBlockGrid[0][5] = 1;
      this.currentBlockGrid[1][4] = 1;
      this.currentBlockGrid[1][5] = 1;
      this.currentBlockGrid[1][6] = 1;
    }
    // setInterval(this.callMoveBlockDown, 1000);

  }

  moveBlockDown(i, x) {
    if (this.whichBlock === 1) {
      if (i+3 < tetris.masterGrid.length && tetris.masterGrid[i + 3][0] === 0 ) {
        // this.currentBlockGrid[i][x] = 0;
        // this.currentBlockGrid[i + 1][x] = 1;
        // this.currentBlockGrid[i + 2][x] = 1;
        // this.currentBlockGrid[i + 3][x] = 1;
        this.currentBlockGrid.pop();
        this.currentBlockGrid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
      else {
        this.addToRealGrid();
      }
    }
    else if (this.whichBlock === 2) {
      if (i + 2 < tetris.masterGrid.length && tetris.masterGrid[i+2][0] === 0 && tetris.masterGrid[i+2][1] === 0) {   
        // this.currentBlockGrid[i][x] = 0;
        // this.currentBlockGrid[i+1][x] = 1;
        // this.currentBlockGrid[i+2][x] = 1;
  
        // this.currentBlockGrid[i][x+1] = 0;
        // this.currentBlockGrid[i+1][x+1] = 1;
        // this.currentBlockGrid[i+2][x+1] = 1;
        this.currentBlockGrid.pop();
        this.currentBlockGrid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
      else {
        this.addToRealGrid();
      }
    }
    else if (this.whichBlock === 3) {
      if (i + 2 < tetris.masterGrid.length && tetris.masterGrid[i+2][0] === 0 && tetris.masterGrid[i+2][1] === 0 && tetris.masterGrid[i+2][2] === 0) {   
        // this.currentBlockGrid[i][x] = 0;
        // this.currentBlockGrid[i+1][x] = 1;
        // this.currentBlockGrid[i+2][x] = 1;

        // this.currentBlockGrid[i+1][x+1] = 0;
        // this.currentBlockGrid[i+2][x+1] = 1;

        // this.currentBlockGrid[i+1][x+2] = 0;
        // this.currentBlockGrid[i+2][x+2] = 1;
        this.currentBlockGrid.pop();
        this.currentBlockGrid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
      else {
        this.addToRealGrid();
      }
    }
    else if (this.whichBlock === 4) {
      if (i + 2 < tetris.masterGrid.length && tetris.masterGrid[i+2][0] === 0 && tetris.masterGrid[i+2][1] === 0 && tetris.masterGrid[i+2][2] === 0) {   
        // this.currentBlockGrid[i][x+2] = 0;
        // this.currentBlockGrid[i+1][x+2] = 1;
        // this.currentBlockGrid[i+2][x+2] = 1;

        // this.currentBlockGrid[i+1][x] = 0;
        // this.currentBlockGrid[i+2][x] = 1;

        // this.currentBlockGrid[i+1][x+1] = 0;
        // this.currentBlockGrid[i+2][x+1] = 1;
        this.currentBlockGrid.pop();
        this.currentBlockGrid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
      else {
        this.addToRealGrid();
      }
    }
    else if (this.whichBlock === 5) {
      if (i + 2 < tetris.masterGrid.length && tetris.masterGrid[i+1][0] === 0 && tetris.masterGrid[i+2][1] === 0 && tetris.masterGrid[i+2][2] === 0) {   
        // this.currentBlockGrid[i][x] = 0;
        // this.currentBlockGrid[i+1][x] = 1;

        // this.currentBlockGrid[i][x+1] = 0;
        // this.currentBlockGrid[i+1][x+1] = 1;
        // this.currentBlockGrid[i+2][x+1] = 1;

        // this.currentBlockGrid[i+1][x+2] = 0;
        // this.currentBlockGrid[i+2][x+2] = 1;
        this.currentBlockGrid.pop();
        this.currentBlockGrid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

      }
      else {
        this.addToRealGrid();
      }
    }
    else if (this.whichBlock === 6) {
      if (i + 2 < tetris.masterGrid.length && tetris.masterGrid[i+2][0] === 0 && tetris.masterGrid[i+2][1] === 0 && tetris.masterGrid[i+1][2] === 0) {   
        // this.currentBlockGrid[i+1][x] = 0;
        // this.currentBlockGrid[i+2][x] = 1;

        // this.currentBlockGrid[i][x+1] = 0;
        // this.currentBlockGrid[i+1][x+1] = 1;
        // this.currentBlockGrid[i+2][x+1] = 1;

        // this.currentBlockGrid[i][x+2] = 0;
        // this.currentBlockGrid[i+1][x+2] = 1;
        this.currentBlockGrid.pop();
        this.currentBlockGrid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
      else {
        this.addToRealGrid();
      }
    }
    else if (this.whichBlock === 7) {
      if (i + 2 < tetris.masterGrid.length && tetris.masterGrid[i+2][0] === 0 && tetris.masterGrid[i+2][1] === 0 && tetris.masterGrid[i+2][2] === 0) {   
        // this.currentBlockGrid[i][x+1] = 0;
        // this.currentBlockGrid[i+1][x+1] = 1;
        // this.currentBlockGrid[i+2][x+1] = 1;

        // this.currentBlockGrid[i+1][x] = 0;
        // this.currentBlockGrid[i+2][x] = 1;
        // this.currentBlockGrid[i+1][x+2] = 0;
        // this.currentBlockGrid[i+2][x+2] = 1;
        this.currentBlockGrid.pop();
        this.currentBlockGrid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
      else {
        this.addToRealGrid();
      }
    }
  }

  callMoveBlockDown() {
    this.leftMostX;
    for (let i = 0; i < this.currentBlockGrid[this.currentRow].length; i++) {
      if (this.currentBlockGrid[this.currentRow][i] === 1) {
        this.leftMostX = i;
      }
    }
    this.moveBlockDown(this.currentRow, this.leftMostX);
    this.currentRow++;
  }

  moveLeftAndRight(direction) {
    // if (direction === "right") { 
      
    // }
    // else if (direction === "left") {

    // }
    for (let y = 0; y < tetris.masterGrid.length; y++) {
      for (let y = 0; y < tetris.masterGrid.length; y++) {
        if (this.currentBlockGrid[y][tetris.masterGrid[y].length-1] !== 0) {
          // return;
        }
      }

      if (this.currentBlockGrid[y][tetris.masterGrid[y].length-1] === 0) {
        this.currentBlockGrid[y].pop();
        this.currentBlockGrid[y].unshift(0);
      }
    }
  }

  rotateBlock() {
    
  }

  addToRealGrid() {
    for (let y = 0; y < tetris.masterGrid.length; y++) {
      for (let x = 0; x < tetris.masterGrid[y].length; x++) {
        if (this.currentBlockGrid[y][x] === 1) {
          tetris.masterGrid[y][x] = 1;
        }
      }
    }
    tetris.spawnNewBlock();
  }
}   
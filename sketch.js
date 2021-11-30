// Tetris 
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let board;
let cellSize;
let tetris;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellSize = height/20;
  
  board = createEmptyBoard();
  console.log(board);

  tetris = new Tetris();
  tetris.createBlock();
}

function draw() { 
  background(0);
  drawGrid();
  tetris.fillBoard();
  tetris.callMoveBlockDown();
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



class Tetris {
  constructor() {
    this.block = createEmptyBoard();
  }

  createBlock() {
    this.whichBlock = 7;

    if (this.whichBlock === 1) {
      this.block[0][0] = 1;
      this.block[1][0] = 1;
      this.block[2][0] = 1;  
    }

    else if (this.whichBlock === 2) {
      this.block[0][0] = 1;
      this.block[1][0] = 1;
      this.block[1][1] = 1; 
      this.block[0][1] = 1; 
      
    }

    else if (this.whichBlock === 3) {
      this.block[0][0] = 1;
      this.block[1][0] = 1;
      this.block[1][1] = 1;
      this.block[1][2] = 1;
    }
    else if (this.whichBlock === 4) {
      this.block[0][2] = 1;
      this.block[1][0] = 1;
      this.block[1][1] = 1;
      this.block[1][2] = 1;
    }
    else if (this.whichBlock === 5) {
      this.block[0][0] = 1;
      this.block[0][1] = 1;
      this.block[1][1] = 1;
      this.block[1][2] = 1;
    }
    else if (this.whichBlock === 6) {
      this.block[1][0] = 1;
      this.block[0][1] = 1;
      this.block[1][1] = 1;
      this.block[2][1] = 1;
    }

    else if (this.whichBlock === 7) {
      this.block[0][1] = 1;
      this.block[1][0] = 1;
      this.block[1][1] = 1;
      this.block[1][2] = 1;
    }
  }

  fillBoard() {
    let buffer = width/2 - 10*cellSize/2;
    for (let y = 0; y < this.block.length; y++) {
      for (let x = 0; x < this.block[y].length; x++) {
        if (this.block[y][x] === 1) {
          fill("red");
          rect(x*cellSize+buffer, y*cellSize, cellSize, cellSize);
        }
      }
    }
  }

  moveBlockDown(i) {
    if (this.whichBlock === 1) {
      this.block[i][0] = 0;
      this.block[i + 1][0] = 1;
      this.block[i + 2][0] = 1;
      this.block[i + 3][0] = 1;
    }
    else if (this.whichBlock === 2) {
      this.block[i][0] = 0;
      this.block[i+1][0] = 1;
      this.block[i+2][0] = 1;

      this.block[i][1] = 0;
      this.block[i+1][1] = 1;
      this.block[i+2][1] = 1;
    }
    else if (this.whichBlock === 3) {
      this.block[i][0] = 0;
      this.block[i+1][0] = 1;
      this.block[i+2][0] = 1;

      this.block[i+1][1] = 0;
      this.block[i+2][1] = 1;

      this.block[i+1][2] = 0;
      this.block[i+2][2] = 1;
    }
    else if (this.whichBlock === 4) {
      this.block[i][2] = 0;
      this.block[i+1][2] = 1;
      this.block[i+2][2] = 1;

      this.block[i][0] = 0;
      this.block[i+1][0] = 1;

      this.block[i][1] = 0;
      this.block[i+1][1] = 1;
    }
    else if (this.whichBlock === 5) {
      this.block[i][0] = 0;
      this.block[i+1][0] = 1;

      this.block[i][1] = 0;
      this.block[i+1][1] = 1;
      this.block[i+2][1] = 1;

      this.block[i+1][2] = 0;
      this.block[i+2][2] = 1;
    }
    else if (this.whichBlock === 6) {
      this.block[i+1][0] = 0;
      this.block[i+2][0] = 1;

      this.block[i][1] = 0;
      this.block[i+1][1] = 1;
      this.block[i+2][1] = 1;

      this.block[i][2] = 0;
      this.block[i+1][2] = 1;
    }
    else if (this.whichBlock === 7) {
      this.block[i][1] = 0;
      this.block[i+1][1] = 1;
      this.block[i+2][1] = 1;

      this.block[i+1][0] = 0;
      this.block[i+2][0] = 1;
      this.block[i+1][2] = 0;
      this.block[i+2][2] = 1;
    }
  }

  callMoveBlockDown(current) {
    for (this.i = 0; this.i < 15; this.i++) {
      this.moveBlockDown(this.i);
    }
  }
}

class Block {
  constructor() {
    this.whichBlock;
  }
}
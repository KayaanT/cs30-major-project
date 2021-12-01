// Tetris 
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let board;
let cellSize;
let tetris, newBlock;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellSize = height/20;
  
  board = createEmptyBoard();
  console.log(board);

  tetris = new Tetris();

  newBlock = new Block();
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
    newBlock.callMoveBlockDown();
  }
}

class Tetris {
  constructor() {
    this.BlockGrid = createEmptyBoard();
  }

  fillBoard() {
    let buffer = width/2 - 10*cellSize/2;
    for (let y = 0; y < this.BlockGrid.length; y++) {
      for (let x = 0; x < this.BlockGrid[y].length; x++) {
        if (this.BlockGrid[y][x] === 1) {
          fill("red");
          rect(x*cellSize+buffer, y*cellSize, cellSize, cellSize);
        }
      }
    }
  }



}

class Block {
  constructor() {
    // this.whichBlock = random([1,2,3,4,5,6,7]);
    this.whichBlock = 7;
    this.currentRow = 0;

    if (this.whichBlock === 1) { // i block
      tetris.BlockGrid[0][0] = 1;
      tetris.BlockGrid[1][0] = 1;
      tetris.BlockGrid[2][0] = 1; 
    }
  
    else if (this.whichBlock === 2) { // o block
      tetris.BlockGrid[0][0] = 1;
      tetris.BlockGrid[1][0] = 1;
      tetris.BlockGrid[1][1] = 1; 
      tetris.BlockGrid[0][1] = 1; 
      
    }
  
    else if (this.whichBlock === 3) { // j block
      tetris.BlockGrid[0][0] = 1;
      tetris.BlockGrid[1][0] = 1;
      tetris.BlockGrid[1][1] = 1;
      tetris.BlockGrid[1][2] = 1;
    }
    else if (this.whichBlock === 4) { // l block
      tetris.BlockGrid[0][2] = 1;
      tetris.BlockGrid[1][0] = 1;
      tetris.BlockGrid[1][1] = 1;
      tetris.BlockGrid[1][2] = 1;
    }
    else if (this.whichBlock === 5) { // z block
      tetris.BlockGrid[0][0] = 1;
      tetris.BlockGrid[0][1] = 1;
      tetris.BlockGrid[1][1] = 1;
      tetris.BlockGrid[1][2] = 1;
    }
    else if (this.whichBlock === 6) { // s block 
      tetris.BlockGrid[1][0] = 1;
      tetris.BlockGrid[0][1] = 1;
      tetris.BlockGrid[1][1] = 1;
      tetris.BlockGrid[0][2] = 1;
    }
  
    else if (this.whichBlock === 7) { // t block
      tetris.BlockGrid[0][1] = 1;
      tetris.BlockGrid[1][0] = 1;
      tetris.BlockGrid[1][1] = 1;
      tetris.BlockGrid[1][2] = 1;
    }
  }

  moveBlockDown(i) {
    if (this.whichBlock === 1) {
      tetris.BlockGrid[i][0] = 0;
      tetris.BlockGrid[i + 1][0] = 1;
      tetris.BlockGrid[i + 2][0] = 1;
      tetris.BlockGrid[i + 3][0] = 1;
    }
    else if (this.whichBlock === 2) {
      tetris.BlockGrid[i][0] = 0;
      tetris.BlockGrid[i+1][0] = 1;
      tetris.BlockGrid[i+2][0] = 1;

      tetris.BlockGrid[i][1] = 0;
      tetris.BlockGrid[i+1][1] = 1;
      tetris.BlockGrid[i+2][1] = 1;
    }
    else if (this.whichBlock === 3) {
      tetris.BlockGrid[i][0] = 0;
      tetris.BlockGrid[i+1][0] = 1;
      tetris.BlockGrid[i+2][0] = 1;

      tetris.BlockGrid[i+1][1] = 0;
      tetris.BlockGrid[i+2][1] = 1;

      tetris.BlockGrid[i+1][2] = 0;
      tetris.BlockGrid[i+2][2] = 1;
    }
    else if (this.whichBlock === 4) {
      tetris.BlockGrid[i][2] = 0;
      tetris.BlockGrid[i+1][2] = 1;
      tetris.BlockGrid[i+2][2] = 1;

      tetris.BlockGrid[i+1][0] = 0;
      tetris.BlockGrid[i+2][0] = 1;

      tetris.BlockGrid[i+1][1] = 0;
      tetris.BlockGrid[i+2][1] = 1;
    }
    else if (this.whichBlock === 5) {
      tetris.BlockGrid[i][0] = 0;
      tetris.BlockGrid[i+1][0] = 1;

      tetris.BlockGrid[i][1] = 0;
      tetris.BlockGrid[i+1][1] = 1;
      tetris.BlockGrid[i+2][1] = 1;

      tetris.BlockGrid[i+1][2] = 0;
      tetris.BlockGrid[i+2][2] = 1;
    }
    else if (this.whichBlock === 6) {
      tetris.BlockGrid[i+1][0] = 0;
      tetris.BlockGrid[i+2][0] = 1;

      tetris.BlockGrid[i][1] = 0;
      tetris.BlockGrid[i+1][1] = 1;
      tetris.BlockGrid[i+2][1] = 1;

      tetris.BlockGrid[i][2] = 0;
      tetris.BlockGrid[i+1][2] = 1;
    }
    else if (this.whichBlock === 7) {
      tetris.BlockGrid[i][1] = 0;
      tetris.BlockGrid[i+1][1] = 1;
      tetris.BlockGrid[i+2][1] = 1;

      tetris.BlockGrid[i+1][0] = 0;
      tetris.BlockGrid[i+2][0] = 1;
      tetris.BlockGrid[i+1][2] = 0;
      tetris.BlockGrid[i+2][2] = 1;
    }
  }

  callMoveBlockDown() {
    // for (this.i = 0; this.i < 1; this.i++) {
    //   this.moveBlockDown(this.i);
    // }
    this.moveBlockDown(this.currentRow);
    this.currentRow++;
  }

  moveLeftAndRight() {
    // if (keyIsDown(RIGHT_ARROW)) {
    //   tetris.BlockGrid;
    // }
  }
}
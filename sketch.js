// Tetris 
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let board;
let cellSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellSize = height/20;
  
  board = createEmptyBoard();
  console.log(board);
}

function draw() {
  background(0);
  drawGrid();
  createBlock();
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

function createBlock() {
  let block = createEmptyBoard();

  block[0][0] = 1;
  block[1][0] = 1;
  block[2][0] = 1;

  let buffer = width/2 - 10*cellSize/2;
  for (let y = 0; y < block.length; y++) {
    for (let x = 0; x < block[y].length; x++) {
      if (block[y][x] === 1) {
        fill("red");
        rect(x*cellSize+buffer, y*cellSize, cellSize, cellSize);
      }
    }
  }
}
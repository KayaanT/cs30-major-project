// Tetris 
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let board;

function setup() {
  createCanvas(windowWidth/4, windowHeight);
  board = createEmptyBoard();
  console.log(board);
}

function draw() {
  background(0);
  drawGrid();
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
  let cellWidth = width/10;
  let cellHeight = height/20;

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      noFill();
      stroke("white");
      rect(x*cellWidth, y*cellHeight, cellWidth, cellHeight);
    }
  }
}
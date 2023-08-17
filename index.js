import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LINE_WIDTH,
  CELL_SIZE,
  LETTERS,
} from "./const.js";

import { images } from "./images.js";

import Board from "./classes/Board.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const resetButton = document.querySelector("#reset");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = LINE_WIDTH;

const board = new Board(ctx);

let currentPiece = "";
let currentCell = "";
let currentBoardState = {};
let isDragging = false;
let mouseX = "";
let mouseY = "";

const determineCell = (e) => {
  const rect = e.target.getBoundingClientRect();
  const { clientX, clientY } = e;
  const x = Math.floor((clientX - rect.left) / CELL_SIZE) + 1;
  const y = Math.floor((clientY - rect.top) / CELL_SIZE) + 1;
  const cell = board.boardData[LETTERS[x] + y];
  return cell;
};

// Event Handlers
const handleMouseDown = (e) => {
  currentBoardState = board.boardData;
  currentCell = determineCell(e);
  if (currentCell.piece) {
    const rect = e.target.getBoundingClientRect();
    const { clientX, clientY } = e;
    mouseX = clientX - rect.left;
    mouseY = clientY - rect.top;
    isDragging = true;
    currentPiece = currentCell.piece;
  }
};

const handleMouseMove = (e) => {
  if (isDragging) {
    currentCell.piece = "";
    const rect = e.target.getBoundingClientRect();
    const { clientX, clientY } = e;
    mouseX = clientX - rect.left;
    mouseY = clientY - rect.top;
    board.draw();
    ctx.drawImage(
      currentPiece.image,
      mouseX - CELL_SIZE / 2,
      mouseY - CELL_SIZE / 2,
      CELL_SIZE,
      CELL_SIZE
    );
  }
};

const handleMouseUp = (e) => {
  isDragging = false;
  const newCell = determineCell(e);
  newCell.piece = currentPiece;
  board.draw();
};

const resetBoard = () => {
  board.init();
};

// Event Listeners
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

resetButton.addEventListener("click", resetBoard);

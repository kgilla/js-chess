import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LINE_WIDTH,
  CELL_SIZE,
  LETTERS,
} from "./const.js";

import Board from "./classes/Board.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = LINE_WIDTH;

const board = new Board(ctx);

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
  const cell = determineCell(e);
  console.log("Mouse down on:" + cell);
};

const handleMouseUp = (e) => {
  const cell = determineCell(e);
  console.log("Mouse up on:" + e);
};

// Event Listeners
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", handleMouseUp);

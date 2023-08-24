import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LINE_WIDTH,
  CELL_SIZE,
  LETTERS,
} from "./const.js";

import Board from "./classes/Board.js";
import Game from "./classes/Game.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const resetButton = document.querySelector("#reset");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = LINE_WIDTH;

const board = new Board(ctx);
const game = new Game();

const determineCell = (e) => {
  const rect = e.target.getBoundingClientRect();
  const { clientX, clientY } = e;
  const x = Math.floor((clientX - rect.left) / CELL_SIZE) + 1;
  const y = Math.floor((clientY - rect.bottom) / CELL_SIZE) * -1;
  console.log(y);
  const cell = board.data[LETTERS[x] + y];
  return cell;
};

// Event Handlers
const handleMouseDown = (e) => {
  game.currentCell = determineCell(e);
  if (game.currentCell.piece) {
    game.isDragging = true;
    game.currentPiece = game.currentCell.piece;
  }
};

const handleMouseMove = (e) => {
  if (game.isDragging) {
    game.currentCell.piece.isHidden = true;
    const rect = e.target.getBoundingClientRect();
    const { clientX, clientY } = e;
    const x = clientX - rect.left - CELL_SIZE / 2;
    const y = clientY - rect.top - CELL_SIZE / 2;
    board.draw();
    ctx.drawImage(game.currentPiece.image, x, y, CELL_SIZE - 5, CELL_SIZE - 5);
  }
};

const handleMouseUp = (e) => {
  game.isDragging = false;
  const newCell = determineCell(e);

  // should check if move is legal
  game.currentPiece.showMoves(game.currentCell, newCell, game.currentPiece);
  game.currentCell.piece = "";
  game.currentPiece.isHidden = false;
  newCell.piece = game.currentPiece;
  board.draw();
  game.clearState();
};

const resetBoard = () => {
  board.init();
  game.clearState();
};

// Event Listeners
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

resetButton.addEventListener("click", resetBoard);

import { CANVAS_WIDTH, CANVAS_HEIGHT, LINE_WIDTH, CELL_SIZE } from "./const.js";

import Game from "./classes/Game.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const resetButton = document.querySelector("#reset");
const turn = document.querySelector("#turn");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = LINE_WIDTH;

let isDragging = false;

const game = new Game(ctx);

const determineCell = (e) => {
  const rect = e.target.getBoundingClientRect();
  const { clientX, clientY } = e;
  const x = Math.floor((clientX - rect.left) / CELL_SIZE);
  const y = Math.floor((clientY - rect.top) / CELL_SIZE);
  const cell = game.board.data[`${x}${y}`];
  return cell;
};

// Event Handlers
const handleMouseDown = (e) => {
  if (e.which !== 1) return;
  game.currentCell = determineCell(e);
  if (game.currentCell.piece && game.currentCell.piece.color === game.turn) {
    isDragging = true;
    game.currentPiece = game.currentCell.piece;
    game.createLegalMoves();
  }
};

const handleMouseMove = (e) => {
  if (isDragging) {
    game.currentCell.piece.isHidden = true;
    const rect = e.target.getBoundingClientRect();
    const { clientX, clientY } = e;
    const x = clientX - rect.left - CELL_SIZE / 2;
    const y = clientY - rect.top - CELL_SIZE / 2;
    game.board.draw();
    ctx.drawImage(game.currentPiece.image, x, y, CELL_SIZE - 5, CELL_SIZE - 5);
  }
};

const handleMouseUp = (e) => {
  isDragging = false;
  const newCell = determineCell(e);
  if (game.legalMoves.some((move) => move === newCell)) {
    game.currentCell.piece = "";
    game.currentPiece.isHidden = false;
    newCell.piece = game.currentPiece;
    game.board.removeHighlights();
    game.board.draw();
    game.handleTurnFinish();
  } else {
    if (game.currentPiece) game.currentPiece.isHidden = false;
  }
  game.board.removeHighlights();
  game.board.draw();
  game.clearState();
  updateUI();
  console.log(game.board.data);
};

const newGame = () => {
  game = new Game(ctx);
};

const updateUI = () => {
  turn.textContent = game.turn;
};

// Event Listeners
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

resetButton.addEventListener("click", newGame);
